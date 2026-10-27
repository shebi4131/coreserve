"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { cleaningTypes } from "@/lib/services";
import { siteConfig } from "@/lib/site";

const serviceDefaults: Record<string, string[]> = {
  "domestic-cleaning": ["Domestic & Residential Cleaning"],
  "end-of-tenancy-cleaning": ["End-of-Tenancy Cleaning"],
  "deep-move-cleaning": ["Deep Cleaning"],
  "commercial-office-cleaning": ["Commercial & Office Cleaning", "Regular & One-Off Cleaning"],
  "regular-commercial-cleaning": ["Commercial & Office Cleaning", "Regular & One-Off Cleaning"],
  "carpet-upholstery-cleaning": ["Carpet & Rug Cleaning", "Sofa & Upholstery Cleaning"],
  "after-builders-cleaning": ["After-Builders Cleaning"],
};

type QuoteFormProps = {
  variant?: "contact" | "service";
  serviceSlug?: string;
  serviceTitle?: string;
};

export function QuoteForm({ variant = "contact", serviceSlug, serviceTitle }: QuoteFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    serviceSlug ? serviceDefaults[serviceSlug] ?? [] : [],
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (serviceSlug) return;
    const slug = new URLSearchParams(window.location.search).get("service");
    if (slug && serviceDefaults[slug]) setSelectedServices(serviceDefaults[slug]);
  }, [serviceSlug]);

  function toggleService(service: string) {
    setSelectedServices((current) => current.includes(service)
      ? current.filter((item) => item !== service)
      : [...current, service]);
    setStatus("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedServices.length === 0) {
      setStatus("Select at least one cleaning service before continuing.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const lines = [
      "Hello Coreserve Facilities Group, I would like to request a cleaning quote.",
      "",
      ...(serviceTitle ? [`Enquiry page: ${serviceTitle}`] : []),
      `Cleaning services: ${selectedServices.join(", ")}`,
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Email: ${form.get("email") || "Not provided"}`,
      `Postcode / location: ${form.get("location")}`,
      `Property type: ${form.get("propertyType")}`,
      `Bedrooms: ${form.get("bedrooms") || "Not applicable / unsure"}`,
      `Bathrooms: ${form.get("bathrooms") || "Not applicable / unsure"}`,
      `Occupancy: ${form.get("occupancy") || "Not specified"}`,
      `Required timing: ${form.get("timing")}`,
      `Preferred date: ${form.get("date") || "Flexible"}`,
      `Access / parking: ${form.get("access") || "Not specified"}`,
      `Appliances / additional requests: ${form.get("extras") || "None specified"}`,
      "",
      `Property condition and notes: ${form.get("message") || "No additional details"}`,
    ];

    setStatus("WhatsApp opened with your enquiry. Please review and send it.");
    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const formClass = variant === "service" ? "cleaning-quote-form" : "quote-form";
  const headingClass = `${formClass}__heading`;
  const footerClass = `${formClass}__footer`;

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <div className={headingClass}>
        <div>
          <span className="eyebrow eyebrow--compact">Free cleaning quote</span>
          <h2>{variant === "service" ? "Tell us what needs cleaning" : "Tell us about the property"}</h2>
          <p>Select every service you need, then add the property details. Nothing is sent until you review the WhatsApp message.</p>
        </div>
        <span className="secure-note"><CheckCircle2 size={18} /> Review first</span>
      </div>

      <fieldset className="cleaning-selector field-wide">
        <legend>Cleaning services required *</legend>
        <p>Select one or more options</p>
        <div className="cleaning-selector__scroll" aria-describedby="cleaning-selector-help">
          {cleaningTypes.map((service) => (
            <label key={service} className={selectedServices.includes(service) ? "is-selected" : undefined}>
              <input
                type="checkbox"
                name="cleaningServices"
                value={service}
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
        <small id="cleaning-selector-help">{selectedServices.length} selected</small>
      </fieldset>

      <div className="form-grid cleaning-form-grid">
        <label><span>Full name *</span><input name="name" autoComplete="name" required placeholder="Your full name" /></label>
        <label><span>Mobile number *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="Best contact number" /></label>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label><span>Property postcode / location *</span><input name="location" autoComplete="postal-code" required placeholder="Enter postcode or town/city" /></label>
        <label>
          <span>Property or premises type *</span>
          <select name="propertyType" required defaultValue="">
            <option value="" disabled>Choose property type</option>
            <option>Flat / apartment</option><option>Terraced house</option><option>Semi-detached house</option><option>Detached house</option><option>Office / commercial premises</option><option>Communal / managed property</option><option>Other</option>
          </select>
        </label>
        <label>
          <span>Bedrooms</span>
          <select name="bedrooms" defaultValue="">
            <option value="">Not applicable / unsure</option><option>Studio</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
          </select>
        </label>
        <label>
          <span>Bathrooms</span>
          <select name="bathrooms" defaultValue="">
            <option value="">Not applicable / unsure</option><option>1</option><option>2</option><option>3</option><option>4+</option>
          </select>
        </label>
        <label>
          <span>Occupancy</span>
          <select name="occupancy" defaultValue="">
            <option value="">Choose if known</option><option>Empty and unfurnished</option><option>Empty and furnished</option><option>Currently occupied</option><option>Commercial site in use</option>
          </select>
        </label>
        <label>
          <span>When do you need the cleaning? *</span>
          <select name="timing" required defaultValue="">
            <option value="" disabled>Choose a timeframe</option><option>As soon as possible</option><option>Within 2-3 days</option><option>Within 1 week</option><option>Specific date</option><option>Flexible</option>
          </select>
        </label>
        <label><span>Preferred date</span><input name="date" type="date" /></label>
        <label className="field-wide"><span>Access and parking</span><input name="access" placeholder="Agent, tenant, key safe, parking or restrictions" /></label>
        <label className="field-wide"><span>Appliances or additional requests</span><input name="extras" placeholder="For example: oven interior, fridge, waste removal or another request" /></label>
        <label className="field-wide"><span>Property condition and anything else we should know</span><textarea name="message" rows={5} placeholder="Mention heavy build-up, hazards, deadlines, pets or special requirements." /></label>
        <label className="consent-field field-wide">
          <input name="privacy" type="checkbox" required />
          <span>I agree that my details may be used to respond to this enquiry, as described in the <Link href="/privacy">privacy notice</Link>.</span>
        </label>
      </div>

      <div className={footerClass}>
        <button className="button button--primary" type="submit"><MessageCircle size={18} /> Prepare WhatsApp {variant === "service" ? "quote" : "enquiry"} <ArrowUpRight size={18} /></button>
        <p aria-live="polite">{status || "This website does not store your answers."}</p>
      </div>
    </form>
  );
}
