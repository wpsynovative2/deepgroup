"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureTracking } from "@/lib/tracking/utm";

/**
 * One IntersectionObserver for the whole page: adds `.is-visible` to every
 * `[data-reveal]` element as it scrolls into view. Re-scans on navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    captureTracking();
  }, []);

  useEffect(() => {
    const SELECTOR = "[data-reveal]:not(.is-visible), .draw-path:not(.is-visible)";
    const els = document.querySelectorAll<HTMLElement>(SELECTOR);
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));

    // Catch elements rendered later on the client (filter results, modals).
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches(SELECTOR)) io.observe(n);
          n.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => io.observe(el));
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
