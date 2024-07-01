import { z } from "zod";


export const forgotPasswordSchema = z.object({ email: z.string().email() });

export class ForgotPasswordDto {
  email: string;

  constructor(email: string) {
    this.email = forgotPasswordSchema.parse({ email }).email;
  }
}

