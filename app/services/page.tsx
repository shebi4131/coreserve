import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { cleaningServices, cleaningTypes, services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nationwide UK Cleaning Services",
  description: "Explore nationwide end-of-tenancy, deep, domestic, commercial, carpet, upholstery, appliance and specialist cleaning from Coreserve.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Coreserve cleaning and property services",
    description: "Detailed, clearly scoped services for homes, landlords, agents and businesses.",
    url: "/services",
    images: [{ url: "/images/services/services-hero.jpeg", width: 1376, height: 768, alt: "Coreserve cleaning team and equipment ready for service" }],
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Coreserve Facilities Group services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteConfig.siteUrl}/services/${service.slug}`,
    name: service.title,
  })),
};

function ServiceRows({ items }: { items: typeof services }) {
  return (
    <div className="service-list">
      {items.map((service, index) => (
        <Link className="service-list__item" href={`/services/${service.slug}`} key={service.slug}>
          <span className="service-list__number">{String(index + 1).padStart(2, "0")}</span>
          <ServiceMark icon={service.icon} />
          <div>
            <span className="eyebrow eyebrow--compact">{service.category}</span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
          </div>
          <span className="service-list__arrow" aria-hidden="true"><ArrowUpRight /></span>
        </Link>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c") }} />
      <section className="page-hero page-hero--media">
        <ResponsiveImage src="/images/services/services-hero.jpeg" alt="Coreserve cleaning team preparing professional equipment outside a managed property" width={1376} height={768} className="page-hero__media" sizes="100vw" priority />
        <div className="shell page-hero__grid">
          <div>
            <span className="eyebrow eyebrow--light">Services</span>
            <h1>Clear scope before<br />the work begins.</h1>
          </div>
          <div>
            <p>From detailed property changeovers to regular, commercial and specialist cleaning, every enquiry starts with the property, postcode, timing and outcome you need.</p>
            <Link className="button button--primary" href="/contact">Request an itemised quote <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Cleaning</span><h2>Cleaning shaped around the handover, space and schedule.</h2></div>
            <p>We agree the task list, access and selected extras before the visit. That keeps the quotation and expected result understandable.</p>
          </div>
          <ServiceRows items={cleaningServices} />
        </div>
      </section>

      <section className="section">
        <div className="shell catalog-layout">
          <div className="catalog-layout__intro">
            <ResponsiveImage src="/images/services/specialist-cleaning.jpeg" alt="Coreserve operative carrying out specialist carpet and upholstery cleaning" width={1312} height={816} className="catalog-layout__image" sizes="(max-width: 980px) calc(100vw - 48px), 42vw" />
            <div className="section-heading">
              <span className="eyebrow">More ways we can help</span>
              <h2>One enquiry for every cleaning requirement.</h2>
              <p>Select multiple services in the quotation form. Availability is checked from the postcode, property details and required date.</p>
            </div>
          </div>
          <ul className="service-catalog" aria-label="Available cleaning services">
            {cleaningTypes.map((service) => <li key={service}><Check size={17} /><span>{service}</span></li>)}
          </ul>
          <div className="service-catalog__action"><Link className="button button--dark" href="/contact">Select services and request a quote <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="process-section section">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <span className="eyebrow eyebrow--light">What to expect</span>
            <h2>A practical route from enquiry to completion.</h2>
          </div>
          <ol className="process-line">
            <li><span>01</span><div><h3>Share the details</h3><p>Property, postcode, service, size, access and preferred date.</p></div></li>
            <li><span>02</span><div><h3>Confirm the scope</h3><p>We clarify inclusions, exclusions, extras and any specialist requirements.</p></div></li>
            <li><span>03</span><div><h3>Arrange the visit</h3><p>The date, arrival window and responsible contacts are confirmed.</p></div></li>
            <li><span>04</span><div><h3>Complete and follow up</h3><p>The agreed work is checked and relevant next steps are communicated.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><h2>Start with the property details.</h2><p>We’ll help identify the right scope.</p></div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Request a quote <ArrowRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.phoneHref}><Phone size={18} /> Call {siteConfig.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
