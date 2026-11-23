import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, MapPin, ShieldCheck } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "Coreserve Facilities Group is a Burnley-based cleaning company with its own teams across Lancashire, Manchester, Merseyside and London.",
  alternates: { canonical: "/about" },
  openGraph: { images: [{ url: "/images/about/about-operations.jpeg", width: 1264, height: 848, alt: "Coreserve team coordinating a cleaning service" }] },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="shell page-hero__grid">
          <div><span className="eyebrow eyebrow--light">About Coreserve</span><h1>Burnley-based cleaners.<br />Itemised quotes, photo-checked results.</h1></div>
          <div><p>Coreserve Facilities Group cleans homes, rentals, short lets and workplaces with its own teams across Lancashire, Greater Manchester, Merseyside and London.</p><Link className="button button--primary" href="/contact">Discuss your property <ArrowRight /></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="shell story-grid">
          <div className="story-visual">
            <ResponsiveImage src="/images/about/about-operations.jpeg" alt="Coreserve cleaning team coordinating the property scope and service checklist" width={1264} height={848} sizes="(max-width: 980px) calc(100vw - 48px), 43vw" />
            <div className="values-panel values-panel--compact">
              <div><ClipboardCheck /><span>Quote</span><strong>Every room, task and extra listed</strong></div>
              <div><MapPin /><span>Coverage</span><strong>Own teams in 4 regions</strong></div>
              <div><ShieldCheck /><span>Sign-off</span><strong>Room checklist plus completion photos</strong></div>
            </div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">Who we are</span>
            <h2>A local cleaning company that shows its work.</h2>
            <p>{siteConfig.founderName ? `Coreserve Facilities Group was founded${siteConfig.foundedYear ? ` in ${siteConfig.foundedYear}` : ""} by ${siteConfig.founderName} and is run from ` : "Coreserve Facilities Group is run from "}124 Colne Road in Burnley. Our own cleaning teams work across Lancashire, Greater Manchester, Merseyside and London, carrying out domestic, end-of-tenancy, deep, Airbnb, office and after-builders cleaning.</p>
            <p>Before we quote, we ask about the property size, condition, access and deadline. The quote then lists each room, task and optional extra, so you know exactly what is and isn’t included before you book.</p>
            <p>On the day, the team works through a room-by-room checklist. When the job is finished, you receive completion photos and a written summary the same day, including anything we could not complete and why.</p>
            <ul className="check-list">
              <li><Check /> Itemised quote: rooms, tasks and extras listed before booking</li>
              <li><Check /> Keys, parking and access agreed in advance</li>
              <li><Check /> Any change to the agreed work discussed with you first</li>
              <li><Check /> Completion photos and a written summary the same day</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading split-heading"><div><span className="eyebrow">Who we support</span><h2>Who we clean for.</h2></div><p>One-off visits and recurring cleaning for homes, rentals, short lets and workplaces.</p></div>
          <div className="audience-grid"><article><h3>Tenants &amp; homeowners</h3><p>Move-out, move-in, regular and deep-cleaning requirements with a clear route to quotation.</p></article><article><h3>Landlords &amp; agents</h3><p>Property changeovers, communal areas and cleaning support with careful access planning.</p></article><article><h3>Businesses &amp; managers</h3><p>Planned office, commercial and housekeeping services for occupied and managed spaces.</p></article></div>
        </div>
      </section>

      <section className="cta-band"><div className="shell cta-band__inner"><div><h2>Tell us what the property needs.</h2></div><Link className="button button--primary" href="/contact">Request Free Quote <ArrowRight /></Link></div></section>
    </main>
  );
}
