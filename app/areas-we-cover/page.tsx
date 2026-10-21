import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas We Cover | Preston Property Services",
  description: "Coreserve is based in Preston, Lancashire. Check availability for cleaning and coordinated property services using your property postcode.",
  alternates: { canonical: "/areas-we-cover" },
};

export default function AreasPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="shell page-hero__grid"><div><span className="eyebrow eyebrow--light">Areas we cover</span><h1>Preston-based.<br />Coverage checked properly.</h1></div><div><p>Availability varies by service, date and property. Send us the postcode and required work, and we will confirm coverage before quoting.</p><Link className="button button--primary" href="/contact">Check your postcode <ArrowRight /></Link></div></div></section>
      <section className="section"><div className="shell coverage coverage--top"><div><span className="eyebrow">Our base</span><h2>Preston, Lancashire</h2><p>Coreserve coordinates services from {siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.postcode}. Local cleaning requests are assessed from the property details, access and required date.</p><p>Some coordinated property services may be available further afield. We describe that as availability—not a guaranteed nationwide response.</p><ul className="check-list"><li><Check /> Postcode confirmed before booking</li><li><Check /> Service and date considered together</li><li><Check /> Parking, access and travel requirements discussed</li></ul></div><aside className="map-card"><MapPin /><span>PR2</span><strong>Preston</strong><p>Our operational starting point for enquiries and service coordination.</p></aside></div></section>
      <section className="section section--pale"><div className="shell"><div className="section-heading"><span className="eyebrow">How we confirm coverage</span><h2>Three details are usually enough to begin.</h2></div><ol className="stage-grid stage-grid--three"><li><span>01</span><h3>Postcode</h3><p>So we can assess location, travel and local availability.</p></li><li><span>02</span><h3>Service</h3><p>Cleaning and regulated appointments have different scheduling needs.</p></li><li><span>03</span><h3>Required date</h3><p>We confirm whether the necessary team or specialist is available.</p></li></ol></div></section>
      <section className="cta-band"><div className="shell cta-band__inner"><div><h2>Have the property postcode?</h2></div><Link className="button button--primary" href="/contact">Check availability <ArrowRight /></Link></div></section>
    </main>
  );
}
