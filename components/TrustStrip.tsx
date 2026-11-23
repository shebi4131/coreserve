import { Camera, ClipboardList, FileText, MapPin, Star } from "lucide-react";
import { siteConfig } from "@/lib/site";

/**
 * Proof points shown under the homepage hero and on service pages.
 * Only confirmed facts from siteConfig are shown — never add unverified claims
 * (insurance, DBS checks, job counts) until they are true and set in lib/site.ts.
 * Each item is a short title plus a one-line detail so the columns stay even.
 */
export function TrustStrip() {
  const items = [
    { icon: FileText, title: "Itemised quotes", detail: "Every task priced upfront" },
    siteConfig.commitments.completionPhotos ? { icon: Camera, title: "Completion photos", detail: "Sent after every job" } : null,
    siteConfig.commitments.sameDaySummary ? { icon: ClipboardList, title: "Same-day summary", detail: "Written report of the work" } : null,
    { icon: MapPin, title: "Across the UK", detail: "Own teams in 4 regions" },
  ].filter((item): item is { icon: typeof Star; title: string; detail: string } => item !== null);

  return (
    <section className="trust-strip" aria-label="Why customers choose Coreserve">
      <div className="shell">
      <ul className="trust-strip__grid" style={{ ["--trust-cols" as string]: items.length + 1 }}>
        {items.map(({ icon: Icon, title, detail }) => (
          <li key={title}><Icon aria-hidden="true" /><span><strong>{title}</strong>{detail}</span></li>
        ))}
        <li>
          <Star aria-hidden="true" />
          <a href={siteConfig.social.trustpilot} target="_blank" rel="noopener noreferrer">
            <strong>{siteConfig.trustpilotRating ? `Rated ${siteConfig.trustpilotRating}` : "Trustpilot reviews"}</strong>Read what customers say
          </a>
        </li>
      </ul>
      </div>
    </section>
  );
}
