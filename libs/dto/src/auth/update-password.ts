import { z } from "zod";

export const updatePasswordSchema = z.object({
  password: z.string().min(6),
});

export class UpdatePasswordDto {
  password: string;

  constructor(data: { password: string }) {
    const parsedData = updatePasswordSchema.parse(data);
    this.password = parsedData.password;
  }
}
