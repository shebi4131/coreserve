"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { initialiseMetaPixel, MARKETING_CONSENT_KEY } from "@/lib/meta-pixel";

const OPEN_COOKIE_PREFERENCES = "coreserve:open-cookie-preferences";

export function CookiePreferencesLink() {
  return <button type="button" className="cookie-preferences-link" aria-controls="cookie-preferences" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES))}>Cookie preferences</button>;
}

export function MarketingConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MARKETING_CONSENT_KEY);
      setChoice(saved === "accepted" || saved === "rejected" ? saved : null);
    } catch { /* Leave tracking off when storage is unavailable. */ }
    setReady(true);
    const openPreferences = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES, openPreferences);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES, openPreferences);
  }, []);

  useEffect(() => {
    if (choice !== "accepted" || pathname.startsWith("/admin")) return;
    try {
      initialiseMetaPixel();
      if (lastPage.current !== pathname) {
        window.fbq?.("track", "PageView");
        lastPage.current = pathname;
      }
    } catch { /* Tracking must not affect navigation. */ }
  }, [choice, pathname]);

  function saveChoice(nextChoice: "accepted" | "rejected") {
    try { localStorage.setItem(MARKETING_CONSENT_KEY, nextChoice); } catch {
      setChoice("rejected");
      setOpen(false);
      return;
    }
    if (nextChoice === "rejected") {
      window.fbq?.("consent", "revoke");
      lastPage.current = null;
    }
    setChoice(nextChoice);
    setOpen(false);
  }

  if (!ready || pathname.startsWith("/admin")) return null;
  return (
    <>
      {(choice === null || open) && (
        <section id="cookie-preferences" className="marketing-consent" aria-label="Cookie preferences">
          <div><h2>Your cookie choices</h2><p>With your permission, we use Meta Pixel to measure Facebook and Instagram ads and support relevant advertising. You can use our website and request a quote without accepting. <Link href="/privacy#cookies">Privacy and cookies</Link></p></div>
          <div className="marketing-consent__actions">
            <button type="button" className="button button--secondary" onClick={() => saveChoice("rejected")}>Reject Cookies</button>
            <button type="button" className="button button--primary" onClick={() => saveChoice("accepted")}>Accept Cookies</button>
          </div>
        </section>
      )}
    </>
  );
}
