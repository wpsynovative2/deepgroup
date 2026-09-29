import "server-only";

// In-memory sliding window: fine for a single instance. Swap for Upstash Redis on multi-instance serverless.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const MAX_KEYS = 5000;
const hits = new Map<string, number[]>();

export function rateLimit(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.delete(ip);
  hits.set(ip, recent);
  if (hits.size > MAX_KEYS) hits.delete(hits.keys().next().value!);
  return true;
}
