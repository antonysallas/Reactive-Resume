import { resumeDataSchema } from "@reactive-resume/schema";
import { kebabCase } from "@reactive-resume/utils";
import { z } from "zod";

export const importResumeSchema = z.object({
  title: z.string().optional(),
  slug: z.string().min(1).transform(kebabCase).optional(),
  visibility: z.enum(["public", "private"]).default("private").optional(),
  data: resumeDataSchema,
});

export class ImportResumeDto {
  title?: string;
  slug?: string;
  visibility?: "public" | "private";
  data: typeof resumeDataSchema._type;

  constructor(data: { title?: string; slug?: string; visibility?: "public" | "private"; data: typeof resumeDataSchema._type }) {
    const parsedData = importResumeSchema.parse(data);
    this.title = parsedData.title;
    this.slug = parsedData.slug;
    this.visibility = parsedData.visibility;
    this.data = parsedData.data;
  }
}
