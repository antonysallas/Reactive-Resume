import { z } from "zod";

export const contributorSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  avatar: z.string(),
});

export class ContributorDto {
  id: number;
  name: string;
  url: string;
  avatar: string;

  constructor(data: { id: number; name: string; url: string; avatar: string }) {
    const parsedData = contributorSchema.parse(data);
    this.id = parsedData.id;
    this.name = parsedData.name;
    this.url = parsedData.url;
    this.avatar = parsedData.avatar;
  }
}
