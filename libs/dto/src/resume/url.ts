import { z } from "zod";

export const urlSchema = z.object({ url: z.string().url() });

export class UrlDto {
  url: string;

  constructor(data: { url: string }) {
    const parsedData = urlSchema.parse(data);
    this.url = parsedData.url;
  }
}
