import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, CalendarCheck, Check, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { CleanerApplicationForm } from "@/components/CleanerApplicationForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning Jobs and Opportunities",
  description:
    "Join Coreserve Facilities Group. Apply for cleaning and housekeeping opportunities across the North-West and other covered UK locations.",
  alternates: { canonical: "/join-us" },
  openGraph: {
    title: "Join Coreserve Facilities Group",
    description: "Tell us about your experience, availability, travel and preferred working areas.",
    url: "/join-us",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  },
};

const applicationPoints = [
  {
    icon: BadgeCheck,
    title: "Professional standards",
    copy: "We are interested in dependable people who take pride in careful, respectful work.",
  },
  {
    icon: CalendarCheck,
    title: "Clear availability",
    copy: "Tell us the days and times that genuinely work for you so suitable opportunities can be considered.",
  },
  {
    icon: MapPin,
    title: "Practical coverage",
    copy: "Share the areas you can reach and your usual means of travel so we can understand your working radius.",
  },
];

export default function JoinUsPage() {
  return (
    <main id="main-content">
      <section className="join-hero">
        <div className="shell join-hero__grid">
          <div>
            <span className="eyebrow eyebrow--light">Careers and opportunities</span>
            <h1>Do great work.<br />Be part of Coreserve.</h1>
          </div>
          <div className="join-hero__intro">
            <p>
              We welcome applications from cleaners and housekeepers who are reliable, detail-focused and comfortable working in customers&apos; properties.
            </p>
            <a className="button button--primary" href="#cleaner-application">
              Start your application <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="section application-section" id="cleaner-application" aria-labelledby="application-title">
        <div className="shell application-shell">
          <div className="application-intro">
            <span className="eyebrow">Cleaner application</span>
            <h2 id="application-title">Tell us about yourself.</h2>
            <p>
              Complete every required field in the application below. Your response is securely recorded in Coreserve&apos;s connected cleaner onboarding sheet.
            </p>
            <ul className="check-list">
              <li><Check aria-hidden="true" />Allow a few minutes to complete it</li>
              <li><Check aria-hidden="true" />Use up-to-date contact details</li>
              <li><Check aria-hidden="true" />Check your answers before submitting</li>
            </ul>
            <div className="application-note"><Check aria-hidden="true" /><p><strong>Three short steps</strong>No Google account or separate form window is required.</p></div>
          </div>
          <CleanerApplicationForm />
        </div>
      </section>

      <section className="section join-overview" aria-labelledby="join-overview-title">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Working with Coreserve</span>
              <h2 id="join-overview-title">A clear application.<br />A considered response.</h2>
            </div>
            <p>
              Completing the form helps us understand your experience, right-to-work status, availability, travel arrangements and the locations you can cover. An application does not guarantee work, but it gives us the information needed to consider a suitable match.
            </p>
          </div>

          <div className="join-pillars">
            {applicationPoints.map(({ icon: Icon, title, copy }) => (
              <article className="join-pillar" key={title}>
                <span><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section join-process" aria-labelledby="join-process-title">
        <div className="shell join-process__grid">
          <div>
            <span className="eyebrow">Before you apply</span>
            <h2 id="join-process-title">Have the essentials ready.</h2>
            <p>Your answers should be accurate and current. We may ask for supporting information if an appropriate opportunity becomes available.</p>
          </div>
          <ul className="join-requirements">
            <li><ShieldCheck aria-hidden="true" /><span><strong>Right to work</strong>Provide your current UK visa or right-to-work status.</span></li>
            <li><Sparkles aria-hidden="true" /><span><strong>Relevant experience</strong>Tell us about cleaning, housekeeping or facilities experience.</span></li>
            <li><CalendarCheck aria-hidden="true" /><span><strong>Real availability</strong>Select the days and time periods you can consistently cover.</span></li>
            <li><MapPin aria-hidden="true" /><span><strong>Areas and travel</strong>List your coverage areas and how you normally travel to work.</span></li>
          </ul>
        </div>
      </section>

    </main>
  );
}
