import type { Metadata } from "next";
import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Request a Property Service Quote",
  description:
    "Contact Coreserve Facilities Group for cleaning, EPC, gas safety or electrical safety services in Preston and across England.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Request a quote from Coreserve",
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
            <h1>Let’s talk about<br />your property.</h1>
            <p>Share the postcode, service and timescale. We’ll review the details and discuss the most useful next step before anything is booked.</p>
            <div className="contact-methods">
              <a href={siteConfig.phoneHref}><span><Phone /></span><div><small>Call us</small><strong>{siteConfig.phoneDisplay}</strong></div></a>
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer"><span><MessageCircle /></span><div><small>Message us</small><strong>Start a WhatsApp chat</strong></div></a>
              <div><span><MapPin /></span><div><small>Our base</small><strong>{siteConfig.address.street}<br />{siteConfig.address.locality}, {siteConfig.address.postcode}</strong></div></div>
              <div><span><Clock3 /></span><div><small>Coverage</small><strong>Preston and locations across England, subject to availability</strong></div></div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section contact-expectations">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><h2>A few details help us<br />respond properly.</h2></div>
            <p>You do not need to know every technical detail. A postcode, property type, preferred date and short description are enough to begin.</p>
          </div>
          <div className="contact-tips">
            <article><span aria-hidden="true">01</span><div><h3>What and where</h3><p>Tell us whether it is a home, rental, office, communal area or another type of premises.</p></div></article>
            <article><span aria-hidden="true">02</span><div><h3>When you need it</h3><p>Mention a tenancy, marketing, move-in or compliance date if one affects the appointment.</p></div></article>
            <article><span aria-hidden="true">03</span><div><h3>Who can let us in</h3><p>Let us know whether access is through an owner, tenant, agent, key safe or site contact.</p></div></article>
          </div>
        </div>
      </section>
    </main>
  );
}
