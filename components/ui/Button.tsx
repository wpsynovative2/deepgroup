import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "light";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-60 active:scale-[.98]";
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-700 text-white shadow-[0_10px_30px_-10px_rgba(101,7,39,.55)] hover:bg-brand-800 hover:shadow-[0_14px_34px_-10px_rgba(101,7,39,.7)] hover:-translate-y-0.5",
  accent: "border border-gold-500 bg-white/70 text-brand-700 backdrop-blur hover:bg-gold-500 hover:text-white",
  outline: "border border-brand-700/25 text-brand-700 hover:border-brand-700 hover:bg-brand-700 hover:text-white",
  ghost: "text-brand-700 hover:bg-brand-50",
  light: "bg-white text-brand-700 hover:bg-gold-100 hover:-translate-y-0.5 shadow-lg shadow-black/10",
};
const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-6 text-[0.95rem]",
  lg: "min-h-13 px-8 text-base",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

/** The sheen that sweeps across primary buttons. */
export const Shine = () => (
  <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 opacity-0 transition-opacity group-hover/btn:animate-shine group-hover/btn:opacity-100" />
);

type Common = { variant?: ButtonVariant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant, size, className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {variant === "primary" || !variant ? <Shine /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {variant === "primary" || !variant ? <Shine /> : null}
      {children}
    </Link>
  );
}
