import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { cleaningServices, cleaningTypes } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nationwide UK Cleaning Services",
  description: "Nationwide end-of-tenancy, deep, domestic and commercial cleaning for residential, business and property-management clients.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/images/home/home-hero.jpeg", width: 1312, height: 816, alt: "Coreserve cleaning team preparing a UK property" }],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.siteUrl,
  telephone: "+443301119592",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    postalCode: siteConfig.address.postcode,
    addressCountry: siteConfig.address.country,
  },
  areaServed: ["United Kingdom", "Greater London", "Greater Manchester", "Merseyside", "Lancashire"],
  knowsAbout: cleaningTypes,
};

export default function HomePage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }} />

      <section className="hero">
        <ResponsiveImage src="/images/home/home-hero.jpeg" alt="Coreserve cleaning team preparing a kitchen for property handover" width={1312} height={816} className="hero__media" sizes="100vw" priority />
        <div className="shell hero__grid">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light">Based in North-West</span>
            <h1>Property handovers,<br /><em>properly prepared.</em></h1>
            <p className="hero__lead">Detailed end-of-tenancy, deep, domestic and commercial cleaning for tenants, landlords, agents, businesses and property managers across the UK.</p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/contact?service=end-of-tenancy-cleaning">Get a free itemised quote <ArrowUpRight size={18} /></Link>
              <Link className="button button--ghost" href="/services/end-of-tenancy-cleaning">Explore end-of-tenancy cleaning <ArrowRight size={18} /></Link>
            </div>
            <div className="hero__assurance"><ShieldCheck size={20} /> Clear scope, practical communication and cleaning requirements agreed before booking.</div>
          </div>

        </div>
      </section>

      <section className="confidence-strip" aria-label="Service qualities">
        <div className="shell confidence-strip__grid">
          <span><Check /> Scope agreed in advance</span>
          <span><ClipboardCheck /> Checklist-led cleaning</span>
          <span><MapPin /> Nationwide UK coverage</span>
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
          <figure className="editorial-image">
            <ResponsiveImage src="/images/home/handover-detail.jpeg" alt="Coreserve team member completing a room-by-room cleaning checklist" width={1264} height={848} sizes="(max-width: 720px) calc(100vw - 32px), 50vw" />
            <figcaption><ClipboardCheck size={20} /><span><strong>Checklist-led handover</strong>Every agreed area reviewed before completion.</span></figcaption>
          </figure>
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

      <section className="section">
        <div className="shell coverage">
          <div>
            <span className="eyebrow">Service area</span>
            <h2>Based in North-West<br />Nationwide coverage</h2>
            <p>Coreserve supports residential, commercial and property-management clients across the United Kingdom.</p>
            <p>Send the property postcode with your enquiry so we can confirm the right team, travel arrangements and required date before booking.</p>
            <Link className="text-link" href="/areas-we-cover">How coverage works <ArrowRight size={18} /></Link>
          </div>
          <aside className="coverage__panel">
            <MapPin size={26} />
            <strong>Nationwide UK</strong>
            <p>North-West base with postcode-led scheduling</p>
            <hr />
            <h3>Priority coverage</h3>
            <p>Greater London, Greater Manchester, Merseyside and Lancashire</p>
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
