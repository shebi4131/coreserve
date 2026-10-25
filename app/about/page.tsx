import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Coreserve Facilities Group",
  description: "Learn how Coreserve coordinates clearly scoped residential and commercial cleaning from its North-West base for clients nationwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="shell page-hero__grid">
          <div><span className="eyebrow eyebrow--light">About Coreserve</span><h1>One practical contact.<br />Every detail connected.</h1></div>
          <div><p>Coreserve Facilities Group helps tenants, landlords, agents, homeowners and businesses arrange clearly scoped cleaning throughout the United Kingdom.</p><Link className="button button--primary" href="/contact">Discuss your property <ArrowRight /></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="shell story-grid">
          <div className="values-panel">
            <div><ClipboardCheck /><span>Scope</span><strong>Know what is included</strong></div>
            <div><MapPin /><span>Coverage</span><strong>Confirmed from the postcode</strong></div>
            <div><ShieldCheck /><span>Standards</span><strong>Careful, checklist-led service delivery</strong></div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">Our approach</span>
            <h2>Good service begins before anyone arrives.</h2>
            <p>A useful quotation depends on the property, required outcome, condition, access and deadline. We collect those details early so the task list and arrangements are easier to understand.</p>
            <p>Cleaning work follows the agreed scope, whether it is a one-off domestic clean, a property handover or a planned commercial service. Selected extras and practical arrangements are kept visible from quotation to completion.</p>
            <ul className="check-list">
              <li><Check /> Itemised scope where the work has optional elements</li>
              <li><Check /> Responsible contacts and access agreed in advance</li>
              <li><Check /> Variations discussed rather than silently assumed</li>
              <li><Check /> Practical communication after the visit</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading"><div><span className="eyebrow">Who we support</span><h2>Different properties, the same need for clarity.</h2></div><p>Coreserve can support one-off requirements and repeat cleaning arrangements, subject to availability.</p></div>
          <div className="audience-grid"><article><h3>Tenants &amp; homeowners</h3><p>Move-out, move-in, regular and deep-cleaning requirements with a clear route to quotation.</p></article><article><h3>Landlords &amp; agents</h3><p>Property changeovers, communal areas and cleaning support with careful access planning.</p></article><article><h3>Businesses &amp; managers</h3><p>Planned office, commercial and housekeeping services for occupied and managed spaces.</p></article></div>
        </div>
      </section>

      <section className="cta-band"><div className="shell cta-band__inner"><div><h2>Tell us what the property needs.</h2></div><Link className="button button--primary" href="/contact">Request a quote <ArrowRight /></Link></div></section>
    </main>
  );
}
