import { z } from "zod";

const authProvidersSchema = z.array(z.enum(["email", "github", "google"]));

export class AuthProvidersDto {
  providers: ("email" | "github" | "google")[];

  constructor(data: { providers: ("email" | "github" | "google")[] }) {
    const parsedData = authProvidersSchema.parse(data.providers);
    this.providers = parsedData;
  }
}