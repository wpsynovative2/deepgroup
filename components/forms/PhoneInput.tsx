"use client";

import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Formats digits as "98765 43210" while typing. */
const format = (v: string) => {
  const d = v.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10})/, "").slice(0, 10);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  label?: string;
  name: string;
};

export function PhoneInput({ value, onChange, onBlur, error, label = "Mobile number", name }: Props) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        <span className="text-brand-600"> *</span>
      </label>
      <div
        className={cn(
          "flex h-12 items-stretch overflow-hidden rounded-[var(--radius-control)] border bg-white transition-[border-color,box-shadow] focus-within:border-gold-500 focus-within:ring-4 focus-within:ring-gold-500/15",
          error ? "border-brand-600" : "border-line",
        )}
      >
        <span className="grid place-items-center border-r border-line bg-cream px-3 text-sm font-medium text-muted select-none">+91</span>
        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={14}
          placeholder="98765 43210"
          value={value}
          onChange={(e) => onChange(format(e.target.value))}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent px-4 text-[0.95rem] tracking-wide outline-none placeholder:text-muted/60"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-brand-600" role="alert">
          <AlertCircle className="size-3.5" aria-hidden /> {error}
        </p>
      ) : null}
    </div>
  );
}
