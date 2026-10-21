import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { cleaningServices, complianceServices, services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "End-of-Tenancy Cleaning & Property Services Preston",
  description: "End-of-tenancy and deep cleaning in Preston, plus EPC, gas safety and EICR coordination. Request a clear, itemised quote from Coreserve.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }} />

      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light">Preston-based property services</span>
            <h1>Property handovers,<br /><em>properly prepared.</em></h1>
            <p className="hero__lead">Detailed end-of-tenancy and deep cleaning for tenants, landlords and agents—supported by clearly coordinated EPC, gas and electrical safety services.</p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/contact?service=end-of-tenancy-cleaning">Get a free itemised quote <ArrowUpRight size={18} /></Link>
              <Link className="button button--ghost" href="/services/end-of-tenancy-cleaning">Explore end-of-tenancy cleaning <ArrowRight size={18} /></Link>
            </div>
            <div className="hero__assurance"><ShieldCheck size={20} /> Clear scope, practical communication and qualified specialists for regulated work.</div>
          </div>

          <aside className="quote-preview" aria-label="What an enquiry covers">
            <div className="quote-preview__head"><span>Quote preparation</span><span className="live-status"><i /> Start with the details</span></div>
            <div className="quote-preview__body">
              <div><span>01</span><p>Property &amp; postcode</p><Check /></div>
              <div><span>02</span><p>Bedrooms &amp; bathrooms</p><Check /></div>
              <div><span>03</span><p>Condition &amp; selected extras</p><Check /></div>
              <div><span>04</span><p>Date, access &amp; parking</p><Check /></div>
            </div>
            <div className="quote-preview__foot"><ClipboardCheck /><div><strong>Itemised before booking</strong><small>Inclusions and exclusions confirmed clearly.</small></div></div>
          </aside>
        </div>
      </section>

      <section className="confidence-strip" aria-label="Service qualities">
        <div className="shell confidence-strip__grid">
          <span><Check /> Scope agreed in advance</span>
          <span><ClipboardCheck /> Checklist-led cleaning</span>
          <span><MapPin /> Preston-based service</span>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Cleaning services</span><h2>Built around the condition of the property—not a vague promise.</h2></div>
            <p>We collect the details that affect the work, agree the task list and make optional extras visible before anything is booked.</p>
          </div>
          <div className="featured-service-grid">
            {cleaningServices.map((service, index) => (
              <Link href={`/services/${service.slug}`} key={service.slug} className={index === 0 ? "featured-service featured-service--primary" : "featured-service"}>
                <div className="featured-service__top"><span>{String(index + 1).padStart(2, "0")}</span><ServiceMark icon={service.icon} /></div>
                <span className="eyebrow eyebrow--compact">{service.category}</span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <span className="text-link">View full scope <ArrowUpRight size={17} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell service-content-grid service-content-grid--balanced">
          <div>
            <span className="eyebrow">End-of-tenancy focus</span>
            <h2>Room-by-room detail for a smoother handover.</h2>
            <p className="lead-copy">Kitchen grease, bathroom scale, internal cupboards, appliances, floors and windows can all change the work required. Our quotation process separates the core clean from selected extras, so expectations are visible.</p>
            <ul className="check-list">
              <li><Check /> Property size, condition and occupancy reviewed</li>
              <li><Check /> Appliances and specialist items confirmed separately</li>
              <li><Check /> Access, utilities and parking agreed before arrival</li>
              <li><Check /> Final check against the accepted task list</li>
            </ul>
            <Link className="button button--dark" href="/end-of-tenancy-cleaning-checklist">View the cleaning checklist <ArrowRight size={18} /></Link>
          </div>
          <div className="room-scope" aria-label="Typical room scope">
            <div><span>Kitchen</span><strong>Degrease · wipe · descale · floors</strong></div>
            <div><span>Bathrooms</span><strong>Sanitaryware · tiles · mirrors · floors</strong></div>
            <div><span>Living areas</span><strong>Surfaces · skirting · doors · flooring</strong></div>
            <div><span>Final review</span><strong>Checklist · variations · handover</strong></div>
          </div>
        </div>
      </section>

      <section className="process-section section">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <span className="eyebrow eyebrow--light">How booking works</span>
            <h2>From first message to completed service.</h2>
            <p>Every stage keeps the property, responsible contacts and agreed work together.</p>
          </div>
          <ol className="process-line">
            <li><span>01</span><div><h3>Enquiry received</h3><p>Share the postcode, service, property details and preferred date.</p></div></li>
            <li><span>02</span><div><h3>Scope assessed</h3><p>We clarify condition, access, appliances, selected extras and hazards.</p></div></li>
            <li><span>03</span><div><h3>Quote &amp; booking</h3><p>The itemised scope, exclusions, timing and arrangements are confirmed.</p></div></li>
            <li><span>04</span><div><h3>Service &amp; follow-up</h3><p>The agreed checklist is completed, quality checked and followed up.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Property compliance</span><h2>Essential inspections, one coordinated conversation.</h2></div>
            <p>Regulated work is carried out by appropriately qualified professionals. Coreserve helps organise the property details, access, appointment and next steps.</p>
          </div>
          <div className="compliance-grid">
            {complianceServices.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.slug}><ServiceMark icon={service.icon} /><h3>{service.title}</h3><p>{service.summary}</p><span>Explore service <ArrowRight /></span></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell coverage">
          <div>
            <span className="eyebrow">Service area</span>
            <h2>Preston-based.<br />Coverage confirmed properly.</h2>
            <p>Coreserve supports residential and commercial clients from Preston, Lancashire. Availability beyond the local area depends on the service, property and required date.</p>
            <p>Send the property postcode with your enquiry and we will confirm coverage before anything is arranged.</p>
            <Link className="text-link" href="/areas-we-cover">How coverage works <ArrowRight size={18} /></Link>
          </div>
          <aside className="coverage__panel">
            <MapPin size={26} />
            <strong>Preston, Lancashire</strong>
            <p>{siteConfig.address.street}, {siteConfig.address.postcode}</p>
            <hr />
            <h3>Who we support</h3>
            <p>Tenants · Landlords · Letting agents · Homeowners · Offices · Property managers</p>
          </aside>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><span className="eyebrow eyebrow--light">Ready when you are</span><h2>Tell us about the property.</h2></div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Request a quote <ArrowUpRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.phoneHref}><Phone size={18} /> {siteConfig.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
