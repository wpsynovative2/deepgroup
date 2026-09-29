import "server-only";
import jobs from "@/data/jobs.json";
import { JobsSchema } from "@/lib/schemas/job.schema";

export const getAllJobs = () => JobsSchema.parse(jobs);
export const getOpenJobs = () => getAllJobs().filter((j) => j.open);
export const getJobBySlug = (slug: string) => getOpenJobs().find((j) => j.slug === slug);
