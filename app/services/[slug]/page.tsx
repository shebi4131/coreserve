import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ClipboardCheck, Phone } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";
import { ServiceMark } from "@/components/ServiceMark";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { TrustStrip } from "@/components/TrustStrip";
import { getService, services } from "@/lib/services";
import { canonicalUrl, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

type ServicePageProps = { params: Promise<{ slug: string }> };

const serviceImages = {
  "domestic-cleaning": { src: "/images/home/home-hero.jpeg", width: 1312, height: 816, alt: "Coreserve professional providing domestic cleaning in a modern home" },
  "end-of-tenancy-cleaning": { src: "/images/services/end-of-tenancy-cleaning.jpeg", width: 1264, height: 848, alt: "Coreserve team carrying out an end-of-tenancy clean" },
  "bnb-housekeeping": { src: "/images/services/bnb-housekeeping.jpeg", width: 1312, height: 816, alt: "Guest-ready B&B bedroom prepared for a short let arrival" },
  "deep-move-cleaning": { src: "/images/services/deep-move-cleaning.jpeg", width: 1264, height: 848, alt: "Coreserve team deep cleaning a kitchen" },
  "commercial-office-cleaning": { src: "/images/services/regular-commercial-cleaning.jpeg", width: 1264, height: 848, alt: "Coreserve team providing commercial and office cleaning" },
  "carpet-upholstery-cleaning": { src: "/images/services/specialist-cleaning.jpeg", width: 1312, height: 816, alt: "Coreserve professional carrying out carpet and upholstery cleaning" },
  "after-builders-cleaning": { src: "/images/services/services-hero.jpeg", width: 1376, height: 768, alt: "Coreserve cleaning team prepared for an after-builders clean" },
} as const;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const image = serviceImages[service.slug as keyof typeof serviceImages];

  return {
    title: service.seoTitle ? { absolute: service.seoTitle } : service.title,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.seoTitle || `${service.title} | Coreserve`,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const serviceImage = serviceImages[service.slug as keyof typeof serviceImages];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    areaServed: ["Lancashire", "Greater Manchester", "Merseyside", "Greater London"],
    provider: {
      "@id": `${canonicalUrl()}#business`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  const related = services.filter((item) => item.slug !== service.slug && item.category === service.category).slice(0, 2);
  const faqIllustration = { src: "/illustrations/schedule-cleanup.svg", width: 480, height: 272 };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <section className="service-page-hero">
        <div className="shell service-page-hero__grid">
          <div>
            <Link className="back-link" href="/services"><ArrowLeft size={17} /> All services</Link>
            <span className="eyebrow eyebrow--light">{service.category}</span>
            <h1>{service.title}</h1>
            <p>{service.headline}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#quote-form">Request this service <ArrowUpRight size={18} /></a>
              <a className="button button--ghost" href={siteConfig.phoneHref}><Phone size={18} /> Call us</a>
            </div>
          </div>
          <div className="service-hero-visual">
            <ResponsiveImage src={serviceImage.src} alt={serviceImage.alt} width={serviceImage.width} height={serviceImage.height} sizes="(max-width: 980px) calc(100vw - 48px), 42vw" priority />
            <aside className="service-brief">
              <ServiceMark icon={service.icon} />
              <span>Most useful for</span>
              <strong>{service.audience}</strong>
              <hr />
              {service.priceFrom ? <p><strong>From {service.priceFrom}</strong></p> : null}
              <p>Own teams in Lancashire, Greater Manchester, Merseyside &amp; London</p>
            </aside>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="section cleaning-form-section" id="quote-form">
        <div className="shell cleaning-form-layout">
          <div className="cleaning-form-intro">
            <span className="eyebrow">Request a quotation</span>
            <h2>Get an itemised quote</h2>
            <p>Choose the cleaning you need and tell us about the property, timing and access. We reply with an itemised quote listing each room, task and extra, so you can see the cost of each part before booking.</p>
            <ul className="check-list">
              <li><Check /> Multiple cleaning services in one enquiry</li>
              <li><Check /> Own teams across Lancashire, Manchester, Merseyside &amp; London</li>
              <li><Check /> Residential, commercial and managed properties</li>
              <li><Check /> Completion photos and a written summary the same day</li>
            </ul>
          </div>
          <QuoteForm variant="service" serviceSlug={service.slug} serviceTitle={service.title} />
        </div>
      </section>

      <section className="section">
        <div className="shell service-content-grid">
          <article>
            <span className="eyebrow">The service</span>
            <h2>What to expect</h2>
            <p className="lead-copy">{service.intro}</p>
            <h3>What the agreed scope can include</h3>
            <ul className="detail-list detail-list--large">
              {service.includes.map((item) => <li key={item}><Check size={18} /> <span>{item}</span></li>)}
            </ul>
          </article>
          <aside className="preparation-card">
            <ClipboardCheck />
            <span className="eyebrow">Before we quote</span>
            <h2>Details that help us respond properly</h2>
            <ul>{service.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
            <a className="button button--dark" href="#quote-form">Prepare your enquiry <ArrowRight size={18} /></a>
          </aside>
        </div>
      </section>

      {service.details?.length ? (
        <section className="section section--compact">
          <div className="shell service-details">
            {service.details.map((detail) => (
              <article key={detail.heading}><h2>{detail.heading}</h2><p>{detail.body}</p></article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">How it works</span>
            <h2>From enquiry to sign-off in four steps.</h2>
          </div>
          <ol className="stage-grid">
            {service.process.map((step, index) => (
              <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.detail}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell faq-layout">
          <div className="faq-layout__intro"><span className="eyebrow">Questions</span><h2 className="service-faq-title">Useful details before you book.</h2><img className="faq-illustration" src={faqIllustration.src} alt="" width={faqIllustration.width} height={faqIllustration.height} loading="lazy" decoding="async" /></div>
          <div className="faq-list">
            {service.faqs.map((faq) => (
              <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      {service.slug === "end-of-tenancy-cleaning" ? (
        <section className="checklist-callout">
          <div className="shell checklist-callout__inner">
            <div><span className="eyebrow eyebrow--light">Room-by-room scope</span><h2>See the end-of-tenancy checklist.</h2><p>Review the areas we discuss when preparing an itemised quotation.</p></div>
            <Link className="button button--primary" href="/end-of-tenancy-cleaning-checklist">Open the checklist <ArrowRight size={18} /></Link>
          </div>
        </section>
      ) : null}

      <section className="section section--compact related-services">
        <div className="shell">
          <div className="section-heading"><span className="eyebrow">Related services</span><h2>You may also need</h2></div>
          <div className="related-grid">
            {related.map((item) => (
              <Link href={`/services/${item.slug}`} key={item.slug}><ServiceMark icon={item.icon} /><div><h3>{item.title}</h3><p>{item.summary}</p></div><ArrowUpRight /></Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
