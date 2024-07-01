import { ResumeData } from "@reactive-resume/schema";
import { z, ZodSchema } from "zod";

export type Parser<Data = unknown, T = z.infer<ZodSchema>, Result = ResumeData> = {
  schema?: ZodSchema;

  readFile(file: File): Promise<Data>;

  validate(data: Data): T | Promise<T>;

  convert(data: T): Result | Promise<Result>;
};
