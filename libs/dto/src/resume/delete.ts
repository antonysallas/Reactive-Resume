import { idSchema } from "@reactive-resume/schema";
import { z } from "zod";

export const deleteResumeSchema = z.object({
  id: idSchema,
});

export class DeleteResumeDto {
  id: typeof idSchema._type; // Use the type of the parsed idSchema

  constructor(data: { id: typeof idSchema._type }) {
    const parsedData = deleteResumeSchema.parse(data);
    this.id = parsedData.id;
  }
}
