import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The supplied Deep Group lockup (public/icons/deep group Logo.png, copied to /logo-full.png).
 * `plate` sets it on a cream card for dark backgrounds, where its grey tagline would not read.
 */
export function Logo({ className, plate = false, priority = false }: { className?: string; plate?: boolean; priority?: boolean }) {
  const img = (
    <Image
      src="/logo-full.png"
      alt="Deep Group"
      width={329}
      height={229}
      preload={priority}
      className={cn("w-auto", plate ? "h-full" : className)}
    />
  );
  if (!plate) return img;
  return <span className={cn("inline-flex rounded-2xl bg-cream p-3 shadow-lg shadow-black/10", className)}>{img}</span>;
}

/** The skyline mark alone, for compact spots. */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/logo-mark.png" alt="" width={161} height={147} className={cn("h-auto", className)} aria-hidden />;
}
