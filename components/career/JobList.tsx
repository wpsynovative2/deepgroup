"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Briefcase, Clock, MapPin } from "lucide-react";
import type { Job } from "@/types";
import { cn } from "@/lib/utils";

export function JobList({ jobs }: { jobs: Job[] }) {
  const departments = ["All", ...new Set(jobs.map((j) => j.department))];
  const [dept, setDept] = useState("All");
  const shown = dept === "All" ? jobs : jobs.filter((j) => j.department === dept);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by department">
        {departments.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={dept === d}
            onClick={() => setDept(d)}
            className={cn("min-h-11 rounded-full border px-5 text-sm transition", dept === d ? "border-brand-700 bg-brand-700 text-white" : "border-line hover:border-gold-500")}
          >
            {d}
          </button>
        ))}
      </div>
      <ul className="mt-10 grid gap-4">
        {shown.map((j) => (
          <li key={j.slug}>
            <Link
              href={`/career/${j.slug}`}
              className="group flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 transition-all duration-500 hover:border-gold-500 hover:shadow-[0_30px_60px_-40px_rgba(101,7,39,.45)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-600">{j.department}</span>
                <h3 className="mt-3 text-2xl transition-colors group-hover:text-brand-600">{j.title}</h3>
                <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1.5"><MapPin className="size-4 text-gold-500" aria-hidden /> {j.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="size-4 text-gold-500" aria-hidden /> {j.experience}</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-4 text-gold-500" aria-hidden /> {j.type === "FULL_TIME" ? "Full time" : j.type.replace("_", " ").toLowerCase()}</span>
                </p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-brand-700/20 text-brand-700 transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand-700 group-hover:text-white">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
