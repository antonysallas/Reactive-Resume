import { z } from "zod";
import { usernameSchema } from "../user";

export const loginSchema = z
  .object({
    identifier: z.string(),
    password: z.string().min(6), // z.password() is not a valid zod method
  })
  .refine(
    (value) => {
      return value.identifier.includes("@")
        ? z.string().email().safeParse(value.identifier).success
        : usernameSchema.safeParse(value.identifier).success;
    },
    { message: "InvalidCredentials" },
  );

export class LoginDto {
  identifier: string;
  password: string;

  constructor(data: { identifier: string; password: string }) {
    const parsedData = loginSchema.parse(data);
    this.identifier = parsedData.identifier;
    this.password = parsedData.password;
  }
}
