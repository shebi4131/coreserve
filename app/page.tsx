import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning & Property Compliance Services in Preston",
  description:
    "Cleaning, EPC assessments, gas safety and electrical safety coordination for landlords, businesses and homeowners. Based in Preston, serving clients across England.",
  alternates: { canonical: "/" },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.siteUrl,
  telephone: "+447728344412",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    postalCode: siteConfig.address.postcode,
    addressCountry: siteConfig.address.country,
  },
  areaServed: ["Preston", "Lancashire", "England"],
  knowsAbout: services.map((service) => service.title),
};

export default function HomePage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <h1>Property care,<br /><em>properly coordinated.</em></h1>
            <p className="hero__lead">Cleaning and property compliance support for landlords, letting agents, businesses and homeowners in Preston and across England. One clear point of contact for cleaning, EPCs and essential property safety arrangements.</p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/contact">Request a free quote <ArrowUpRight size={18} /></Link>
              <Link className="button button--ghost" href="/services">Explore services <ArrowRight size={18} /></Link>
            </div>
            <div className="hero__assurance"><ShieldCheck size={20} /> Clear scope, straightforward pricing and qualified specialists for regulated work.</div>
          </div>
          <div className="service-board" aria-label="Coreserve service overview">
            <div className="service-board__head">
              <span>Property service plan</span>
              <span className="live-status"><i /> Ready to arrange</span>
            </div>
            <div className="service-board__list">
              {services.map((service, index) => (
                <div className="service-board__row" key={service.slug}>
                  <span className="service-board__index">0{index + 1}</span>
                  <service.icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  <strong>{service.shortTitle}</strong>
                  <Check size={18} aria-hidden="true" />
                </div>
              ))}
            </div>
            <div className="service-board__foot">
              <span><MapPin size={16} /> Preston, Lancashire</span>
              <Link href="/contact">Check availability <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="confidence-strip" aria-label="Service qualities">
        <div className="shell confidence-strip__grid">
          <span><Check /> Clear, practical communication</span>
          <span><ClipboardCheck /> Residential &amp; commercial</span>
          <span><MapPin /> Preston-based, England-wide reach</span>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><h2>Four essentials.<br />One dependable contact.</h2></div>
            <p>From routine cleaning to required property checks, we help keep buildings clean, safe and ready for the people who use them.</p>
          </div>
          <div className="service-list">
            {services.map((service, index) => (
              <Link className="service-list__item" href={`/services#${service.slug}`} aria-label={`Learn more about ${service.title}`} key={service.slug}>
                <span className="service-list__number">0{index + 1}</span>
                <ServiceMark icon={service.icon} />
                <div><h3>{service.title}</h3><p>{service.summary}</p></div>
                <span className="service-list__arrow" aria-hidden="true"><ArrowUpRight /></span>
              </Link>
            ))}
          </div>
          <div className="section-action"><Link className="text-link" href="/services">See exactly what each service includes <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="shell story-grid">
          <div className="story-panel" aria-hidden="true">
            <div className="story-panel__orbit"><span>Cleaning</span><span>EPC</span><span>Gas</span><span>EICR</span></div>
            <div className="story-panel__core"><ShieldCheck /><strong>One point<br />of contact</strong></div>
          </div>
          <div className="story-copy">
            <h2>Less chasing.<br />More peace of mind.</h2>
            <p>Managing a property can mean juggling different contractors, appointments and requirements. Coreserve Facilities Group keeps the conversation together with a straightforward, service-led approach.</p>
            <p>We listen to what the property needs, agree the scope clearly and coordinate the right person for the job. Regulated inspections are arranged with appropriately qualified professionals.</p>
            <ul className="check-list">
              <li><Check /> A clear contact from enquiry to completion</li>
              <li><Check /> Services shaped around the property and schedule</li>
              <li><Check /> Practical support for one property or a portfolio</li>
              <li><Check /> Clear follow-up when an inspection identifies action</li>
            </ul>
            <Link className="button button--dark" href="/contact">Talk to our team <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <h2>From first message to finished service.</h2>
            <p>Every job starts with the details. That keeps the quote, appointment and expected outcome clear.</p>
          </div>
          <ol className="process-line">
            <li><span>01</span><div><h3>Tell us what you need</h3><p>Share the property type, location, service and important dates.</p></div></li>
            <li><span>02</span><div><h3>Agree the scope</h3><p>We clarify access, priorities and the appropriate next step.</p></div></li>
            <li><span>03</span><div><h3>Confirm the visit</h3><p>You receive clear appointment arrangements before anything is booked.</p></div></li>
            <li><span>04</span><div><h3>Complete and follow up</h3><p>We keep communication practical and explain any further action.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell coverage">
          <div>
            <h2>Local knowledge.<br />Wider reach.</h2>
            <p>Based in Preston, Lancashire, Coreserve supports residential and commercial clients locally and at locations across England, subject to availability.</p>
            <p>Send the property postcode and the service required. We will confirm coverage before anything is arranged.</p>
            <Link className="text-link" href="/contact">Check your postcode <ArrowRight size={18} /></Link>
          </div>
          <aside className="coverage__panel">
            <MapPin size={26} />
            <strong>Preston, Lancashire</strong>
            <p>Our base for coordinating property services for local clients and customers further afield.</p>
            <hr />
            <h3>Who we support</h3>
            <p>Landlords · Letting agents · Homeowners · Offices · Commercial premises · Property managers</p>
          </aside>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><h2>Tell us about the property.</h2></div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Request a quote <ArrowUpRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.phoneHref}><Phone size={18} /> {siteConfig.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
