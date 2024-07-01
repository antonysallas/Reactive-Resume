// zod-validation.pipe.ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Inject } from '@nestjs/common';
import { ZodSchema } from 'zod';
import * as Zod from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(@Inject('ZodType') private readonly zod: typeof Zod, private readonly schema: ZodSchema<any>) {
    console.log('ZodValidationPipe initialized with schema:', schema);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      console.log('Validating value:', value);
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof Zod.ZodError) {
        console.error('Validation failed:', error.errors);
        throw new BadRequestException(error.errors);
      }
      console.error('Validation failed:', error);
      throw new BadRequestException('Validation failed');
    }
  }
}
