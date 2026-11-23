import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, MapPin, Navigation, Phone, Star } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";
import { SocialIcon } from "@/components/SocialIcon";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Free Cleaning Quote",
  description:
    "Request a free, itemised quote for domestic, commercial, deep or end-of-tenancy cleaning from Coreserve Facilities Group, covering the UK.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Request a free quote from Coreserve",
    description: "Tell us about the property, service and timescale.",
    url: "/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Coreserve Facilities Group" }],
  },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <section className="contact-hero">
        <div className="shell contact-hero__grid">
          <div className="contact-intro">
            <span className="eyebrow">Request Free Quote</span>
            <h1>Tell us what<br />needs cleaning.</h1>
            <p>Choose the services, then add the postcode, property and date. We reply with an itemised quote{siteConfig.quoteResponseTime ? ` ${siteConfig.quoteResponseTime}` : ""}. Nothing is booked until you accept it.</p>
            <div className="contact-methods">
              <a href={siteConfig.phoneHref}><span><Phone /></span><div><small>Call us</small><strong>{siteConfig.phoneDisplay}</strong></div></a>
              <a href={siteConfig.social.whatsapp} target="_blank" rel="noreferrer"><span><SocialIcon platform="whatsapp" /></span><div><small>WhatsApp</small><strong>Start a WhatsApp chat</strong></div></a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer"><span><SocialIcon platform="instagram" /></span><div><small>Instagram</small><strong>Follow @coreserve_group</strong></div></a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer"><span><SocialIcon platform="facebook" /></span><div><small>Facebook</small><strong>Visit our Facebook page</strong></div></a>
              <div><span><MapPin /></span><div><small>Our base</small><strong>{siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.postcode}</strong></div></div>
              {siteConfig.businessHours ? <div><span><Clock3 /></span><div><small>Opening hours</small><strong>{siteConfig.businessHours}</strong></div></div> : null}
              <div><span><MapPin /></span><div><small>Coverage</small><strong>Across the UK</strong></div></div>
              <a href={siteConfig.maps.reviews} target="_blank" rel="noreferrer"><span><Star /></span><div><small>Google reviews</small><strong>Read or leave a Google review</strong></div></a>
            </div>
            <p className="contact-privacy-note">We only use your details to reply to this enquiry. See our <Link href="/privacy">privacy notice</Link>.</p>
          </div>
          <QuoteForm />
        </div>
      </section>

      <section className="contact-location" aria-labelledby="contact-location-title">
        <div className="shell contact-location__grid">
          <div className="contact-location__copy">
            <span className="eyebrow eyebrow--light">Our office</span>
            <h2 id="contact-location-title">Find Coreserve.</h2>
            <p>We clean properties across the UK, with our own teams in Lancashire, Greater Manchester, Merseyside and London.</p>
            <address><MapPin aria-hidden="true" /><span><strong>Coreserve Facilities Group</strong>{siteConfig.address.street}<br />{siteConfig.address.locality}, {siteConfig.address.postcode}</span></address>
            <a className="button button--primary" href={siteConfig.maps.directions} target="_blank" rel="noreferrer">Get directions <Navigation size={18} /></a>
          </div>
          <div className="contact-map">
            <iframe
              src={siteConfig.maps.embed}
              title="Map showing Coreserve Facilities Group at 124 Colne Road, Burnley"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="section contact-expectations">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Better information, clearer quote</span><h2>A few details help us<br />respond properly.</h2></div>
            <p>You do not need to know every technical detail. Property size, condition, preferred date, access and selected extras give us a useful starting point.</p>
          </div>
          <div className="contact-tips">
            <article><span aria-hidden="true">01</span><div><h3>What and where</h3><p>Tell us whether it is a home, rental, office, communal area or another type of premises.</p></div></article>
            <article><span aria-hidden="true">02</span><div><h3>Condition and extras</h3><p>Mention appliances, heavy build-up, specialist treatment or anything that may change the time or equipment required.</p></div></article>
            <article><span aria-hidden="true">03</span><div><h3>Date and access</h3><p>Tell us the handover deadline, parking situation and who can provide access.</p></div></article>
          </div>
        </div>
      </section>
    </main>
  );
}
