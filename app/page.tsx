import type { Metadata } from "next";
import Link from "next/link";
import { Armchair, ArrowRight, ArrowUpRight, Building2, Check, ClipboardCheck, Hammer, House, KeyRound, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { cleaningTypes } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Cleaning Services for Homes and Businesses",
  description: "Professional domestic, commercial, deep and end-of-tenancy cleaning for homeowners, tenants, landlords, letting agents and businesses.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/images/home/home-hero.jpeg", width: 1312, height: 816, alt: "Coreserve cleaning team preparing a UK property" }],
  },
};

const homeServices = [
  { title: "Domestic Cleaning", summary: "Keep your home clean, comfortable and presentable with regular or one-off cleaning tailored to your household.", href: "/services/domestic-cleaning", icon: House },
  { title: "Deep Cleaning", summary: "Give your property a thorough clean, focusing on kitchens, bathrooms, floors, surfaces and other areas that need extra attention.", href: "/services/deep-move-cleaning", icon: Sparkles },
  { title: "End-of-Tenancy Cleaning", summary: "Prepare rental properties for inspection, handover or new occupants with a detailed cleaning service based on an agreed checklist.", href: "/services/end-of-tenancy-cleaning", icon: KeyRound },
  { title: "Commercial and Office Cleaning", summary: "Maintain clean, presentable workplaces with cleaning schedules designed around your business and operating hours.", href: "/services/commercial-office-cleaning", icon: Building2 },
  { title: "Carpet and Upholstery Cleaning", summary: "Refresh carpets, rugs and upholstered furniture with suitable cleaning methods selected for the material and its condition.", href: "/services/carpet-upholstery-cleaning", icon: Armchair },
  { title: "After-Builders Cleaning", summary: "Remove agreed construction dust and residue after renovation or building work, preparing the property for occupation.", href: "/services/after-builders-cleaning", icon: Hammer },
] as const;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.siteUrl,
  telephone: "+443301119592",
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
  address: { "@type": "PostalAddress", streetAddress: siteConfig.address.street, addressLocality: siteConfig.address.locality, postalCode: siteConfig.address.postcode, addressCountry: siteConfig.address.country },
  areaServed: ["United Kingdom", "Greater London", "Greater Manchester", "Merseyside", "Lancashire"],
  knowsAbout: cleaningTypes,
};

export default function HomePage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }} />

      <section className="hero">
        <ResponsiveImage src="/images/home/home-hero.jpeg" alt="Coreserve professional cleaning team working in a modern home" width={1312} height={816} className="hero__media" sizes="100vw" priority />
        <div className="shell hero__grid">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light">Based in North-West</span>
            <h1>Professional cleaning services for homes, landlords and businesses.</h1>
            <p className="hero__strapline">Reliable cleaning. Clear pricing. A service tailored to your property.</p>
            <p className="hero__lead">Coreserve Facilities Group provides professional domestic and commercial cleaning, deep cleaning and end-of-tenancy cleaning for homeowners, tenants, landlords, letting agents and businesses.</p>
            <p className="hero__support">Whether you need a regular cleaner, a one-off deep clean or a property prepared for its next tenant, we make it easy to arrange the right service for your requirements.</p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/contact">Get a free quote <ArrowUpRight size={18} /></Link>
              <Link className="button button--ghost" href="/services">Explore our cleaning services <ArrowRight size={18} /></Link>
            </div>
            <div className="hero__assurance"><ShieldCheck size={20} /> Based in the North-West, with wider UK coverage subject to location and availability.</div>
          </div>
        </div>
      </section>

      <section className="confidence-strip" aria-label="Service qualities">
        <div className="shell confidence-strip__grid">
          <span><Check /> Clear quotations</span>
          <span><ClipboardCheck /> Cleaning tailored to the property</span>
          <span><MapPin /> Wider UK coverage by availability</span>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Cleaning services</span><h2>Cleaning services to suit your needs.</h2></div>
            <p>Choose the service that fits your property, schedule and priorities. We clarify the work and any optional extras before a booking is confirmed.</p>
          </div>
          <div className="featured-service-grid">
            {homeServices.map((service, index) => (
              <Link href={service.href} key={service.title} className={index === 0 ? "featured-service featured-service--primary" : "featured-service"}>
                <div className="featured-service__top"><span>{String(index + 1).padStart(2, "0")}</span><ServiceMark icon={service.icon} /></div>
                <span className="eyebrow eyebrow--compact">Cleaning</span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <span className="text-link">View service details <ArrowUpRight size={17} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell service-content-grid service-content-grid--balanced">
          <div>
            <span className="eyebrow">Why choose Coreserve?</span>
            <h2>Clear arrangements from quotation to quality check.</h2>
            <ul className="check-list">
              <li><Check /> Clear quotations with the work agreed before booking</li>
              <li><Check /> Cleaning plans tailored to the property and its condition</li>
              <li><Check /> Flexible arrangements for one-off and recurring cleaning</li>
              <li><Check /> Optional extras clearly identified in advance</li>
              <li><Check /> A straightforward enquiry and booking process</li>
              <li><Check /> Quality checks against the agreed cleaning requirements</li>
            </ul>
            <Link className="button button--dark" href="/about">More about Coreserve <ArrowRight size={18} /></Link>
          </div>
          <figure className="editorial-image">
            <ResponsiveImage src="/images/home/handover-detail.jpeg" alt="Coreserve team member checking completed cleaning requirements" width={1264} height={848} sizes="(max-width: 720px) calc(100vw - 32px), 50vw" />
            <figcaption><ClipboardCheck size={20} /><span><strong>Agreed cleaning requirements</strong>Work checked against the confirmed scope.</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="process-section section">
        <div className="shell">
          <div className="section-heading section-heading--light"><span className="eyebrow eyebrow--light">How it works</span><h2>A simple way to arrange your cleaning.</h2></div>
          <ol className="process-line">
            <li><span>01</span><div><h3>Tell us what you need</h3><p>Share your property details, location and preferred date.</p></div></li>
            <li><span>02</span><div><h3>Receive your quotation</h3><p>We assess your requirements and confirm the work, pricing and any additional services.</p></div></li>
            <li><span>03</span><div><h3>Arrange your booking</h3><p>Once you accept the quotation, we agree the date and access arrangements.</p></div></li>
            <li><span>04</span><div><h3>Get the cleaning completed</h3><p>The agreed work is carried out and checked against the confirmed scope.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell coverage">
          <div>
            <span className="eyebrow">Service area</span>
            <h2>Based in North-West<br />Wider UK coverage</h2>
            <p>We coordinate cleaning services across our service areas, with wider UK coverage subject to location and availability.</p>
            <p>Send the property postcode and preferred date so we can confirm the right arrangements before quotation.</p>
            <Link className="text-link" href="/areas-we-cover">How coverage works <ArrowRight size={18} /></Link>
          </div>
          <aside className="coverage__panel">
            <MapPin size={26} />
            <strong>North-West base</strong>
            <p>Wider UK enquiries assessed by postcode and availability</p>
            <hr />
            <h3>Priority coverage</h3>
            <p>Greater London, Greater Manchester, Merseyside and Lancashire</p>
          </aside>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><span className="eyebrow eyebrow--light">Need a cleaner?</span><h2>Request your free, no-obligation cleaning quotation today.</h2><p>Whether you need help around the home, a thorough end-of-tenancy clean or a regular cleaning service for your business, Coreserve is ready to discuss your requirements.</p></div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Get a free quote <ArrowUpRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.phoneHref}><Phone size={18} /> {siteConfig.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
