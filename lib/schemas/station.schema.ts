import { z } from "zod";

export const StationSchema = z.object({
  slug: z.string(),
  name: z.string(),
  line: z.string(),
  order: z.number(),
  intro: z.string().optional(),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
});

export const StationsSchema = z.array(StationSchema);
export type Station = z.infer<typeof StationSchema>;
