"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { LeadSchema, type Intent } from "@/lib/schemas/lead.schema";
import { Input, Textarea, SelectField, Consent, RecaptchaNotice, ServerError } from "./Fields";
import { PhoneInput } from "./PhoneInput";
import { Honeypot } from "./Honeypot";
import { useSubmitLead } from "./useSubmitLead";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ClientSchema = LeadSchema.pick({ fullName: true, mobile: true, email: true, project: true, unit: true, message: true, consent: true });
type In = z.input<typeof ClientSchema>;
type Out = z.output<typeof ClientSchema>;

type Props = {
  projects: string[];
  defaults?: { project?: string; unit?: string; message?: string };
  intent?: Intent;
  source?: string;
  submitLabel?: string;
  onSuccess?: () => void;
  compact?: boolean;
  className?: string;
};

export function LeadForm({ projects, defaults, intent, source, submitLabel = "Book a site visit", onSuccess, compact, className }: Props) {
  const [honeypot, setHoneypot] = useState("");
  const { submit, serverError, onFirstInteraction } = useSubmitLead({ formType: "lead", onSuccess });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(ClientSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", mobile: "", email: "", project: defaults?.project ?? "", unit: defaults?.unit ?? "", message: defaults?.message ?? "" },
  });

  return (
    <form
      noValidate
      onFocus={onFirstInteraction}
      onSubmit={handleSubmit((v) => submit({ ...v, intent, source }, honeypot))}
      className={cn("relative grid gap-4", className)}
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Input label="Full name" required autoComplete="name" placeholder="Your name" error={errors.fullName?.message} {...register("fullName")} />
        <Controller
          control={control}
          name="mobile"
          render={({ field }) => (
            <PhoneInput name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.mobile?.message} />
          )}
        />
      </div>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <SelectField
          label="Interested in"
          placeholder="Any project"
          options={projects.map((p) => ({ value: p, label: p }))}
          {...register("project")}
        />
      </div>
      {!compact ? <Textarea label="Message" placeholder="Tell us what you're looking for" error={errors.message?.message} {...register("message")} /> : null}
      <input type="hidden" {...register("unit")} />
      <Consent error={errors.consent?.message} {...register("consent")} />
      <ServerError message={serverError} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Sending…" : submitLabel}
        {!isSubmitting ? <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden /> : null}
      </Button>
      <RecaptchaNotice />
    </form>
  );
}
