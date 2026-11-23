import { Camera, ClipboardList, FileText, MapPin, Star } from "lucide-react";
import { siteConfig } from "@/lib/site";

/**
 * Proof points shown under the homepage hero and on service pages.
 * Only confirmed facts from siteConfig are shown — never add unverified claims
 * (insurance, DBS checks, job counts) until they are true and set in lib/site.ts.
 */
export function TrustStrip() {
  const items = [
    { icon: FileText, text: "Itemised quote before you book" },
    siteConfig.commitments.completionPhotos ? { icon: Camera, text: "Photos sent after every job" } : null,
    siteConfig.commitments.sameDaySummary ? { icon: ClipboardList, text: "Written job summary the same day" } : null,
    { icon: MapPin, text: `Own teams: ${siteConfig.coverage.short}` },
  ].filter((item): item is { icon: typeof Star; text: string } => item !== null);

  return (
    <section className="confidence-strip" aria-label="Why customers choose Coreserve">
      <div className="shell confidence-strip__grid confidence-strip__grid--auto">
        {items.map(({ icon: Icon, text }) => <span key={text}><Icon aria-hidden="true" /> {text}</span>)}
        <a className="confidence-strip__review" href={siteConfig.social.trustpilot} target="_blank" rel="noopener noreferrer">
          <Star aria-hidden="true" /> {siteConfig.trustpilotRating ? `Rated ${siteConfig.trustpilotRating} on Trustpilot` : "Read our Trustpilot reviews"}
        </a>
      </div>
    </section>
  );
}
