import { cn } from "@/lib/utils";

export type Completion = { percent: number; ocReceived?: boolean };

export const completionLabel = (c: Completion) => (c.ocReceived ? "OC received" : `${c.percent}% complete`);

/** Construction progress bar. Once the OC is received the bar is full and says so instead of a percentage. */
export function CompletionBar({
  completion,
  tone = "dark",
  className,
  style,
}: {
  completion: Completion;
  tone?: "dark" | "light";
  className?: string;
  style?: React.CSSProperties;
}) {
  const percent = completion.ocReceived ? 100 : completion.percent;
  const label = completionLabel(completion);
  const light = tone === "light";
  return (
    <div className={className} style={style}>
      <div className={cn("flex items-center justify-between text-xs", light ? "text-white/70" : "text-muted")}>
        <span>Construction</span>
        <span className={cn("font-semibold", light ? "text-gold-400" : "text-brand-700")}>{label}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Construction progress"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={label}
        className={cn("mt-1.5 h-1.5 overflow-hidden rounded-full", light ? "bg-white/15" : "bg-gold-100")}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
