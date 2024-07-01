// app.module.ts
import path from 'node:path';
import { HttpException, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { ZodValidationModule } from './zod-validation.module'; // Ensure the path is correct
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ContributorsModule } from './contributors/contributors.module';
import { DatabaseModule } from './database/database.module';
import { FeatureModule } from './feature/feature.module';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { PrinterModule } from './printer/printer.module';
import { ResumeModule } from './resume/resume.module';
import { StorageModule } from './storage/storage.module';
import { TranslationModule } from './translation/translation.module';
import { UserModule } from './user/user.module';
import { ZodValidationPipe } from './zod-validation.pipe'; // Import the ZodValidationPipe class
import { AppController } from './app.controller'; // Import the AppController

@Module({
  imports: [
    // Core Modules
    ConfigModule,
    DatabaseModule,
    MailModule,
    RavenModule,
    HealthModule,
    ZodValidationModule, // Import the new module

    // Feature Modules
    AuthModule.register(),
    UserModule,
    ResumeModule,
    StorageModule,
    PrinterModule,
    FeatureModule,
    TranslationModule,
    ContributorsModule,

    // Static Assets
    ServeStaticModule.forRoot({
      serveRoot: '/artboard',
      // eslint-disable-next-line unicorn/prefer-module
      rootPath: path.join(__dirname, '..', 'artboard'),
    }),
    ServeStaticModule.forRoot({
      renderPath: '/*',
      // eslint-disable-next-line unicorn/prefer-module
      rootPath: path.join(__dirname, '..', 'client'),
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe, // Use the class directly
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [
          // Filter all HttpException with status code <= 500
          {
            type: HttpException,
            filter: (exception: HttpException) => exception.getStatus() < 500,
          },
        ],
      }),
    },
  ],
  controllers: [AppController], // Register the AppController
})
export class AppModule {}