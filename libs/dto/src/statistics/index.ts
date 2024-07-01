import { z } from "zod";

export const statisticsSchema = z.object({
  views: z.number().int().default(0),
  downloads: z.number().int().default(0),
});

export class StatisticsDto {
  views: number;
  downloads: number;

  constructor(data: { views: number; downloads: number }) {
    const parsedData = statisticsSchema.parse(data);
    this.views = parsedData.views;
    this.downloads = parsedData.downloads;
  }
}
