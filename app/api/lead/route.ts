import { NextResponse, type NextRequest } from "next/server";
import { schemaFor } from "@/lib/schemas/lead.schema";
import { verifyRecaptcha } from "@/lib/lead/verifyRecaptcha";
import { rateLimit } from "@/lib/lead/rateLimit";
import { forwardToSheet } from "@/lib/lead/forwardToSheet";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schemaFor(body?.formType).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const lead = parsed.data as Record<string, unknown> & (typeof parsed)["data"];

  // Honeypot + time trap: pretend success so bots learn nothing.
  if (lead.website || Date.now() - lead.renderedAt < 3000) return NextResponse.json({ ok: true });

  const captcha = await verifyRecaptcha(lead.recaptchaToken, `${lead.formType}_submit`);
  if (captcha.score < 0.3) return NextResponse.json({ ok: true }); // silently drop

  // Anti-spam and consent fields never reach the sheet.
  const INTERNAL = new Set(["website", "renderedAt", "recaptchaToken", "consent", "tracking", "operatingAreas"]);
  const fields = Object.fromEntries(Object.entries(lead).filter(([k]) => !INTERNAL.has(k)));
  const { tracking, operatingAreas } = lead as Record<string, unknown>;

  const ok = await forwardToSheet(lead.formType, {
    timestamp: new Date().toISOString(),
    ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v ?? ""])),
    ...(Array.isArray(operatingAreas) && { operatingAreas: operatingAreas.join(", ") }),
    recaptchaScore: captcha.score,
    quality: captcha.score >= 0.5 ? "ok" : "review",
    ...(tracking as Record<string, string> | undefined),
  });

  if (!ok) {
    return NextResponse.json({ ok: false, error: "We couldn't save your details. Please call us instead." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
