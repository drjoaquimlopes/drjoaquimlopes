"use client";

import { OPEN_COOKIE_SETTINGS } from "@/lib/analytics";

export function CookiePreferences() {
  return <button type="button" className="min-h-11 text-left text-sm text-white/55 transition-colors hover:text-white" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}>Preferências de cookies</button>;
}
