import type { Metadata } from "next";
import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Cleaning or Property Service Quote",
  description:
    "Request an itemised cleaning, EPC, gas safety or EICR coordination quote from Coreserve Facilities Group in Preston.",
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
            <span className="eyebrow">Request a quote</span>
            <h1>Start with the<br />property details.</h1>
            <p>Share the postcode, property, service and timescale. We’ll use those details to clarify the scope before anything is booked.</p>
            <div className="contact-methods">
              <a href={siteConfig.phoneHref}><span><Phone /></span><div><small>Call us</small><strong>{siteConfig.phoneDisplay}</strong></div></a>
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer"><span><MessageCircle /></span><div><small>Message us</small><strong>Start a WhatsApp chat</strong></div></a>
              <div><span><MapPin /></span><div><small>Our base</small><strong>{siteConfig.address.street}<br />{siteConfig.address.locality}, {siteConfig.address.postcode}</strong></div></div>
              <div><span><Clock3 /></span><div><small>Coverage</small><strong>Preston-based, with wider availability confirmed per enquiry</strong></div></div>
            </div>
          </div>
          <ContactForm />
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
            <article><span aria-hidden="true">02</span><div><h3>Condition and extras</h3><p>Mention appliances, carpets, heavy build-up or anything that may change the time or equipment required.</p></div></article>
            <article><span aria-hidden="true">03</span><div><h3>Date and access</h3><p>Tell us the handover deadline, parking situation and who can provide access.</p></div></article>
          </div>
        </div>
      </section>
    </main>
  );
}
