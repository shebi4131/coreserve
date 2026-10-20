import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Info, Phone } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning, EPC, Gas & Electrical Safety Services",
  description:
    "Explore Coreserve's cleaning, EPC assessment, landlord gas safety and EICR coordination services for properties in Preston and across England.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Property services from Coreserve",
    description: "Detailed cleaning and property compliance support for homes, landlords and businesses.",
    url: "/services",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Coreserve Facilities Group" }],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Coreserve Facilities Group services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: { "@type": "Service", name: service.title, description: service.summary, provider: { "@type": "LocalBusiness", name: siteConfig.name } },
  })),
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="page-hero">
        <div className="shell page-hero__grid">
          <div>
            <h1>Services built around<br />the way properties work.</h1>
          </div>
          <div>
            <p>Clear scope, sensible scheduling and the right professional for the work. Explore what each service covers and what we need to arrange it.</p>
            <Link className="button button--primary" href="/contact">Discuss your property <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      <nav className="service-jump" aria-label="Jump to a service">
        <div className="shell service-jump__inner">
          <span>Jump to</span>
          {services.map((service) => <a key={service.slug} href={`#${service.slug}`}>{service.shortTitle}</a>)}
        </div>
      </nav>

      <section className="service-details">
        <div className="shell">
          {services.map((service, index) => (
            <article className="service-detail" id={service.slug} key={service.slug}>
              <div className="service-detail__summary">
                <span className="service-detail__number">0{index + 1}</span>
                <ServiceMark icon={service.icon} />
                <h2>{service.title}</h2>
                <p className="service-detail__audience">For {service.audience.toLowerCase()}</p>
                <p>{service.intro}</p>
                <Link className="button button--dark" href="/contact">Request this service <ArrowUpRight size={18} /></Link>
              </div>
              <div className="service-detail__body">
                <div>
                  <h3>What the service can include</h3>
                  <ul className="detail-list">{service.includes.map((item) => <li key={item}><Check size={17} /> {item}</li>)}</ul>
                </div>
                <div className="arrangement-note">
                  <h3>What we need from you</h3>
                  <p>{service.process}</p>
                </div>
                {"source" in service && service.source ? (
                  <a className="official-source" href={service.source.href} target="_blank" rel="noreferrer"><Info size={17} /> {service.source.label} <ArrowUpRight size={15} /></a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="expect-section">
        <div className="shell expect-section__grid">
          <div><h2>No vague handovers.</h2></div>
          <div className="expect-list">
            <div><span>Scope</span><h3>A clear understanding of the job</h3><p>We confirm the property, service and priorities before arranging the work.</p></div>
            <div><span>Access</span><h3>Appointments planned around people</h3><p>Landlord, agent, tenant or site-contact details are agreed in advance.</p></div>
            <div><span>Follow-up</span><h3>Practical next steps after the visit</h3><p>Where a report identifies further work, we help make the required action understandable.</p></div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><h2>Start with the property.</h2></div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Tell us what you need <ArrowRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.phoneHref}><Phone size={18} /> Call us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
