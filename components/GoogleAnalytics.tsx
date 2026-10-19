"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { analyticsLocation, disableAnalytics, enableAnalytics, GA_MEASUREMENT_ID, getConsent, OPEN_COOKIE_SETTINGS, saveConsent, setAnalyticsPaths, subscribeConsent, trackEvent, trackSiteClick, type AnalyticsConsent } from "@/lib/analytics";

export function GoogleAnalytics({ paths }: { paths: string[] }) {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const previousLocation = useRef<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setAnalyticsPaths(paths);
    if (consent === "granted") enableAnalytics();
    else disableAnalytics();
  }, [consent, paths]);

  useEffect(() => {
    if (consent !== "granted") return;
    const current = analyticsLocation();
    if (current === previousLocation.current) return;
    let referrer = previousLocation.current || "";
    if (!referrer && document.referrer) {
      try { referrer = new URL(document.referrer).origin; } catch { /* Ignore malformed referrers. */ }
    }
    window.gtag?.("set", { page_location: current, page_title: document.title, page_referrer: referrer });
    trackEvent("page_view", { page_location: current, page_title: document.title, page_referrer: referrer });
    previousLocation.current = current;
    // Enhanced Measurement must be disabled in this GA4 stream. Only this effect owns page_view.
  }, [pathname, consent]);

  useEffect(() => {
    const open = () => { trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setSettingsOpen(true); };
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    document.addEventListener("click", trackSiteClick, true);
    return () => { window.removeEventListener(OPEN_COOKIE_SETTINGS, open); document.removeEventListener("click", trackSiteClick, true); };
  }, []);

  function choose(value: AnalyticsConsent) {
    const revoking = consent === "granted" && value === "denied";
    saveConsent(value);
    setSettingsOpen(false);
    trigger.current?.focus({ preventScroll: true });
    // Unload Google's runtime as well when withdrawing a previous permission.
    if (revoking) window.location.reload();
  }

  return <>
    {consent === "granted" && <Script id="google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />}
    {(consent === null || settingsOpen) && <section className="cookie-notice" data-nav-background role="region" aria-labelledby="cookie-notice-title">
      <div><h2 id="cookie-notice-title">Estatísticas de navegação</h2><p>Com sua autorização, usamos o Google Analytics para entender as páginas visitadas e os cliques no site. Você pode recusar ou mudar sua escolha no rodapé. <Link href="/politica-de-privacidade">Política de privacidade</Link>.</p></div>
      <div className="cookie-notice-actions"><button type="button" onClick={() => choose("denied")}>Recusar</button><button type="button" onClick={() => choose("granted")}>Aceitar estatísticas</button>{settingsOpen && consent !== null && <button type="button" onClick={() => { setSettingsOpen(false); trigger.current?.focus({ preventScroll: true }); }}>Fechar</button>}</div>
    </section>}
  </>;
}
