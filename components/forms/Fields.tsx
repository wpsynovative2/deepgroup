"use client";

import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "peer w-full rounded-[var(--radius-control)] border border-line bg-white px-4 text-[0.95rem] text-ink placeholder:text-muted/60 transition-[border-color,box-shadow] duration-200 outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 aria-[invalid=true]:border-brand-600 aria-[invalid=true]:ring-brand-600/10";

type FieldProps = { label: string; error?: string; required?: boolean; hint?: string; className?: string };

function FieldShell({ id, label, error, required, hint, className, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-brand-600"> *</span> : <span className="text-muted/70 font-normal"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-brand-600" role="alert">
          <AlertCircle className="size-3.5" aria-hidden /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, FieldProps & ComponentProps<"input">>(function Input(
  { label, error, required, hint, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} required={required} hint={hint} className={className}>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "h-12")}
        {...rest}
      />
    </FieldShell>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, FieldProps & ComponentProps<"textarea">>(function Textarea(
  { label, error, required, hint, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} required={required} hint={hint} className={className}>
      <textarea
        ref={ref}
        id={id}
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, "resize-none py-3")}
        {...rest}
      />
    </FieldShell>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  FieldProps & ComponentProps<"select"> & { options: Array<{ value: string; label: string }>; placeholder?: string }
>(function SelectField({ label, error, required, hint, className, options, placeholder, ...rest }, ref) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} required={required} hint={hint} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(control, "h-12 appearance-none pr-10")}
          {...rest}
        >
          <option value="">{placeholder ?? "Select"}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>
    </FieldShell>
  );
});

export const Consent = forwardRef<HTMLInputElement, ComponentProps<"input"> & { error?: string }>(function Consent(
  { error, ...rest },
  ref,
) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-brand-700"
          {...rest}
        />
        <span>I agree to be contacted by Deep Group by call, SMS or WhatsApp, even if my number is on DND.</span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-600" role="alert">
          <AlertCircle className="size-3.5" aria-hidden /> {error}
        </p>
      ) : null}
    </div>
  );
});

export function RecaptchaNotice() {
  return (
    <p className="text-[0.7rem] leading-relaxed text-muted/80">
      This site is protected by reCAPTCHA and the Google{" "}
      <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>{" "}
      and{" "}
      <a className="underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}

export function ServerError({ message }: { message: string | null }) {
  return (
    <div aria-live="polite">
      {message ? (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
