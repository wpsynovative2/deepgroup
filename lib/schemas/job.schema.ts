import { z } from "zod";

export const JobSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  department: z.string(),
  location: z.string(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "INTERN"]),
  experience: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  postedAt: z.string(),
  validThrough: z.string(),
  open: z.boolean(),
});

export const JobsSchema = z.array(JobSchema);
export type Job = z.infer<typeof JobSchema>;
