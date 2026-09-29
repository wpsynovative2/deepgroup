import "server-only";

export async function verifyRecaptcha(token: string, expectedAction: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // Local development without keys: accept, but flag for review.
  if (!secret) return { score: process.env.NODE_ENV === "production" ? 0 : 0.5 };

  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  })
    .then((x) => x.json())
    .catch(() => ({ success: false }));

  const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost").hostname;
  const hostOk = [siteHost, "localhost"].includes(r.hostname);
  if (!r.success || r.action !== expectedAction || !hostOk) return { score: 0 };
  return { score: Number(r.score ?? 0) };
}
