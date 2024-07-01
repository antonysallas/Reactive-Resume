import { z } from "zod";
import { userSchema } from "../user";

export const authResponseSchema = z.object({
  status: z.enum(["authenticated", "2fa_required"]),
  user: userSchema,
});

export class AuthResponseDto {
  status: "authenticated" | "2fa_required";
  user: typeof userSchema._type; // Use the type of the parsed userSchema

  constructor(data: { status: "authenticated" | "2fa_required"; user: typeof userSchema._type }) {
    const parsedData = authResponseSchema.parse(data);
    this.status = parsedData.status;
    this.user = parsedData.user;
  }
}
