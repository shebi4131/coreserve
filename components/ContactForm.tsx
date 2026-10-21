"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

type FormState = "idle" | "ready";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const matched = services.find((service) => service.slug === slug);
    if (matched) setSelectedService(matched.title);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      "Hello Coreserve Facilities Group, I would like to request a quote.",
      "",
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Email: ${form.get("email") || "Not provided"}`,
      `Service: ${form.get("service")}`,
      `Postcode / location: ${form.get("location")}`,
      `Property type: ${form.get("propertyType")}`,
      `Bedrooms: ${form.get("bedrooms") || "Not specified"}`,
      `Bathrooms: ${form.get("bathrooms") || "Not specified"}`,
      `Occupancy: ${form.get("occupancy") || "Not specified"}`,
      `Preferred date: ${form.get("date") || "Flexible"}`,
      `Access / parking: ${form.get("access") || "Not specified"}`,
      `Appliances / carpets / extras: ${form.get("extras") || "None specified"}`,
      "",
      `Property condition and notes: ${form.get("message") || "No additional details"}`,
    ];

    setState("ready");
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="quote-form__heading">
        <div>
          <span className="eyebrow eyebrow--compact">Free quote request</span>
          <h2>Tell us about the property</h2>
          <p>Your answers are prepared as a WhatsApp message for you to review before sending.</p>
        </div>
        <span className="secure-note"><CheckCircle2 size={18} /> Review first</span>
      </div>

      <div className="form-grid">
        <label>
          <span>Your name *</span>
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          <span>Phone number *</span>
          <input name="phone" type="tel" autoComplete="tel" required placeholder="Best contact number" />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Service required *</span>
          <select name="service" required value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>
            <option value="" disabled>Choose a service</option>
            {services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}
            <option value="Multiple services">Multiple services</option>
          </select>
        </label>
        <label>
          <span>Property postcode or location *</span>
          <input name="location" autoComplete="postal-code" required placeholder="For example, PR2 3DH" />
        </label>
        <label>
          <span>Property type *</span>
          <select name="propertyType" required defaultValue="">
            <option value="" disabled>Choose property type</option>
            <option>Flat / apartment</option>
            <option>Terraced house</option>
            <option>Semi-detached house</option>
            <option>Detached house</option>
            <option>Office / commercial premises</option>
            <option>Communal / managed property</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          <span>Bedrooms</span>
          <select name="bedrooms" defaultValue="">
            <option value="">Not applicable / unsure</option>
            <option>Studio</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
          </select>
        </label>
        <label>
          <span>Bathrooms</span>
          <select name="bathrooms" defaultValue="">
            <option value="">Not applicable / unsure</option>
            <option>1</option><option>2</option><option>3</option><option>4+</option>
          </select>
        </label>
        <label>
          <span>Occupancy</span>
          <select name="occupancy" defaultValue="">
            <option value="">Choose if known</option>
            <option>Empty and unfurnished</option>
            <option>Empty and furnished</option>
            <option>Currently occupied</option>
            <option>Commercial site in use</option>
          </select>
        </label>
        <label>
          <span>Preferred date</span>
          <input name="date" type="date" />
        </label>
        <label className="field-wide">
          <span>Access and parking</span>
          <input name="access" placeholder="Keys, agent, tenant, key safe, parking or restrictions" />
        </label>
        <label className="field-wide">
          <span>Appliances, carpets or selected extras</span>
          <input name="extras" placeholder="For example: oven interior, fridge, carpeted stairs" />
        </label>
        <label className="field-wide">
          <span>Property condition and anything else we should know</span>
          <textarea name="message" rows={5} placeholder="Mention heavy build-up, hazards, deadlines, inventory requirements or known concerns." />
        </label>
        <label className="consent-field field-wide">
          <input name="privacy" type="checkbox" required />
          <span>I agree that my details may be used to respond to this enquiry, as described in the <Link href="/privacy">privacy notice</Link>.</span>
        </label>
      </div>

      <div className="quote-form__footer">
        <button className="button button--primary" type="submit">Prepare WhatsApp enquiry <ArrowUpRight size={18} /></button>
        <p aria-live="polite">{state === "ready" ? "WhatsApp opened with your enquiry. Please review and send it." : "This website does not store your answers."}</p>
      </div>
    </form>
  );
}
