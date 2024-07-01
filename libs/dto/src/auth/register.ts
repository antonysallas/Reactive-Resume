import { z } from "zod";
import { userSchema } from "../user";

export const registerSchema = userSchema
  .pick({ name: true, email: true, username: true, locale: true })
  .extend({ password: z.string().min(6) });

export class RegisterDto {
  name: string;
  email: string;
  username: string;
  locale: string;
  password: string;

  constructor(data: { name: string; email: string; username: string; locale: string; password: string }) {
    const parsedData = registerSchema.parse(data);
    this.name = parsedData.name;
    this.email = parsedData.email;
    this.username = parsedData.username;
    this.locale = parsedData.locale;
    this.password = parsedData.password;
  }
}
