import { cn } from "@/lib/utils";

/**
 * Organic section divider. Place at the top or bottom of a section; `fill` should match
 * the neighbouring section's background via a text-* class.
 */
export function Wave({ position = "top", className, variant = 1 }: { position?: "top" | "bottom"; className?: string; variant?: 1 | 2 }) {
  const d =
    variant === 1
      ? "M0 40 C 180 90, 360 0, 620 34 S 1080 80, 1440 22 V 100 H 0 Z"
      : "M0 60 C 240 10, 480 90, 760 50 S 1200 0, 1440 48 V 100 H 0 Z";
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-0 h-[42px] w-full md:h-[72px]",
        position === "top" ? "-top-px rotate-180" : "-bottom-px",
        className,
      )}
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}
