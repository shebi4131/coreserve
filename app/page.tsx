import type { Metadata } from "next";
import Link from "next/link";
import { Armchair, ArrowRight, ArrowUpRight, BedDouble, Building2, Check, ClipboardCheck, Hammer, House, KeyRound, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { TrustpilotReviewLink } from "@/components/TrustpilotReviewLink";
import { TrustStrip } from "@/components/TrustStrip";
import { cleaningTypes } from "@/lib/services";
import { canonicalUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Cleaning Services for Homes and Businesses",
  description: "Domestic, end-of-tenancy, deep and office cleaning with itemised quotes and completion photos. Own teams in Lancashire, Manchester, Merseyside & London.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/images/home/home-hero.jpeg", width: 1312, height: 816, alt: "Coreserve cleaning team preparing a UK property" }],
  },
};

const homeServices = [
  { title: "Domestic Cleaning", summary: "Keep your home clean, comfortable and presentable with regular or one-off cleaning tailored to your household.", href: "/services/domestic-cleaning", icon: House },
  { title: "Airbnb & Housekeeping", summary: "Keep Airbnb, B&B and short let properties guest-ready with changeovers worked through an agreed room checklist.", href: "/services/bnb-housekeeping", icon: BedDouble },
  { title: "Deep & Move Cleaning", summary: "Give your property a thorough clean, focusing on kitchens, bathrooms, floors, surfaces and other areas that need extra attention.", href: "/services/deep-move-cleaning", icon: Sparkles },
  { title: "End-of-Tenancy Cleaning", summary: "Prepare rental properties for inspection, handover or new occupants with a detailed cleaning service based on an agreed checklist.", href: "/services/end-of-tenancy-cleaning", icon: KeyRound },
  { title: "Commercial and Office Cleaning", summary: "Maintain clean, presentable workplaces with cleaning schedules designed around your business and operating hours.", href: "/services/commercial-office-cleaning", icon: Building2 },
  { title: "Carpet and Upholstery Cleaning", summary: "Refresh carpets, rugs and upholstered furniture with suitable cleaning methods selected for the material and its condition.", href: "/services/carpet-upholstery-cleaning", icon: Armchair },
  { title: "After-Builders Cleaning", summary: "Remove agreed construction dust and residue after renovation or building work, preparing the property for occupation.", href: "/services/after-builders-cleaning", icon: Hammer },
] as const;

const businessId = `${canonicalUrl()}#business`;
const websiteId = `${canonicalUrl()}#website`;

const entitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: canonicalUrl(),
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      inLanguage: "en-GB",
      publisher: { "@id": businessId },
    },
    {
      "@type": "LocalBusiness",
      "@id": businessId,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      alternateName: siteConfig.shortName,
      description: siteConfig.description,
      url: canonicalUrl(),
      logo: {
        "@type": "ImageObject",
        url: canonicalUrl("/brand/coreserve-logo.png"),
      },
      image: canonicalUrl("/images/home/home-hero.jpeg"),
      telephone: siteConfig.phoneInternational,
      sameAs: [
        siteConfig.maps.businessProfile,
        siteConfig.social.instagram,
        siteConfig.social.facebook,
        siteConfig.social.trustpilot,
      ],
      hasMap: siteConfig.maps.businessProfile,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        postalCode: siteConfig.address.postcode,
        addressCountry: siteConfig.address.country,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneInternational,
        contactType: "customer service",
        areaServed: "GB",
        availableLanguage: "English",
      },
      areaServed: ["Lancashire", "Greater Manchester", "Merseyside", "Greater London", "United Kingdom"],
      knowsAbout: cleaningTypes,
    },
  ],
};

export default function HomePage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entitySchema).replace(/</g, "\\u003c") }} />

      <section className="hero">
        <ResponsiveImage src="/images/home/home-hero.jpeg" alt="Coreserve professional cleaning team working in a modern home" width={1312} height={816} className="hero__media" sizes="100vw" priority />
        <div className="shell hero__grid">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light"><i aria-hidden="true" /> Burnley-based • Lancashire, Manchester, Merseyside &amp; London</span>
            <h1>Professional cleaning services <em>for homes and businesses.</em></h1>
            <p className="hero__lead">Domestic, commercial, deep and end-of-tenancy cleaning by our own teams. You get an itemised quote before booking, and photos plus a written summary the same day the job is done.</p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/contact">Get a free quote <ArrowUpRight size={18} /></Link>
              <Link className="button button--ghost" href="/services">Explore our cleaning services <ArrowRight size={18} /></Link>
            </div>
            <div className="hero__proof" aria-label="Reasons to choose Coreserve">
              <span><Check size={17} /> Itemised quotes</span>
              <span><ShieldCheck size={17} /> Room-by-room checklist</span>
              <span><MapPin size={17} /> Own teams in 4 regions</span>
            </div>
          </div>
        </div>
        <nav className="hero-services" aria-label="Popular cleaning services">
          <div className="shell hero-services__grid">
            <div className="hero-services__intro"><span>Care for every space</span><strong>Popular services</strong></div>
            {homeServices.slice(0, 4).map((service) => {
              const Icon = service.icon;
              return <Link href={service.href} key={service.title}><Icon size={22} /><span>{service.title}</span><ArrowUpRight size={17} /></Link>;
            })}
          </div>
        </nav>
      </section>

      <TrustStrip />

      <TrustpilotReviewLink />

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
            <h2>What you get with every booking.</h2>
            <ul className="check-list">
              <li><Check /> An itemised quote listing every room, task and extra before you book</li>
              <li><Check /> Extras such as ovens, carpets and fridges priced separately — no surprises</li>
              <li><Check /> Every job signed off against a room-by-room checklist</li>
              <li><Check /> Completion photos and a written job summary sent the same day</li>
              <li><Check /> One-off visits or recurring weekly and fortnightly cleaning</li>
              <li><Check /> Our own teams across Lancashire, Greater Manchester, Merseyside and London</li>
            </ul>
            <Link className="button button--dark" href="/about">More about Coreserve <ArrowRight size={18} /></Link>
          </div>
          <figure className="editorial-image">
            <ResponsiveImage src="/images/home/handover-detail.jpeg" alt="Coreserve team member checking completed cleaning requirements" width={1264} height={848} sizes="(max-width: 720px) calc(100vw - 32px), 50vw" />
            <figcaption><ClipboardCheck size={20} /><span><strong>Checklist sign-off</strong>Each room checked, then photographed on completion.</span></figcaption>
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
            <li><span>04</span><div><h3>Clean, check and report</h3><p>The team works through the checklist, then sends you photos and a written summary the same day.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell coverage">
          <div>
            <span className="eyebrow">Service area</span>
            <h2>Burnley-based.<br />Four regions, our own teams.</h2>
            <p>{siteConfig.coverage.sentence}</p>
            <p>Check your postcode or send it with your quote request and we will confirm the date we can attend.</p>
            <Link className="text-link" href="/areas-we-cover">See the areas we cover <ArrowRight size={18} /></Link>
          </div>
          <aside className="coverage__panel">
            <MapPin size={26} />
            <strong>Based in Burnley, Lancashire</strong>
            <p>124 Colne Road, Burnley, BB10 1LP</p>
            <hr />
            <h3>Our own teams cover</h3>
            <p>Lancashire, Greater Manchester, Merseyside and Greater London</p>
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
