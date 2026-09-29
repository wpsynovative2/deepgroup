import "server-only";

const SHEETS = {
  lead: "Leads",
  redevelopment: "Redevelopment",
  career: "Careers",
  "channel-partner": "ChannelPartners",
} as const;

export async function forwardToSheet(formType: keyof typeof SHEETS, data: Record<string, unknown>) {
  const url = process.env.GSCRIPT_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[lead] GSCRIPT_WEBHOOK_URL not set; ${SHEETS[formType]} row:`, { ...data, resumeBase64: undefined });
      return true;
    }
    return false;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    body: JSON.stringify({ secret: process.env.GSCRIPT_SHARED_SECRET, sheet: SHEETS[formType], data }),
  }).catch(() => null);
  if (!res?.ok) return false;
  const body = await res.json().catch(() => ({ ok: false }));
  return body.ok === true;
}
