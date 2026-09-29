import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Ornament } from "@/components/decor/Ornament";

type Props = {
  title: ReactNode;
  accent?: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
};

/** Section title with a gold script accent word and ornament divider. */
export function SectionHeading({ title, accent, subtitle, align = "center", tone = "light", as: H = "h2", className, children }: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "", className)} data-reveal>
      <Ornament className={cn("mb-4", align === "center" && "mx-auto", dark ? "text-gold-400" : "text-gold-500")} />
      <H className={cn("text-[2rem] leading-[1.1] md:text-[2.75rem]", dark && "text-white")}>
        {title}
        {accent ? (
          <>
            {" "}
            <span className={cn("font-script text-[1.35em] leading-none font-normal", dark ? "text-gold-400" : "text-gold-600")}>
              {accent}
            </span>
          </>
        ) : null}
      </H>
      {subtitle ? <p className={cn("mt-4 text-lg", dark ? "text-white/75" : "text-muted")}>{subtitle}</p> : null}
      {children}
    </div>
  );
}
