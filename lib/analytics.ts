import { site } from "./site";

export const GA_MEASUREMENT_ID = "G-TQBVF15YCN";
const CONSENT_KEY = "joaquim.analytics-consent.v1";
const CONSENT_EVENT = "joaquim:analytics-consent";
export const OPEN_COOKIE_SETTINGS = "joaquim:cookie-settings";
export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    "ga-disable-G-TQBVF15YCN"?: boolean;
  }
}

let sessionConsent: AnalyticsConsent | null = null;
let initialized = false;
let paths = new Set<string>();

export function getConsent(): AnalyticsConsent | null {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (saved) return saved.expires > Date.now() && ["granted", "denied"].includes(saved.value) ? saved.value : null;
    return sessionConsent;
  } catch { return sessionConsent; }
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

export function saveConsent(value: AnalyticsConsent) {
  sessionConsent = value;
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, expires: Date.now() + 180 * 86400000 })); } catch { /* Keep the choice for this page when storage is unavailable. */ }
  if (value === "denied") disableAnalytics();
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function disableAnalytics() {
  window["ga-disable-G-TQBVF15YCN"] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, ".drjoaquimlopes.com.br"];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""} SameSite=Lax`;
  }
}

export function setAnalyticsPaths(allowed: string[]) { paths = new Set(allowed); }
export function analyticsPath(path = window.location.pathname) { return paths.has(path) ? path : "/404"; }
export function analyticsLocation() { return `${window.location.origin}${analyticsPath()}`; }

export function enableAnalytics() {
  window["ga-disable-G-TQBVF15YCN"] = false;
  window.dataLayer ||= [];
  // gtag's command queue uses IArguments rather than a dataLayer event array.
  // eslint-disable-next-line prefer-rest-params
  window.gtag ||= function gtag() { window.dataLayer?.push(arguments); };
  const advertising = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  if (!initialized) window.gtag("consent", "default", { ...advertising, analytics_storage: "denied" });
  window.gtag("consent", "update", { ...advertising, analytics_storage: "granted" });
  if (initialized) return;
  initialized = true;
  window.gtag("js", new Date());
  window.gtag("set", "ads_data_redaction", true);
  let referrer = "";
  try { referrer = document.referrer ? new URL(document.referrer).origin : ""; } catch { /* No valid referrer. */ }
  window.gtag("set", { page_location: analyticsLocation(), page_referrer: referrer });
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false, allow_ad_personalization_signals: false,
    cookie_expires: 180 * 86400, cookie_flags: "SameSite=Lax;Secure",
  });
}

type EventParams = Record<string, string>;
export function trackEvent(name: string, params: EventParams = {}) {
  if (getConsent() !== "granted" || window["ga-disable-G-TQBVF15YCN"]) return;
  window.gtag?.("event", name, { send_to: GA_MEASUREMENT_ID, page_location: analyticsLocation(), page_path: analyticsPath(), ...params });
}

const anatomyIds = new Set(["meniscos", "ligamentos", "patela", "tendoes", "femur", "tibia", "fibula", "musculos"]);
function placement(element: Element) {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest("[data-nav-background]")) return "floating";
  if (element.closest("#explorar-joelho")) return "anatomy";
  return "content";
}

/** Only predefined actions and public route paths; never link text, queries, phone numbers or messages. */
export function trackSiteClick(event: MouseEvent) {
  if (getConsent() !== "granted") return;
  const element = event.target instanceof Element ? event.target.closest("a, button") : null;
  if (!element) return;
  const params: EventParams = { placement: placement(element) };
  const part = element.getAttribute("data-part");
  if (part && anatomyIds.has(part)) {
    trackEvent("anatomy_structure", { ...params, structure: part, action: element.getAttribute("aria-pressed") === "true" ? "deselect" : "select" });
    return;
  }
  const action = element.getAttribute("data-analytics-action");
  if (action && ["play", "pause", "restore", "front", "side", "back"].includes(action)) {
    trackEvent("anatomy_control", { ...params, action }); return;
  }
  if (!(element instanceof HTMLAnchorElement)) return;
  let url: URL;
  try { url = new URL(element.href); } catch { return; }
  if (url.href === site.googleProfileUrl) {
    trackEvent("google_reviews_click", params); return;
  }
  if (["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) {
    trackEvent("whatsapp_click", params); return;
  }
  if (["tel:", "mailto:"].includes(url.protocol)) {
    trackEvent("contact_click", { ...params, method: url.protocol === "tel:" ? "phone" : "email" }); return;
  }
  if (url.origin !== location.origin || !paths.has(url.pathname) || url.pathname === location.pathname) return;
  const target_path = url.pathname;
  const name = target_path === "/pre-agendamento" ? "appointment_click" : target_path === "/joelho/anatomia" ? "anatomy_open" : target_path.startsWith("/blog/") ? "article_click" : "navigation_click";
  trackEvent(name, { ...params, target_path });
}
