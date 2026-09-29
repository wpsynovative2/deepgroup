import { cn } from "@/lib/utils";

/** Line-art palm/leaf sprig, echoing the botanical accents in the UI reference. */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 260" fill="none" aria-hidden className={cn("pointer-events-none", className)}>
      <path d="M80 258C78 190 82 120 96 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[
        [92, 40, -1], [90, 62, 1], [88, 86, -1], [86, 110, 1], [84, 136, -1], [83, 162, 1], [82, 190, -1], [81, 216, 1],
      ].map(([x, y, dir], i) => {
        const s = 1 - i * 0.04;
        const d = dir as number;
        return (
          <path
            key={i}
            d={`M${x} ${y} C ${x + d * 26 * s} ${y - 26 * s}, ${x + d * 58 * s} ${y - 14 * s}, ${x + d * 68 * s} ${y + 6 * s} C ${x + d * 44 * s} ${y + 10 * s}, ${x + d * 22 * s} ${y + 8 * s}, ${x} ${y}Z`}
            fill="currentColor"
            fillOpacity={0.08 + (i % 3) * 0.04}
            stroke="currentColor"
            strokeWidth="1.2"
          />
        );
      })}
    </svg>
  );
}

/** Soft organic blob, used behind images as in the reference. */
export function Blob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={cn("pointer-events-none", className)}>
      <path
        fill="currentColor"
        d="M320 70c46 44 68 118 46 180-22 63-88 114-160 120S58 332 30 270C2 207 10 124 58 76 106 28 196 12 246 26c30 8 52 25 74 44z"
      />
    </svg>
  );
}
