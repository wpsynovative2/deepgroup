"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getTracking } from "@/lib/tracking/utm";
import { pushEvent } from "@/lib/tracking/datalayer";
import { useRecaptcha } from "./useRecaptcha";
import type { FormType } from "@/lib/schemas/lead.schema";

type Options = {
  formType: FormType;
  /** Called instead of redirecting to /thank-you. */
  onSuccess?: () => void;
};

export function useSubmitLead({ formType, onSuccess }: Options) {
  const router = useRouter();
  const pathname = usePathname();
  // Time trap: set when the form mounts.
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);
  const { execute, preload } = useRecaptcha();
  const [serverError, setServerError] = useState<string | null>(null);

  async function submit(values: Record<string, unknown>, honeypot: string) {
    setServerError(null);
    try {
      const recaptchaToken = await execute(`${formType}_submit`);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          formType,
          source: (values.source as string) ?? pathname,
          tracking: getTracking(),
          website: honeypot,
          renderedAt: renderedAt.current,
          recaptchaToken,
        }),
      });
      const body = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !body.ok) {
        setServerError(body.error ?? "Something went wrong. Please call us instead.");
        return false;
      }
      if (formType === "channel-partner") pushEvent("cp_registration", { lead_source: pathname });
      else pushEvent("generate_lead", { form_type: formType, project: values.project, intent: values.intent, lead_source: pathname });

      if (onSuccess) onSuccess();
      else router.push(`/thank-you?type=${formType}`);
      return true;
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
      return false;
    }
  }

  return { submit, serverError, onFirstInteraction: () => void preload().catch(() => {}) };
}
