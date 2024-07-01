import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6), // z.password() is not a valid zod method
});

export class ResetPasswordDto {
  token: string;
  password: string;

  constructor(data: { token: string; password: string }) {
    const parsedData = resetPasswordSchema.parse(data);
    this.token = parsedData.token;
    this.password = parsedData.password;
  }
}
