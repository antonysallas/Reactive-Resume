import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ResumeDto } from "@reactive-resume/dto";
import { ErrorMessage } from "@reactive-resume/utils";
import retry from "async-retry";
import { PDFDocument } from "pdf-lib";
import { connect } from "puppeteer";

import { Config } from "../config/schema";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class PrinterService {
  private readonly logger = new Logger(PrinterService.name);

  private readonly browserURL: string;

  private readonly ignoreHTTPSErrors: boolean;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly storageService: StorageService,
    private readonly httpService: HttpService,
  ) {
    const chromeUrl = this.configService.getOrThrow<string>("CHROME_URL");
    const chromeToken = this.configService.getOrThrow<string>("CHROME_TOKEN");

    this.browserURL = `${chromeUrl}?token=${chromeToken}`;
    this.ignoreHTTPSErrors = this.configService.getOrThrow<boolean>("CHROME_IGNORE_HTTPS_ERRORS");
  }

  private async getBrowser() {
    try {
      return await connect({
        browserWSEndpoint: this.browserURL,
        acceptInsecureCerts: this.ignoreHTTPSErrors,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ErrorMessage.InvalidBrowserConnection,
        (error as Error).message,
      );
    }
  }

  async getVersion() {
    const browser = await this.getBrowser();
    const version = await browser.version();
    await browser.disconnect();
    return version;
  }

  async printResume(resume: ResumeDto) {
    const start = performance.now();

    const url = await retry<string | undefined>(() => this.generateResume(resume), {
      retries: 3,
      randomize: true,
      onRetry: (_, attempt) => {
        this.logger.log(`Retrying to print resume #${resume.id}, attempt #${attempt}`);
      },
    });

    const duration = Number(performance.now() - start).toFixed(0);
    const numberPages = resume.data.metadata.layout.length;

    this.logger.debug(`Chrome took ${duration}ms to print ${numberPages} page(s)`);

    return url;
  }

  async printPreview(resume: ResumeDto) {
    const start = performance.now();

    const url = await retry(() => this.generatePreview(resume), {
      retries: 3,
      randomize: true,
      onRetry: (_, attempt) => {
        this.logger.log(
          `Retrying to generate preview of resume #${resume.id}, attempt #${attempt}`,
        );
      },
    });

    const duration = Number(performance.now() - start).toFixed(0);

    this.logger.debug(`Chrome took ${duration}ms to generate preview`);

    return url;
  }

  async generateResume(resume: ResumeDto) {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      const publicUrl = this.configService.getOrThrow<string>("PUBLIC_URL");
      const storageUrl = this.configService.getOrThrow<string>("STORAGE_URL");

      let url = publicUrl;

      const localhostUrls = [publicUrl, storageUrl].filter((url) => url.includes("localhost"));
      console.log('localhostUrls in generateResume:', localhostUrls);

      if (localhostUrls.length > 0) {
        // Switch client URL from `localhost` to `host.docker.internal` in development
        // This bypasses internal container networking that may be causing HTTPS redirects
        url = url.replace("localhost", "host.docker.internal");

        await page.setRequestInterception(true);

        // Extract localhost hostnames to replace with host.docker.internal
        const localhostHosts = new Set(
          localhostUrls
            .map((urlString) => {
              try {
                return new URL(urlString).host;
              } catch {
                return null;
              }
            })
            .filter(Boolean),
        );
        console.log('localhostHosts:', localhostHosts);


        // Intercept requests to localhost hosts and redirect to internal service names
        page.on("request", (request) => {
          try {
            const requestUrl = new URL(request.url());
            const needsReplacement = localhostHosts.has(requestUrl.host);

            if (needsReplacement) {
              let modifiedUrl = request.url();

              // Replace localhost:3000 with host.docker.internal:3000 (main application)
              if (requestUrl.port === "3000" || requestUrl.hostname === "localhost") {
                modifiedUrl = modifiedUrl.replace(requestUrl.hostname, "host.docker.internal");
              }
              // Replace localhost:9000 with minio:9000 (MinIO storage)
              else if (requestUrl.port === "9000") {
                modifiedUrl = modifiedUrl.replace(requestUrl.hostname, "minio");
              }
              // Fallback for other localhost URLs
              else {
                modifiedUrl = modifiedUrl.replace(requestUrl.hostname, "host.docker.internal");
              }

              console.log(`Replacing request URL in generateResume: ${request.url()} -> ${modifiedUrl}`);
              void request.continue({ url: modifiedUrl });
            } else {
              void request.continue();
            }
          } catch {
            void request.continue();
          }
        });
      }

      // Set the data of the resume to be printed in the browser's session storage
      const numberPages = resume.data.metadata.layout.length;

      await page.evaluateOnNewDocument((data) => {
        window.localStorage.setItem("resume", JSON.stringify(data));
      }, resume.data);

      console.log(`Attempting to navigate to: ${url}/artboard/preview`);

      await page.goto(`${url}/artboard/preview`, {
        waitUntil: "networkidle0",
        timeout: 30000
      });

      const pagesBuffer: Buffer[] = [];

      const processPage = async (index: number) => {
        const pageElement = await page.$(`[data-page="${index}"]`);
        // eslint-disable-next-line unicorn/no-await-expression-member
        const width = (await (await pageElement?.getProperty("scrollWidth"))?.jsonValue()) ?? 0;
        // eslint-disable-next-line unicorn/no-await-expression-member
        const height = (await (await pageElement?.getProperty("scrollHeight"))?.jsonValue()) ?? 0;

        const temporaryHtml = await page.evaluate((element: HTMLDivElement) => {
          const clonedElement = element.cloneNode(true) as HTMLDivElement;
          const temporaryHtml_ = document.body.innerHTML;
          document.body.innerHTML = clonedElement.outerHTML;
          return temporaryHtml_;
        }, pageElement);

        // Apply custom CSS, if enabled
        const css = resume.data.metadata.css;

        if (css.visible) {
          await page.evaluate((cssValue: string) => {
            const styleTag = document.createElement("style");
            styleTag.textContent = cssValue;
            document.head.append(styleTag);
          }, css.value);
        }

        const uint8array = await page.pdf({ width, height, printBackground: true });
        const buffer = Buffer.from(uint8array);
        pagesBuffer.push(buffer);

        await page.evaluate((temporaryHtml_: string) => {
          document.body.innerHTML = temporaryHtml_;
        }, temporaryHtml);
      };

      // Loop through all the pages and print them, by first displaying them, printing the PDF and then hiding them back
      for (let index = 1; index <= numberPages; index++) {
        await processPage(index);
      }

      // Using 'pdf-lib', merge all the pages from their buffers into a single PDF
      const pdf = await PDFDocument.create();

      for (const element of pagesBuffer) {
        const page = await PDFDocument.load(element);
        const [copiedPage] = await pdf.copyPages(page, [0]);
        pdf.addPage(copiedPage);
      }

      // Save the PDF to storage and return the URL to download the resume
      // Store the URL in cache for future requests, under the previously generated hash digest
      const buffer = Buffer.from(await pdf.save());

      // This step will also save the resume URL in cache
      const resumeUrl = await this.storageService.uploadObject(
        resume.userId,
        "resumes",
        buffer,
        resume.title,
      );

      // Close all the pages and disconnect from the browser
      await page.close();
      await browser.disconnect();

      return resumeUrl;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        ErrorMessage.ResumePrinterError,
        (error as Error).message,
      );
    }
  }

  async generatePreview(resume: ResumeDto) {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    const publicUrl = this.configService.getOrThrow<string>("PUBLIC_URL");
    const storageUrl = this.configService.getOrThrow<string>("STORAGE_URL");

    let url = publicUrl;

    const localhostUrls = [publicUrl, storageUrl].filter((url) => url.includes("localhost"));
    console.log('localhostUrls in generatePreview:', localhostUrls);

    if (localhostUrls.length > 0) {
      // Switch client URL from `localhost` to `host.docker.internal` in development
      // This bypasses internal container networking that may be causing HTTPS redirects
      url = url.replace("localhost", "host.docker.internal");

      await page.setRequestInterception(true);

      // Extract localhost hostnames to replace with host.docker.internal
      const localhostHosts = new Set(
        localhostUrls
          .map((urlString) => {
            try {
              return new URL(urlString).host;
            } catch {
              return null;
            }
          })
          .filter(Boolean),
      );

      // Intercept requests to localhost hosts and redirect to internal service names
      page.on("request", (request) => {
        try {
          const requestUrl = new URL(request.url());
          const needsReplacement = localhostHosts.has(requestUrl.host);

          if (needsReplacement) {
            let modifiedUrl = request.url();

            // Replace localhost:3000 with host.docker.internal:3000 (main application)
            if (requestUrl.port === "3000" || requestUrl.hostname === "localhost") {
              modifiedUrl = modifiedUrl.replace(requestUrl.hostname, "host.docker.internal");
            }
            // Replace localhost:9000 with minio:9000 (MinIO storage)
            else if (requestUrl.port === "9000") {
              modifiedUrl = modifiedUrl.replace(requestUrl.hostname, "minio");
            }
            // Fallback for other localhost URLs
            else {
              modifiedUrl = modifiedUrl.replace(requestUrl.hostname, "host.docker.internal");
            }

            console.log(`Replacing request URL in generatePreview: ${request.url()} -> ${modifiedUrl}`);
            void request.continue({ url: modifiedUrl });
          } else {
            void request.continue();
          }
        } catch {
          void request.continue();
        }
      });
    }

    // Set the data of the resume to be printed in the browser's session storage
    await page.evaluateOnNewDocument((data) => {
      window.localStorage.setItem("resume", JSON.stringify(data));
    }, resume.data);

    await page.setViewport({ width: 794, height: 1123 });

    await page.goto(`${url}/artboard/preview`, { waitUntil: "networkidle0" });

    // Save the JPEG to storage and return the URL
    // Store the URL in cache for future requests, under the previously generated hash digest
    const uint8array = await page.screenshot({ quality: 80, type: "jpeg" });
    const buffer = Buffer.from(uint8array);

    // Generate a hash digest of the resume data, this hash will be used to check if the resume has been updated
    const previewUrl = await this.storageService.uploadObject(
      resume.userId,
      "previews",
      buffer,
      resume.id,
    );

    // Close all the pages and disconnect from the browser
    await page.close();
    await browser.disconnect();

    return previewUrl;
  }
}
