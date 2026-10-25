import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ClipboardCheck, Phone } from "lucide-react";
import { ServiceMark } from "@/components/ServiceMark";
import { getService, services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

type ServicePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: `${service.title} in Preston`,
    description: `${service.summary} Based in Preston, with wider availability confirmed per enquiry.`,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | Coreserve`,
      description: service.summary,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    areaServed: ["Preston", "Lancashire", "England"],
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      telephone: "+923301119592",
    },
  };

  const related = services.filter((item) => item.slug !== service.slug && item.category === service.category).slice(0, 2);
  const faqIllustration = service.category === "Cleaning"
    ? { src: "/illustrations/schedule-cleanup.svg", width: 480, height: 272 }
    : { src: "/illustrations/property-inspection.svg", width: 480, height: 376 };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="service-page-hero">
        <div className="shell service-page-hero__grid">
          <div>
            <Link className="back-link" href="/services"><ArrowLeft size={17} /> All services</Link>
            <span className="eyebrow eyebrow--light">{service.category}</span>
            <h1>{service.title}</h1>
            <p>{service.headline}</p>
            <div className="hero__actions">
              <Link className="button button--primary" href={`/contact?service=${service.slug}`}>Request this service <ArrowUpRight size={18} /></Link>
              <a className="button button--ghost" href={siteConfig.phoneHref}><Phone size={18} /> Call us</a>
            </div>
          </div>
          <aside className="service-brief">
            <ServiceMark icon={service.icon} />
            <span>Most useful for</span>
            <strong>{service.audience}</strong>
            <hr />
            <p>Based in Preston. Wider coverage is confirmed from the property postcode and required date.</p>
          </aside>
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
            <Link className="button button--dark" href={`/contact?service=${service.slug}`}>Prepare your enquiry <ArrowRight size={18} /></Link>
          </aside>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Delivery sequence</span>
            <h2>Clear stages, fewer surprises.</h2>
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
