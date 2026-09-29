"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BadgeCheck, CarFront, CheckCircle2, Download, IndianRupee, X } from "lucide-react";
import type { LeadModalOptions } from "@/types";
import { LeadForm } from "./LeadForm";
import { FLOORPLAN_UNLOCK_EVENT, FLOORPLAN_UNLOCK_KEY } from "./LeadModalProvider";
import { buttonClasses } from "@/components/ui/Button";

const TITLES: Record<string, string> = {
  "site-visit": "Book a site visit",
  brochure: "Download the brochure",
  "cost-sheet": "Get the cost sheet",
  "floor-plan": "Unlock floor plans",
  enquiry: "Enquire now",
};

const PERKS = [
  { icon: CarFront, label: "Free pickup from the station" },
  { icon: IndianRupee, label: "Best price, no hidden costs" },
  { icon: BadgeCheck, label: "MahaRERA registered projects" },
];

type Props = { options: LeadModalOptions | null; projects: string[]; onClose: () => void };

export function LeadModal({ options, projects, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [done, setDone] = useState(false);
  const open = options !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setDone(false);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  const intent = options?.intent ?? "enquiry";
  const staysOpen = intent === "brochure" || intent === "floor-plan";
  const title = options?.title ?? TITLES[intent] ?? "Enquire now";

  const handleSuccess = staysOpen
    ? () => {
        if (intent === "floor-plan") {
          try {
            sessionStorage.setItem(FLOORPLAN_UNLOCK_KEY, "1");
          } catch {}
          window.dispatchEvent(new Event(FLOORPLAN_UNLOCK_EVENT));
        }
        setDone(true);
      }
    : undefined;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="lead-modal-title"
      className="m-auto w-[min(960px,calc(100%-24px))] max-h-[calc(100dvh-24px)] overflow-hidden rounded-3xl bg-white p-0 shadow-2xl shadow-brand-900/30"
    >
      {open ? (
        <div className="grid max-h-[calc(100dvh-24px)] overflow-y-auto md:grid-cols-[0.85fr_1.15fr]">
          {/* Visual side */}
          <div className="relative hidden overflow-hidden bg-brand-800 md:block">
            <Image src="/images/about/towers-portrait.jpg" alt="" fill sizes="400px" className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent" />
            <div className="relative flex h-full flex-col justify-end gap-6 p-8 text-white">
              <p className="font-script text-4xl text-gold-400">Welcome home</p>
              <ul className="grid gap-3">
                {PERKS.map(({ icon: I, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="grid size-9 place-items-center rounded-full bg-white/10 ring-1 ring-gold-400/40">
                      <I className="size-4 text-gold-400" aria-hidden />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form side */}
          <div className="relative p-6 sm:p-8">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full text-muted transition hover:rotate-90 hover:bg-brand-50 hover:text-brand-700"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden />
            </button>
            {done ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center">
                <CheckCircle2 className="size-16 text-gold-500" strokeWidth={1.2} aria-hidden />
                <h2 id="lead-modal-title" className="text-3xl">Thank you!</h2>
                <p className="max-w-sm text-muted">
                  {intent === "floor-plan" ? "Floor plans are now unlocked on this page." : "Our team will call you within one working day."}
                </p>
                {intent === "brochure" && options?.onSuccessUrl ? (
                  <a href={options.onSuccessUrl} target="_blank" rel="noopener" className={buttonClasses("primary", "lg")}>
                    <Download className="size-4" aria-hidden /> Download brochure
                  </a>
                ) : (
                  <button type="button" onClick={() => ref.current?.close()} className={buttonClasses("outline")}>
                    Continue browsing
                  </button>
                )}
              </div>
            ) : (
              <>
                <h2 id="lead-modal-title" className="pr-12 text-[1.9rem]">{title}</h2>
                <p className="mt-1 mb-6 text-sm text-muted">
                  {options?.project ? <>For <span className="font-medium text-brand-700">{options.project}</span>{options.unit ? ` · ${options.unit}` : ""}. </> : null}
                  Share your details and we&apos;ll call you back.
                </p>
                <LeadForm
                  key={JSON.stringify(options)}
                  projects={projects}
                  compact
                  intent={intent}
                  source={options?.source}
                  defaults={{ project: options?.project, unit: options?.unit, message: options?.message }}
                  submitLabel={title}
                  onSuccess={handleSuccess}
                />
              </>
            )}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
