import { z } from "zod";

export const messageSchema = z.object({ message: z.string() });

export class MessageDto {
  message: string;

  constructor(data: { message: string }) {
    const parsedData = messageSchema.parse(data);
    this.message = parsedData.message;
  }
}
