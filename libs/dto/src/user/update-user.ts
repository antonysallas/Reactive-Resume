import { z } from "zod";
import { userSchema } from "./user";

export const updateUserSchema = userSchema.partial().pick({
  name: true,
  locale: true,
  username: true,
  email: true,
  picture: true,
});

export class UpdateUserDto {
  name?: string;
  locale?: string;
  username?: string;
  email?: string;
  picture?: string;

  constructor(data: { name?: string; locale?: string; username?: string; email?: string; picture?: string | null }) {
    const parsedData = updateUserSchema.parse(data);
    this.name = parsedData.name;
    this.locale = parsedData.locale;
    this.username = parsedData.username;
    this.email = parsedData.email;
    this.picture = parsedData.picture ?? undefined; // Handle null values by converting them to undefined
  }
}
