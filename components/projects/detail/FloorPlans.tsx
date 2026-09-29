"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { useLeadModal, FLOORPLAN_UNLOCK_EVENT, FLOORPLAN_UNLOCK_KEY } from "@/components/forms/LeadModalProvider";
import { cn } from "@/lib/utils";

type Plan = { src: string; alt: string; label: string };

/** Blurred until the visitor submits the lead form; the unlock is remembered for the session. */
export function FloorPlans({ plans, project, slug }: { plans: Plan[]; project: string; slug: string }) {
  const { openLeadModal } = useLeadModal();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setUnlocked(sessionStorage.getItem(FLOORPLAN_UNLOCK_KEY) === "1");
      } catch {}
    };
    check();
    window.addEventListener(FLOORPLAN_UNLOCK_EVENT, check);
    return () => window.removeEventListener(FLOORPLAN_UNLOCK_EVENT, check);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {plans.map((plan) => (
        <figure key={plan.label} className="overflow-hidden rounded-2xl border border-line bg-white" data-reveal>
          <div className="relative aspect-[4/3] overflow-hidden bg-cream">
            <Image
              src={plan.src}
              alt={unlocked ? plan.alt : `${plan.label} floor plan (locked)`}
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className={cn("object-cover transition-all duration-700", unlocked ? "blur-0" : "scale-110 blur-xl")}
            />
            {!unlocked ? (
              <button
                type="button"
                onClick={() => openLeadModal({ project, unit: plan.label, intent: "floor-plan", source: `/projects/${slug}#floor-plans` })}
                className="group absolute inset-0 grid place-items-center bg-brand-900/30"
              >
                <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-brand-700 shadow-xl transition group-hover:scale-105">
                  <Lock className="size-4 group-hover:hidden" aria-hidden />
                  <LockOpen className="hidden size-4 group-hover:block" aria-hidden />
                  Unlock floor plans
                </span>
              </button>
            ) : null}
          </div>
          <figcaption className="flex items-center justify-between px-5 py-4">
            <span className="font-display text-xl text-brand-700">{plan.label}</span>
            <span className="text-sm text-muted">{unlocked ? plan.alt.split(",").slice(1).join(",").trim() : "Carpet area on unlock"}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
