import { z } from "zod";
import { resumeSchema } from "./resume";

export const updateResumeSchema = resumeSchema.partial();

export class UpdateResumeDto {
  id?: typeof resumeSchema.shape.id._type;
  title?: string;
  slug?: string;
  data?: typeof resumeSchema.shape.data._type;
  visibility?: "private" | "public";
  locked?: boolean;
  userId?: typeof resumeSchema.shape.userId._type;
  user?: typeof resumeSchema.shape.user._type;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  constructor(data: {
    id?: typeof resumeSchema.shape.id._type;
    title?: string;
    slug?: string;
    data?: typeof resumeSchema.shape.data._type;
    visibility?: "private" | "public";
    locked?: boolean;
    userId?: typeof resumeSchema.shape.userId._type;
    user?: typeof resumeSchema.shape.user._type;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }) {
    const parsedData = updateResumeSchema.parse(data);
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
