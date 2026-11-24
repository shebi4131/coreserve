import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, MessageCircle, Phone } from "lucide-react";
import { FaqExplorer } from "@/components/FaqExplorer";
import { allFaqs, faqCategories } from "@/lib/faqs";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning FAQs: Prices, Booking & Services",
  description: "Answers to common cleaning questions: end of tenancy prices from £110, oven cleaning, jet washing, keys and access, opening hours and areas we cover.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "Cleaning FAQs | Coreserve Facilities Group",
    description: "Prices, booking, end of tenancy, oven cleaning, jet washing and more, answered.",
    url: "/faqs",
  },
};

export default function FaqPage() {
  const faqs = allFaqs();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

      <section className="page-hero faq-hero">
        <div className="shell page-hero__grid">
          <div>
            <span className="eyebrow eyebrow--light">Help centre · {faqs.length} answers</span>
            <h1>Cleaning questions, answered.</h1>
          </div>
          <div>
            <p>Prices, booking, keys and access, end of tenancy, oven cleaning, jet washing and more. Search below or pick a topic.</p>
            <div className="faq-hero__actions">
              <Link className="button button--primary" href="/contact">Get a free quote <ArrowRight size={18} /></Link>
              <a className="button button--ghost" href={siteConfig.phoneHref}><Phone size={18} /> {siteConfig.phoneDisplay}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="shell">
          <FaqExplorer categories={faqCategories} />
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div>
            <span className="eyebrow eyebrow--light">Still have a question?</span>
            <h2>Ask us directly. We reply 7 days a week.</h2>
            <p><Clock3 size={16} aria-hidden="true" /> {siteConfig.businessHours}. Send your postcode and what needs cleaning for a free, itemised quote.</p>
          </div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Get a free quote <ArrowRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.social.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
