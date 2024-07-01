import { z } from "zod";

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be a 6 digit number" })
    .regex(/^\d+$/, { message: "Code must be a 6 digit number" }),
});

export class TwoFactorDto {
  code: string;

  constructor(data: { code: string }) {
    const parsedData = twoFactorSchema.parse(data);
    this.code = parsedData.code;
  }
}

export const backupCodesSchema = z.object({
  backupCodes: z.array(z.string().length(10)),
});

export class BackupCodesDto {
  backupCodes: string[];

  constructor(data: { backupCodes: string[] }) {
    const parsedData = backupCodesSchema.parse(data);
    this.backupCodes = parsedData.backupCodes;
  }
}

export const twoFactorBackupSchema = z.object({
  code: z.string().length(10),
});

export class TwoFactorBackupDto {
  code: string;

  constructor(data: { code: string }) {
    const parsedData = twoFactorBackupSchema.parse(data);
    this.code = parsedData.code;
  }
}
