"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AlertCircle, ArrowRight, FileText, Loader2, Upload } from "lucide-react";
import { CareerSchema } from "@/lib/schemas/lead.schema";
import { Consent, Input, RecaptchaNotice, SelectField, ServerError, Textarea } from "@/components/forms/Fields";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Honeypot } from "@/components/forms/Honeypot";
import { useSubmitLead } from "@/components/forms/useSubmitLead";
import { Button } from "@/components/ui/Button";

const ClientSchema = CareerSchema.pick({ fullName: true, mobile: true, email: true, position: true, experience: true, currentLocation: true, message: true, consent: true });
type In = z.input<typeof ClientSchema>;
type Out = z.output<typeof ClientSchema>;

const MAX = 5 * 1024 * 1024;
const TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const toBase64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(f);
  });

export function ApplicationForm({ positions, defaultPosition }: { positions: string[]; defaultPosition?: string }) {
  const [honeypot, setHoneypot] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { submit, serverError, onFirstInteraction } = useSubmitLead({ formType: "career" });
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({
    resolver: zodResolver(ClientSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", mobile: "", email: "", position: defaultPosition ?? "", experience: "", currentLocation: "", message: "" },
  });

  const onFile = (f: File | undefined) => {
    setFileError(null);
    if (!f) return setFile(null);
    if (!TYPES.includes(f.type)) return setFileError("Upload a PDF, DOC or DOCX file");
    if (f.size > MAX) return setFileError("Résumé must be 5 MB or smaller");
    setFile(f);
  };

  return (
    <form
      noValidate
      onFocus={onFirstInteraction}
      onSubmit={handleSubmit(async (v) => {
        const resume = file ? { resumeName: file.name, resumeMime: file.type, resumeBase64: await toBase64(file) } : {};
        await submit({ ...v, ...resume, project: v.position }, honeypot);
      })}
      className="relative grid gap-4"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" required autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <Controller control={control} name="mobile" render={({ field }) => <PhoneInput name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.mobile?.message} />} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email" required type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <SelectField label="Position" required placeholder="Choose a role" options={[...positions, "General application"].map((p) => ({ value: p, label: p }))} error={errors.position?.message} {...register("position")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Experience (years)" inputMode="numeric" {...register("experience")} />
        <Input label="Current location" autoComplete="address-level2" {...register("currentLocation")} />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">
          Résumé <span className="font-normal text-muted/70">(PDF, DOC or DOCX, up to 5 MB)</span>
        </p>
        <label className="flex min-h-20 cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-gold-500/50 bg-cream px-5 py-4 transition hover:border-gold-500 focus-within:ring-4 focus-within:ring-gold-500/15">
          <span className="grid size-11 place-items-center rounded-full bg-white text-brand-700">
            {file ? <FileText className="size-5" aria-hidden /> : <Upload className="size-5" aria-hidden />}
          </span>
          <span className="text-sm">
            {file ? (
              <span className="font-medium text-ink">{file.name}</span>
            ) : (
              <>
                <span className="font-medium text-brand-700">Choose a file</span> <span className="text-muted">or drop it here</span>
              </>
            )}
          </span>
          <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {fileError ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-600" role="alert">
            <AlertCircle className="size-3.5" aria-hidden /> {fileError}
          </p>
        ) : null}
      </div>
      <Textarea label="Cover note" error={errors.message?.message} {...register("message")} />
      <Consent error={errors.consent?.message} {...register("consent")} />
      <ServerError message={serverError} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Sending…" : "Apply now"}
        {!isSubmitting ? <ArrowRight className="size-4" aria-hidden /> : null}
      </Button>
      <RecaptchaNotice />
    </form>
  );
}
