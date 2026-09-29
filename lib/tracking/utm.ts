const KEY = "dg_tracking";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

/** First-touch attribution for the session. Call once on first page load. */
export function captureTracking() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const sp = new URLSearchParams(window.location.search);
    const data: Record<string, string> = {
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer.slice(0, 300),
    };
    for (const p of PARAMS) {
      const v = sp.get(p);
      if (v) data[p] = v.slice(0, 300);
    }
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage blocked */
  }
}

export function getTracking(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
