"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
let loader: Promise<void> | null = null;

/** Injects reCAPTCHA v3 once, on first form interaction (not on page load). */
export function loadRecaptcha() {
  if (!SITE_KEY || typeof window === "undefined") return Promise.resolve();
  loader ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => window.grecaptcha?.ready(() => resolve());
    s.onerror = () => {
      loader = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

export function useRecaptcha() {
  const execute = useCallback(async (action: string) => {
    if (!SITE_KEY) return "dev-token-no-recaptcha-key";
    await loadRecaptcha();
    return window.grecaptcha!.execute(SITE_KEY, { action });
  }, []);
  return { execute, preload: loadRecaptcha };
}
