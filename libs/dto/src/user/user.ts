import { idSchema } from "@reactive-resume/schema";
import { z } from "zod";

import { secretsSchema } from "../secrets";

export const usernameSchema = z
  .string()
  .min(3)
  .max(255)
  .regex(/^[\d._a-z-]+$/, {
    message:
      "Usernames can only contain lowercase letters, numbers, periods, hyphens, and underscores.",
  });

export const userSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(255),
  picture: z.literal("").or(z.null()).or(z.string().url()),
  username: usernameSchema,
  email: z.string().email(),
  locale: z.string().default("en-US"),
  emailVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  provider: z.enum(["email", "github", "google"]).default("email"),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export class UserDto {
  id: typeof idSchema._type;
  name: string;
  picture: string | null | "";
  username: string;
  email: string;
  locale: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  provider: "email" | "github" | "google";
  createdAt: Date | string;
  updatedAt: Date | string;

  constructor(data: {
    id: typeof idSchema._type;
    name: string;
    picture: string | null | "";
    username: string;
    email: string;
    locale: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    provider: "email" | "github" | "google";
    createdAt: Date | string;
    updatedAt: Date | string;
  }) {
    const parsedData = userSchema.parse(data);
    this.id = parsedData.id as typeof idSchema._type;
    this.name = parsedData.name as string;
    this.picture = parsedData.picture as string | null | "";
    this.username = parsedData.username as string;
    this.email = parsedData.email as string;
    this.locale = parsedData.locale as string;
    this.emailVerified = parsedData.emailVerified as boolean;
    this.twoFactorEnabled = parsedData.twoFactorEnabled as boolean;
    this.provider = parsedData.provider as "email" | "github" | "google";
    this.createdAt = parsedData.createdAt as Date | string;
    this.updatedAt = parsedData.updatedAt as Date | string;
  }
}

export const userWithSecretsSchema = userSchema.merge(z.object({ secrets: secretsSchema }));

export class UserWithSecrets {
  id: typeof idSchema._type;
  name: string;
  picture: string | null | "";
  username: string;
  email: string;
  locale: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  provider: "email" | "github" | "google";
  createdAt: Date | string;
  updatedAt: Date | string;
  secrets: typeof secretsSchema._type;

  constructor(data: {
    id: typeof idSchema._type;
    name: string;
    picture: string | null | "";
    username: string;
    email: string;
    locale: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    provider: "email" | "github" | "google";
    createdAt: Date | string;
    updatedAt: Date | string;
    secrets: typeof secretsSchema._type;
  }) {
    const parsedData = userWithSecretsSchema.parse(data);
    this.id = parsedData.id as typeof idSchema._type;
    this.name = parsedData.name as string;
    this.picture = parsedData.picture as string | null | "";
    this.username = parsedData.username as string;
    this.email = parsedData.email as string;
    this.locale = parsedData.locale as string;
    this.emailVerified = parsedData.emailVerified as boolean;
    this.twoFactorEnabled = parsedData.twoFactorEnabled as boolean;
    this.provider = parsedData.provider as "email" | "github" | "google";
    this.createdAt = parsedData.createdAt as Date | string;
    this.updatedAt = parsedData.updatedAt as Date | string;
    this.secrets = parsedData.secrets as typeof secretsSchema._type;
  }
}
