import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Check, Home, MapPin, Sparkles } from "lucide-react";
import { PostcodeChecker } from "@/components/PostcodeChecker";
import { serviceAreas } from "@/lib/areas";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning Service Areas Across the UK",
  description: "Explore Coreserve cleaning coverage in Burnley, Manchester, Liverpool and London. Check your postcode and request residential or commercial cleaning.",
  alternates: { canonical: "/areas-we-cover" },
  openGraph: {
    title: "Cleaning service areas | Coreserve Facilities Group",
    description: "Check cleaning coverage across four priority UK service areas and nearby locations.",
    url: "/areas-we-cover",
    images: [{ url: "/images/areas/nationwide-coverage.jpeg", width: 1312, height: 816, alt: "Coreserve professional cleaning coverage across UK service areas" }],
  },
};

export default function AreasPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Coreserve cleaning service areas",
    itemListElement: serviceAreas.map((area, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: area.name,
      url: canonicalUrl(`/areas-we-cover/${area.slug}`),
    })),
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="areas-hero">
        <div className="areas-hero__glow areas-hero__glow--one" />
        <div className="areas-hero__glow areas-hero__glow--two" />
        <div className="shell areas-hero__grid">
          <div className="areas-hero__copy">
            <nav className="area-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Areas we cover</span></nav>
            <span className="eyebrow eyebrow--light">Areas we cover</span>
            <h1>Professional cleaning, closer to your property.</h1>
            <p>Explore our four priority service areas and the nearby locations we currently assess. Every booking is confirmed using the full postcode, property details and team availability.</p>
            <div className="area-proof-row">
              <span><Home size={18} /> Residential</span>
              <span><Building2 size={18} /> Commercial</span>
              <span><Sparkles size={18} /> Specialist cleaning</span>
            </div>
          </div>
          <PostcodeChecker />
        </div>
      </section>
      <section className="section areas-directory">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Priority service areas</span><h2>Choose your nearest area.</h2></div>
            <p>Each page includes nearby locations, postcode districts, available cleaning services and a quote form prepared for that area.</p>
          </div>
          <div className="area-hub-grid">
            {serviceAreas.map((area, index) => (
              <article className="area-hub-card" key={area.slug}>
                <div className="area-hub-card__top"><span>{String(index + 1).padStart(2, "0")}</span><MapPin size={23} /></div>
                <span className="area-hub-card__region">{area.region}</span>
                <h2>{area.name}</h2>
                <p>{area.summary}</p>
                <div className="area-hub-card__locations" aria-label={`Locations near ${area.name}`}>
                  {area.locations.slice(0, 5).map((location) => (
                    <Link key={location.name} href={{ pathname: `/areas-we-cover/${area.slug}`, query: { location: `${location.name} — ${location.postcode}` } }}>
                      {location.name}<small>{location.postcode}</small>
                    </Link>
                  ))}
                </div>
                <Link className="area-hub-card__link" href={`/areas-we-cover/${area.slug}`}>Explore {area.name} coverage <ArrowUpRight size={18} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--pale area-expectations">
        <div className="shell">
          <div className="section-heading"><span className="eyebrow">One clear process</span><h2>What coverage means in practice.</h2></div>
          <div className="area-expectations__grid">
            <article><span>01</span><Check /><h3>Check the postcode</h3><p>Use the coverage finder or choose the closest city hub and local area.</p></article>
            <article><span>02</span><Check /><h3>Describe the property</h3><p>Add the service, property type, timing, access and any specialist requirements.</p></article>
            <article><span>03</span><Check /><h3>We confirm availability</h3><p>The team reviews travel, scope and scheduling before providing the next step.</p></article>
          </div>
        </div>
      </section>
      <section className="area-wide-cta">
        <div className="shell area-wide-cta__inner">
          <div><span className="eyebrow eyebrow--light">Outside these areas?</span><h2>Wider UK enquiries are still welcome.</h2><p>Send the full postcode and required date. We will tell you honestly whether the work can be coordinated.</p></div>
          <Link className="button button--primary" href="/contact">Request a coverage check <ArrowRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}
