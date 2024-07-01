import { defaultResumeData, idSchema, resumeDataSchema } from "@reactive-resume/schema";
import { z } from "zod";
import { userSchema } from "../user";

export const resumeSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  data: resumeDataSchema.default(defaultResumeData),
  visibility: z.enum(["private", "public"]).default("private"),
  locked: z.boolean().default(false),
  userId: idSchema,
  user: userSchema.optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export class ResumeDto {
  id: typeof idSchema._type;
  title: string;
  slug: string;
  data: typeof resumeDataSchema._type;
  visibility: "private" | "public";
  locked: boolean;
  userId: typeof idSchema._type;
  user?: typeof userSchema._type;
  createdAt: Date | string;
  updatedAt: Date | string;

  constructor(data: {
    id: typeof idSchema._type;
    title: string;
    slug: string;
    data: typeof resumeDataSchema._type;
    visibility: "private" | "public";
    locked: boolean;
    userId: typeof idSchema._type;
    user?: typeof userSchema._type;
    createdAt: Date | string;
    updatedAt: Date | string;
  }) {
    const parsedData = resumeSchema.parse(data);
    this.id = parsedData.id;
    this.title = parsedData.title;
    this.slug = parsedData.slug;
    this.data = parsedData.data;
    this.visibility = parsedData.visibility;
    this.locked = parsedData.locked;
    this.userId = parsedData.userId;
    this.user = parsedData.user;
    this.createdAt = parsedData.createdAt;
    this.updatedAt = parsedData.updatedAt;
  }
}
