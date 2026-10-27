import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

export const metadata: Metadata = {
  title: "UK Cleaning Service Areas",
  description: "Coreserve is based in North-West England and considers wider UK cleaning enquiries by postcode, location and availability.",
  alternates: { canonical: "/areas-we-cover" },
  openGraph: { images: [{ url: "/images/areas/nationwide-coverage.jpeg", width: 1312, height: 816, alt: "Coreserve team preparing for nationwide service coverage" }] },
};

const priorityAreas = ["Greater London", "Greater Manchester", "Merseyside", "Lancashire"];

export default function AreasPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="shell page-hero__grid"><div><span className="eyebrow eyebrow--light">Areas we cover</span><h1>Based in North-West<br />Wider UK coverage</h1></div><div><p>We coordinate residential, commercial and property-management cleaning across our service areas, with wider UK coverage subject to location and availability.</p><Link className="button button--primary" href="/contact">Check your postcode <ArrowRight /></Link></div></div></section>
      <section className="section"><div className="shell coverage coverage--top"><div><span className="eyebrow">Service area</span><h2>UK enquiries assessed by postcode</h2><p>Our North-West base supports a postcode-led scheduling model for one-off and repeat cleaning requirements.</p><p>Send the full postcode and preferred date so travel, access and the appropriate cleaning team can be confirmed before quotation.</p><ul className="check-list"><li><Check /> Residential and commercial enquiries considered</li><li><Check /> Location and availability checked before booking</li><li><Check /> Property type, access and timing reviewed together</li></ul></div><figure className="coverage-visual"><ResponsiveImage src="/images/areas/nationwide-coverage.jpeg" alt="Coreserve team loading professional cleaning equipment for service" width={1312} height={816} sizes="(max-width: 980px) calc(100vw - 48px), 46vw" /><figcaption><MapPin /><span><strong>Wider UK coverage</strong>Subject to location and availability.</span></figcaption></figure></div></section>
      <section className="section section--pale"><div className="shell"><div className="section-heading split-heading"><div><span className="eyebrow">Priority service areas</span><h2>Regional coverage with wider reach</h2></div><p>These are key areas for current enquiries. Cleaning requests from other UK locations are also welcome and assessed by postcode and availability.</p></div><div className="region-grid">{priorityAreas.map((area, index) => <article key={area}><span>{String(index + 1).padStart(2, "0")}</span><MapPin /><h3>{area}</h3><p>Residential, commercial and property-management cleaning enquiries.</p></article>)}</div></div></section>
      <section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">How we confirm coverage</span><h2>Three details are usually enough to begin</h2></div><ol className="stage-grid stage-grid--three"><li><span>01</span><h3>Postcode</h3><p>So location, travel and team availability can be assessed.</p></li><li><span>02</span><h3>Cleaning services</h3><p>Select every cleaning type required at the property.</p></li><li><span>03</span><h3>Required date</h3><p>We confirm timing and availability before the work is booked.</p></li></ol></div></section>
      <section className="cta-band"><div className="shell cta-band__inner"><div><h2>Have the property postcode?</h2></div><Link className="button button--primary" href="/contact">Check availability <ArrowRight /></Link></div></section>
    </main>
  );
}
