// zod-validation.module.ts
import { Module, Global } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe';
import * as Zod from 'zod'; // Assuming ZodType is from the 'zod' library

@Global()
@Module({
  providers: [
    {
      provide: 'ZodType', // This is a placeholder, adjust based on actual dependency
      useValue: Zod, // Provide the Zod module
    },
    ZodValidationPipe,
  ],
  exports: ['ZodType', ZodValidationPipe], // Export both the pipe and the dependency
})
export class ZodValidationModule {}
