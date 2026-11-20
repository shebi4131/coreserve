"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { cleaningTypes } from "@/lib/services";

const serviceDefaults: Record<string, string[]> = {
  "domestic-cleaning": ["Domestic & Residential Cleaning"],
  "end-of-tenancy-cleaning": ["End-of-Tenancy Cleaning"],
  "bnb-housekeeping": ["Air Bnb & Housekeeping", "Housekeeping Services"],
  "deep-move-cleaning": ["Deep Cleaning"],
  "commercial-office-cleaning": ["Commercial & Office Cleaning", "Regular & One-Off Cleaning"],
  "regular-commercial-cleaning": ["Commercial & Office Cleaning", "Regular & One-Off Cleaning"],
  "carpet-upholstery-cleaning": ["Carpet & Rug Cleaning", "Sofa & Upholstery Cleaning"],
  "after-builders-cleaning": ["After-Builders Cleaning"],
};

const steps = [
  { number: 1, label: "Cleaning needs", title: "What needs cleaning?", description: "Choose the service and tell us where the property is." },
  { number: 2, label: "Property details", title: "Tell us about the property", description: "A few practical details help us prepare an accurate quotation." },
  { number: 3, label: "Your details", title: "Where should we send your quote?", description: "Add your contact details and any final notes for our team." },
];

type QuoteFormProps = {
  variant?: "contact" | "service";
  serviceSlug?: string;
  serviceTitle?: string;
  defaultLocation?: string;
};

export function QuoteForm({ variant = "contact", serviceSlug, serviceTitle, defaultLocation = "" }: QuoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(serviceSlug ? serviceDefaults[serviceSlug] ?? [] : []);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationValue, setLocationValue] = useState(defaultLocation);
  const activeStep = steps[currentStep - 1];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get("location");
    if (location) setLocationValue(location);

    if (!serviceSlug) {
      const slug = params.get("service");
      if (slug && serviceDefaults[slug]) setSelectedServices(serviceDefaults[slug]);
    }

    function handleLocation(event: Event) {
      const detail = (event as CustomEvent<{ location?: string }>).detail;
      if (detail?.location) setLocationValue(detail.location);
    }

    window.addEventListener("coreserve:location-selected", handleLocation);
    return () => window.removeEventListener("coreserve:location-selected", handleLocation);
  }, [serviceSlug]);

  function clearStatus() {
    setStatus("");
    setStatusType("idle");
  }

  function toggleService(service: string) {
    setSelectedServices((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
    clearStatus();
  }

  function validateStep(step: number) {
    if (step === 1 && selectedServices.length === 0) {
      setStatus("Select at least one cleaning service before continuing.");
      setStatusType("error");
      return false;
    }

    const stepElement = formRef.current?.querySelector<HTMLElement>(`[data-form-step="${step}"]`);
    const fields = stepElement?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input:not([type='hidden']), select, textarea");
    const invalidField = Array.from(fields ?? []).find((field) => !field.checkValidity());
    if (invalidField) {
      invalidField.reportValidity();
      return false;
    }
    return true;
  }

  function changeStep(nextStep: number) {
    clearStatus();
    setCurrentStep(nextStep);
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function goToNextStep() {
    if (validateStep(currentStep)) changeStep(currentStep + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!validateStep(3)) return;

    const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
    if (!endpoint) {
      setStatus("Online enquiry storage is not configured yet. Please use the WhatsApp option or call us.");
      setStatusType("error");
      return;
    }

    const form = new FormData(formElement);
    if (form.get("website")) return;

    const payload = new URLSearchParams();
    const fieldNames = ["name", "phone", "email", "location", "propertyType", "bedrooms", "bathrooms", "occupancy", "timing", "date", "access", "extras", "message"];
    fieldNames.forEach((field) => payload.set(field, String(form.get(field) || "")));
    payload.set("cleaningServices", selectedServices.join(", "));
    payload.set("source", variant === "service" ? "Service page quote form" : "Contact page quote form");
    payload.set("servicePage", serviceTitle || "");
    payload.set("pageUrl", window.location.href);
    payload.set("submittedAt", new Date().toISOString());

    setIsSubmitting(true);
    setStatus("Sending your enquiry...");
    setStatusType("idle");

    try {
      await fetch(endpoint, { method: "POST", mode: "no-cors", body: payload });
      formElement.reset();
      setSelectedServices(serviceSlug ? serviceDefaults[serviceSlug] ?? [] : []);
      setLocationValue(defaultLocation);
      setCurrentStep(1);
      setStatus("Thank you. Your enquiry has been submitted and Coreserve will review the details.");
      setStatusType("success");
    } catch {
      setStatus("We could not submit the enquiry. Please try again or contact us by phone or WhatsApp.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const formClass = variant === "service" ? "cleaning-quote-form" : "quote-form";
  const headingClass = `${formClass}__heading`;
  const footerClass = `${formClass}__footer`;

  return (
    <form ref={formRef} className={`${formClass} multi-step-form`} onSubmit={handleSubmit}>
      <div className={headingClass}>
        <div>
          <span className="eyebrow eyebrow--compact">Free cleaning quote · Step {currentStep} of {steps.length}</span>
          <h2>{activeStep.title}</h2>
          <p>{activeStep.description}</p>
        </div>
        <span className="secure-note"><CheckCircle2 size={18} /> Secure enquiry</span>
      </div>

      <ol className="form-progress" aria-label="Quotation progress">
        {steps.map((step) => {
          const state = step.number < currentStep ? "complete" : step.number === currentStep ? "current" : "upcoming";
          return (
            <li key={step.number} className={`is-${state}`} aria-current={state === "current" ? "step" : undefined}>
              <span>{state === "complete" ? <Check size={15} /> : step.number}</span>
              <strong>{step.label}</strong>
            </li>
          );
        })}
      </ol>

      <section className="form-step" data-form-step="1" hidden={currentStep !== 1} aria-label="Cleaning needs">
        <fieldset className="cleaning-selector field-wide">
          <legend>Cleaning services required *</legend>
          <p>Select one or more options</p>
          <div className="cleaning-selector__scroll" aria-describedby="cleaning-selector-help">
            {cleaningTypes.map((service) => (
              <label key={service} className={selectedServices.includes(service) ? "is-selected" : undefined}>
                <input type="checkbox" name="cleaningServices" value={service} checked={selectedServices.includes(service)} onChange={() => toggleService(service)} />
                <span>{service}</span>
              </label>
            ))}
          </div>
          <small id="cleaning-selector-help">{selectedServices.length} selected</small>
        </fieldset>
        <div className="form-grid cleaning-form-grid">
          <label><span>Property postcode / location *</span><input name="location" autoComplete="postal-code" required placeholder="Enter postcode or town/city" value={locationValue} onChange={(event) => { setLocationValue(event.target.value); clearStatus(); }} /></label>
          <label>
            <span>Property or premises type *</span>
            <select name="propertyType" required defaultValue="" onChange={clearStatus}>
              <option value="" disabled>Choose property type</option>
              <option>Flat / apartment</option><option>Terraced house</option><option>Semi-detached house</option><option>Detached house</option><option>Office / commercial premises</option><option>Communal / managed property</option><option>Other</option>
            </select>
          </label>
        </div>
      </section>

      <section className="form-step" data-form-step="2" hidden={currentStep !== 2} aria-label="Property details">
        <div className="form-grid cleaning-form-grid">
          <label><span>Bedrooms</span><select name="bedrooms" defaultValue=""><option value="">Not applicable / unsure</option><option>Studio</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label>
          <label><span>Bathrooms</span><select name="bathrooms" defaultValue=""><option value="">Not applicable / unsure</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></label>
          <label><span>Occupancy</span><select name="occupancy" defaultValue=""><option value="">Choose if known</option><option>Empty and unfurnished</option><option>Empty and furnished</option><option>Currently occupied</option><option>Commercial site in use</option></select></label>
          <label><span>When do you need the cleaning? *</span><select name="timing" required defaultValue=""><option value="" disabled>Choose a timeframe</option><option>As soon as possible</option><option>Within 2-3 days</option><option>Within 1 week</option><option>Specific date</option><option>Flexible</option></select></label>
          <label><span>Preferred date</span><input name="date" type="date" /></label>
          <label><span>Access and parking</span><input name="access" placeholder="Key safe, parking or restrictions" /></label>
        </div>
      </section>

      <section className="form-step" data-form-step="3" hidden={currentStep !== 3} aria-label="Contact details">
        <div className="form-grid cleaning-form-grid">
          <label className="form-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label><span>Full name *</span><input name="name" autoComplete="name" required placeholder="Your full name" /></label>
          <label><span>Mobile number *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="Best contact number" /></label>
          <label className="field-wide"><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
          <label className="field-wide"><span>Appliances or additional requests</span><input name="extras" placeholder="For example: oven interior, fridge or waste removal" /></label>
          <label className="field-wide"><span>Property condition and anything else we should know</span><textarea name="message" rows={4} placeholder="Mention heavy build-up, hazards, deadlines, pets or special requirements." /></label>
          <label className="consent-field field-wide"><input name="privacy" type="checkbox" required /><span>I agree that my details may be used to respond to this enquiry, as described in the <Link href="/privacy">privacy notice</Link>.</span></label>
        </div>
      </section>

      <div className={footerClass}>
        <div className="form-step-actions">
          {currentStep > 1 && <button className="button button--secondary" type="button" onClick={() => changeStep(currentStep - 1)}><ArrowLeft size={18} /> Back</button>}
          {currentStep < steps.length
            ? <button className="button button--primary" type="button" onClick={goToNextStep}>Continue <ArrowRight size={18} /></button>
            : <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="button-spinner" size={18} /> : <Send size={18} />}{isSubmitting ? "Sending..." : `Send ${variant === "service" ? "quote request" : "enquiry"}`}</button>}
        </div>
        <p className={statusType === "idle" ? undefined : `form-status form-status--${statusType}`} aria-live="polite">{status || (currentStep < 3 ? "Your progress is kept while you complete these steps." : "Your details are used only to respond to this enquiry.")}</p>
      </div>
    </form>
  );
}
