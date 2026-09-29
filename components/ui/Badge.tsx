import type { Status } from "@/types";
import { cn } from "@/lib/utils";

const STYLES: Record<Status, string> = {
  upcoming: "bg-brand-50 text-brand-700 ring-brand-100",
  ongoing: "bg-gold-100 text-gold-600 ring-gold-200",
  completed: "bg-surface text-ink ring-line",
};
const LABELS: Record<Status, string> = { upcoming: "Upcoming", ongoing: "Ongoing", completed: "Completed" };

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur",
        STYLES[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", status === "ongoing" ? "animate-pulse bg-gold-500" : status === "upcoming" ? "bg-brand-700" : "bg-muted")} />
      {LABELS[status]}
    </span>
  );
}
