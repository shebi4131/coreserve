export const META_PIXEL_ID = "1142241685220849";
export const MARKETING_CONSENT_KEY = "coreserve-marketing-consent-v1";

type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: Pixel;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Pixel;
    _fbq?: Pixel;
  }
}

export function hasMarketingConsent() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MARKETING_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function initialiseMetaPixel() {
  if (!hasMarketingConsent()) return;
  if (!window.fbq) {
    const pixel = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    } as Pixel;
    pixel.queue = [];
    pixel.push = pixel;
    pixel.loaded = true;
    pixel.version = "2.0";
    window.fbq = pixel;
    window._fbq = pixel;
    pixel("consent", "grant");
    pixel("set", "autoConfig", false, META_PIXEL_ID);
    pixel("init", META_PIXEL_ID);
    const script = document.createElement("script");
    script.id = "coreserve-meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  } else {
    window.fbq("consent", "grant");
  }
}

export function trackQuoteLead() {
  // No contact details, property information or application data go to Meta.
  // Called only after the quote webhook request resolves, never on form steps.
  try {
    if (hasMarketingConsent()) window.fbq?.("track", "Lead");
  } catch {
    // Advertising scripts must never interrupt an enquiry.
  }
}
