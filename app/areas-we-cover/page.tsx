import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Nationwide UK Cleaning Coverage",
  description: "Coreserve provides postcode-led cleaning coverage across the UK, including Greater London, Greater Manchester, Merseyside and Lancashire.",
  alternates: { canonical: "/areas-we-cover" },
};

const priorityAreas = ["Greater London", "Greater Manchester", "Merseyside", "Lancashire"];

export default function AreasPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="shell page-hero__grid"><div><span className="eyebrow eyebrow--light">Areas we cover</span><h1>Based in North-West<br />Nationwide coverage</h1></div><div><p>We assess residential, commercial and property-management cleaning enquiries across the United Kingdom using the postcode, requested services and required date.</p><Link className="button button--primary" href="/contact">Check your postcode <ArrowRight /></Link></div></div></section>
      <section className="section"><div className="shell coverage coverage--top"><div><span className="eyebrow">Service area</span><h2>Nationwide across the United Kingdom</h2><p>Our North-West base supports a postcode-led scheduling model for one-off and repeat cleaning requirements.</p><p>Send the full postcode and preferred date so travel, access and the appropriate cleaning team can be confirmed before quotation.</p><ul className="check-list"><li><Check /> Nationwide residential and commercial enquiries</li><li><Check /> Postcode and travel checked before booking</li><li><Check /> Property type, access and timing reviewed together</li></ul></div><aside className="map-card"><MapPin /><span>UK</span><strong>Nationwide</strong><p>Coverage is confirmed individually from the property postcode and required date.</p></aside></div></section>
      <section className="section section--pale"><div className="shell"><div className="section-heading split-heading"><div><span className="eyebrow">Priority service areas</span><h2>Regional coverage with nationwide reach</h2></div><p>These are key areas for current enquiries. Cleaning requests from other UK locations are also welcome and assessed by postcode.</p></div><div className="region-grid">{priorityAreas.map((area, index) => <article key={area}><span>{String(index + 1).padStart(2, "0")}</span><MapPin /><h3>{area}</h3><p>Residential, commercial and property-management cleaning enquiries.</p></article>)}</div></div></section>
      <section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">How we confirm coverage</span><h2>Three details are usually enough to begin</h2></div><ol className="stage-grid stage-grid--three"><li><span>01</span><h3>Postcode</h3><p>So location, travel and team availability can be assessed.</p></li><li><span>02</span><h3>Cleaning services</h3><p>Select every cleaning type required at the property.</p></li><li><span>03</span><h3>Required date</h3><p>We confirm timing and availability before the work is booked.</p></li></ol></div></section>
      <section className="cta-band"><div className="shell cta-band__inner"><div><h2>Have the property postcode?</h2></div><Link className="button button--primary" href="/contact">Check availability <ArrowRight /></Link></div></section>
    </main>
  );
}
