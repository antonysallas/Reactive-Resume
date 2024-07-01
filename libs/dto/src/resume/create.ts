import { kebabCase } from "@reactive-resume/utils";
import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).transform(kebabCase).optional(),
  visibility: z.enum(["public", "private"]).default("private"),
});

export class CreateResumeDto {
  title: string;
  slug?: string;
  visibility: "public" | "private";

  constructor(data: { title: string; slug?: string; visibility?: "public" | "private" }) {
    const parsedData = createResumeSchema.parse(data);
    this.title = parsedData.title;
    this.slug = parsedData.slug;
    this.visibility = parsedData.visibility;
  }
}
