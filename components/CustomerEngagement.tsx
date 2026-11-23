"use client";

import Link from "next/link";
import Script from "next/script";
import { trackQuoteLead } from "@/lib/meta-pixel";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { cleaningTypes } from "@/lib/services";
import { siteConfig } from "@/lib/site";
import { SocialIcon } from "@/components/SocialIcon";

declare global {
  interface Window {
    Tawk_LoadStart?: Date;
    Tawk_API?: {
      hideWidget?: () => void;
      maximize?: () => void;
      onLoad?: () => void;
    };
  }
}

const GREETING_KEY = "coreserve-engagement-greeting-seen";
const EXIT_KEY = "coreserve-exit-offer-shown";

const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const tawkWidgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;
const hasLiveChat = Boolean(tawkPropertyId && tawkWidgetId);

function canShowExitOffer() {
  return !window.sessionStorage.getItem(EXIT_KEY);
}

export function CustomerEngagement() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");
  const [quoteSource, setQuoteSource] = useState("Engagement panel");
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome");
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const interactionStateRef = useRef({ panelOpen, quoteOpen, exitOpen });

  useEffect(() => {
    interactionStateRef.current = { panelOpen, quoteOpen, exitOpen };
  }, [panelOpen, quoteOpen, exitOpen]);

  useEffect(() => {
    // Greeting follows UK time (Europe/London handles GMT/BST), not the visitor's device clock.
    const ukHour = () => Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/London" }).format(new Date()));
    const update = () => {
      const hour = ukHour();
      setWelcomeMessage(hour < 5 ? "Good evening" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hasLiveChat) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = () => window.Tawk_API?.hideWidget?.();

    let pageTitle = document.title;
    const unreadTitle = /^(?:\(\d+\)\s*)?\d+\s+new messages?$/i;
    const titleElement = document.querySelector("title");
    const titleObserver = titleElement ? new MutationObserver(() => {
      if (unreadTitle.test(document.title.trim())) document.title = pageTitle;
      else pageTitle = document.title;
    }) : null;
    titleObserver?.observe(titleElement!, { childList: true, subtree: true, characterData: true });

    return () => titleObserver?.disconnect();
  }, []);

  useEffect(() => {
    const greetingTimer = window.setTimeout(() => {
      if (!window.sessionStorage.getItem(GREETING_KEY)) setGreetingVisible(true);
    }, 4500);

    const exitTimer = window.setTimeout(() => {
      const interaction = interactionStateRef.current;
      if (
        interaction.panelOpen ||
        interaction.quoteOpen ||
        interaction.exitOpen ||
        !canShowExitOffer()
      ) return;

      window.sessionStorage.setItem(EXIT_KEY, "true");
      setGreetingVisible(false);
      setExitOpen(true);
    }, 9000);

    return () => {
      window.clearTimeout(greetingTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    if (!panelOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !launcherRef.current?.contains(target)) setPanelOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
        launcherRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [panelOpen]);

  useEffect(() => {
    const modalOpen = quoteOpen || exitOpen;
    if (!modalOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-autofocus], button, input, select, textarea, a")?.focus();
    });

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuoteOpen(false);
        setExitOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [quoteOpen, exitOpen]);

  function dismissGreeting() {
    window.sessionStorage.setItem(GREETING_KEY, "true");
    setGreetingVisible(false);
  }

  function togglePanel() {
    dismissGreeting();
    setPanelOpen((current) => !current);
  }

  function openQuote(source: string) {
    setQuoteSource(source);
    setStatus("");
    setStatusType("idle");
    setPanelOpen(false);
    setExitOpen(false);
    setQuoteOpen(true);
  }

  function openLiveChat() {
    dismissGreeting();
    setPanelOpen(false);
    if (window.Tawk_API?.maximize) window.Tawk_API.maximize();
    else openQuote("Chat fallback");
  }

  function handleOverlayKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && event.target === event.currentTarget) {
      setQuoteOpen(false);
      setExitOpen(false);
    }
  }

  async function submitQuickQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

    if (!endpoint) {
      setStatus("Online enquiries are not configured yet. Please call or use WhatsApp.");
      setStatusType("error");
      return;
    }

    const form = new FormData(formElement);
    if (form.get("website")) return;

    const payload = new URLSearchParams();
    const fieldNames = ["name", "phone", "email", "location", "message"];
    fieldNames.forEach((field) => payload.set(field, String(form.get(field) || "")));
    payload.set("cleaningServices", String(form.get("cleaningServices") || ""));
    payload.set("propertyType", "");
    payload.set("bedrooms", "");
    payload.set("bathrooms", "");
    payload.set("occupancy", "");
    payload.set("timing", String(form.get("timing") || ""));
    payload.set("date", "");
    payload.set("access", "");
    payload.set("extras", "");
    payload.set("source", quoteSource);
    payload.set("servicePage", "");
    payload.set("pageUrl", window.location.href);
    payload.set("submittedAt", new Date().toISOString());

    setIsSubmitting(true);
    setStatus("Sending your request...");
    setStatusType("idle");

    try {
      await fetch(endpoint, { method: "POST", mode: "no-cors", body: payload });
      trackQuoteLead();
      formElement.reset();
      setStatus("Thanks — your request is with the Coreserve team. We’ll review it and get back to you.");
      setStatusType("success");
    } catch {
      setStatus("We couldn’t send this request. Please try again or contact us by phone or WhatsApp.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {hasLiveChat ? (
        <Script
          id="tawk-live-chat"
          src={`https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`}
          strategy="lazyOnload"
          onReady={() => window.Tawk_API?.hideWidget?.()}
        />
      ) : null}

      <aside className="engagement" aria-label="Contact Coreserve">
        {greetingVisible && !panelOpen ? (
          <div className="engagement-greeting" role="status">
            <button type="button" className="engagement-greeting__close" onClick={dismissGreeting} aria-label="Dismiss message">
              <X size={16} />
            </button>
            <span className="engagement-greeting__icon"><img src="/brand/coreserve-mark.png" alt="" /></span>
            <div>
              <strong>Questions? Get a free quote or message us on WhatsApp.</strong>
              <button type="button" onClick={togglePanel}>Ask Coreserve <ArrowRight size={15} /></button>
            </div>
          </div>
        ) : null}

        {panelOpen ? (
          <div className="engagement-panel" id="coreserve-contact-panel" ref={panelRef}>
            <div className="engagement-panel__head">
              <span className="engagement-panel__avatar"><img src="/brand/coreserve-mark.png" alt="" /><i aria-hidden="true" /></span>
              <div>
                <small>Coreserve assistant</small>
                <h2>{welcomeMessage} <span aria-hidden="true">👋</span></h2>
              </div>
              <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close contact options"><X size={20} /></button>
            </div>
            <p className="engagement-panel__intro"><strong>How can we help with your property?</strong> Choose an option and we’ll point you in the right direction.</p>
            <div className="engagement-panel__actions">
              {hasLiveChat ? (
                <button type="button" onClick={openLiveChat}>
                  <span><MessageCircle size={20} /></span>
                  <span><strong>Chat with Coreserve</strong><small>Start a live conversation</small></span>
                  <ArrowRight size={18} />
                </button>
              ) : null}
              <button type="button" onClick={() => openQuote("Engagement panel quick quote")}>
                <span><FileText size={20} /></span>
                <span><strong>Request Free Quote</strong><small>Share the essentials in two minutes</small></span>
                <ArrowRight size={18} />
              </button>
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer">
                <span><SocialIcon platform="whatsapp" /></span>
                <span><strong>WhatsApp</strong><small>Ask a quick question</small></span>
                <ArrowRight size={18} />
              </a>
            </div>
            <div className="engagement-panel__foot"><ShieldCheck size={16} /> Your details are used only to respond to your enquiry.</div>
          </div>
        ) : null}

        <button
          ref={launcherRef}
          className="engagement-launcher"
          type="button"
          onClick={togglePanel}
          aria-expanded={panelOpen}
          aria-controls="coreserve-contact-panel"
          aria-label={panelOpen ? "Close contact options" : "Open contact options"}
        >
          {panelOpen ? <X size={25} /> : <span className="engagement-launcher__avatar"><img src="/brand/coreserve-mark.png" alt="" /><i aria-hidden="true" /></span>}
          <span className="engagement-launcher__label">{panelOpen ? "Close" : "Ask Coreserve"}</span>
        </button>
      </aside>

      {(quoteOpen || exitOpen) ? (
        <div
          className="engagement-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setQuoteOpen(false);
              setExitOpen(false);
            }
          }}
          onKeyDown={handleOverlayKeyDown}
          tabIndex={-1}
        >
          <div
            ref={dialogRef}
            className={`engagement-dialog ${exitOpen ? "engagement-dialog--exit" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={exitOpen ? "exit-offer-title" : "quick-quote-title"}
          >
            <button
              type="button"
              className="engagement-dialog__close"
              onClick={() => { setQuoteOpen(false); setExitOpen(false); }}
              aria-label="Close dialog"
              data-autofocus
            >
              <X size={21} />
            </button>

            {exitOpen ? (
              <div className="exit-offer">
                <span className="exit-offer__mark"><Sparkles size={28} /></span>
                <span className="eyebrow eyebrow--compact">Before you go</span>
                <h2 id="exit-offer-title">Would a clear cleaning quote help?</h2>
                <p>Share your postcode, property type and preferred timing. Our team can review the details without a lengthy phone call.</p>
                <ul>
                  <li><CheckCircle2 size={17} /> No obligation</li>
                  <li><Clock3 size={17} /> Takes about two minutes</li>
                  <li><ShieldCheck size={17} /> Details kept private</li>
                </ul>
                <button className="button button--primary" type="button" onClick={() => openQuote("Exit-intent quote offer")}>
                  Get my free quote <ArrowRight size={18} />
                </button>
                <button className="exit-offer__dismiss" type="button" onClick={() => setExitOpen(false)}>No thanks, continue browsing</button>
              </div>
            ) : (
              <form className="quick-quote" onSubmit={submitQuickQuote}>
                <span className="eyebrow eyebrow--compact">Free cleaning quote</span>
                <h2 id="quick-quote-title">Tell us the essentials.</h2>
                <p>We’ll save your request for the Coreserve team to review. You can add the finer details later.</p>
                <div className="quick-quote__grid">
                  <label className="form-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
                  <label><span>Full name *</span><input name="name" required autoComplete="name" placeholder="Your full name" /></label>
                  <label><span>Mobile number *</span><input name="phone" type="tel" required autoComplete="tel" placeholder="Best contact number" /></label>
                  <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
                  <label><span>Postcode or town *</span><input name="location" required autoComplete="postal-code" placeholder="For example, PR1" /></label>
                  <label className="quick-quote__wide">
                    <span>Cleaning service *</span>
                    <select name="cleaningServices" required defaultValue="">
                      <option value="" disabled>Choose a service</option>
                      {cleaningTypes.map((service) => <option key={service}>{service}</option>)}
                    </select>
                  </label>
                  <label className="quick-quote__wide">
                    <span>When do you need it? *</span>
                    <select name="timing" required defaultValue="">
                      <option value="" disabled>Choose a timeframe</option>
                      <option>As soon as possible</option>
                      <option>Within 2-3 days</option>
                      <option>Within 1 week</option>
                      <option>Specific date</option>
                      <option>Flexible</option>
                    </select>
                  </label>
                  <label className="quick-quote__wide"><span>Anything useful to know?</span><textarea name="message" rows={3} placeholder="Property type, condition, access or any deadline" /></label>
                  <label className="quick-quote__consent quick-quote__wide">
                    <input name="privacy" type="checkbox" required />
                    <span>I agree that my details may be used to respond to this enquiry, as described in the <Link href="/privacy">privacy notice</Link>.</span>
                  </label>
                </div>
                <div className="quick-quote__footer">
                  <button className="button button--primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <LoaderCircle className="button-spinner" size={18} /> : <Send size={18} />}
                    {isSubmitting ? "Sending..." : "Send quote request"}
                  </button>
                  <p className={statusType === "idle" ? undefined : `form-status form-status--${statusType}`} aria-live="polite">
                    {status || "No obligation. We’ll only use these details to respond."}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
