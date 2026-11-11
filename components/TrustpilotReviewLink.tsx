import { ArrowUpRight, Star } from "lucide-react";
import { siteConfig } from "@/lib/site";

type TrustpilotReviewLinkProps = {
  variant?: "banner" | "compact";
};

export function TrustpilotReviewLink({ variant = "banner" }: TrustpilotReviewLinkProps) {
  if (variant === "compact") {
    return (
      <a
        className="trustpilot-link trustpilot-link--compact"
        href={siteConfig.social.trustpilot}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Review Coreserve Facilities Group on Trustpilot"
      >
        <Star aria-hidden="true" />
        <span>Review us on Trustpilot</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    );
  }

  return (
    <section className="trustpilot-review" aria-labelledby="trustpilot-review-title">
      <div className="shell trustpilot-review__inner">
        <div className="trustpilot-review__message">
          <span className="trustpilot-review__mark" aria-hidden="true"><Star /></span>
          <div>
            <span className="eyebrow">Customer feedback</span>
            <h2 id="trustpilot-review-title">Used Coreserve? Share your experience.</h2>
            <p>Your honest feedback helps future customers make an informed choice.</p>
          </div>
        </div>
        <a
          className="button trustpilot-review__button"
          href={siteConfig.social.trustpilot}
          target="_blank"
          rel="noopener noreferrer"
        >
          Review us on Trustpilot <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
