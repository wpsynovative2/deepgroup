import { cn } from "@/lib/utils";

/** Gold divider: line · diamond · arch · diamond · line */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 16" className={cn("h-4 w-[120px]", className)} aria-hidden fill="none" stroke="currentColor">
      <path d="M0 8h40M80 8h40" strokeWidth="1" />
      <path d="M44 8l4-4 4 4-4 4z M68 8l4-4 4 4-4 4z" fill="currentColor" stroke="none" />
      <path d="M54 13V9a6 6 0 0 1 12 0v4" strokeWidth="1.3" />
    </svg>
  );
}
