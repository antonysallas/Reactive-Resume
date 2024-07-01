import { z } from "zod";

export const featureSchema = z.object({
  isSignupsDisabled: z.boolean().default(false),
  isEmailAuthDisabled: z.boolean().default(false),
});

export class FeatureDto {
  isSignupsDisabled: boolean;
  isEmailAuthDisabled: boolean;

  constructor(data: { isSignupsDisabled: boolean; isEmailAuthDisabled: boolean }) {
    const parsedData = featureSchema.parse(data);
    this.isSignupsDisabled = parsedData.isSignupsDisabled;
    this.isEmailAuthDisabled = parsedData.isEmailAuthDisabled;
  }
}
