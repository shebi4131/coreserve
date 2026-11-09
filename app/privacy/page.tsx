import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Coreserve Facilities Group Ltd collects, uses, stores and protects personal information.",
  alternates: { canonical: "/privacy" },
};

const contents = [
  ["introduction", "Introduction"],
  ["who-we-are", "Who we are"],
  ["information-we-collect", "Information we collect"],
  ["how-we-collect", "How we collect your information"],
  ["how-we-use", "How we use your information"],
  ["lawful-basis", "Lawful basis for processing"],
  ["sharing", "Sharing your personal information"],
  ["security", "Data security"],
  ["retention", "How long we keep your information"],
  ["marketing", "Marketing communications"],
  ["cookies", "Cookies and website tracking"],
  ["rights", "Your data protection rights"],
  ["third-party-websites", "Third-party websites"],
  ["children", "Children's privacy"],
  ["complaints", "Complaints and regulatory authority"],
  ["changes", "Changes to this privacy policy"],
  ["contact", "Contact us"],
] as const;

const address = `${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.postcode}`;

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <section className="legal-hero legal-hero--privacy">
        <div className="shell legal-hero__inner">
          <span className="eyebrow eyebrow--light">Privacy &amp; data protection</span>
          <h1>Privacy policy</h1>
          <p>
            How Coreserve Facilities Group Ltd collects, uses, stores and protects
            personal information.
          </p>
        </div>
      </section>

      <div className="shell privacy-layout">
        <aside className="privacy-sidebar" aria-label="Privacy policy contents">
          <div className="privacy-sidebar__card">
            <span className="eyebrow">On this page</span>
            <nav>
              <ol>
                {contents.map(([id, label], index) => (
                  <li key={id}>
                    <a href={`#${id}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <article className="legal-content privacy-content">
          <div className="privacy-summary">
            <div>
              <span className="privacy-summary__label">Data controller</span>
              <strong>Coreserve Facilities Group Ltd</strong>
            </div>
            <div>
              <span className="privacy-summary__label">Contact</span>
              <a href="mailto:info@coreservegroup.co.uk">info@coreservegroup.co.uk</a>
            </div>
          </div>

          <section id="introduction">
            <h2><span>01</span> Introduction</h2>
            <p>Coreserve Facilities Group Ltd (&quot;Coreserve&quot;, &quot;we&quot;, &quot;our&quot; or &quot;us&quot;) is committed to protecting the privacy and personal information of our customers, website visitors, employees, suppliers, contractors and business partners.</p>
            <p>This Privacy Policy explains how we collect, use, store, protect and share personal information when you visit our website, contact us, request a quotation, use our services or otherwise interact with our business.</p>
            <p>We process personal information in accordance with applicable UK data protection legislation, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
          </section>

          <section id="who-we-are">
            <h2><span>02</span> Who we are</h2>
            <dl className="privacy-details">
              <div><dt>Company name</dt><dd>Coreserve Facilities Group Ltd</dd></div>
              <div><dt>Website</dt><dd><a href="https://coreservegroup.co.uk/">coreservegroup.co.uk</a></dd></div>
              <div><dt>Business address</dt><dd>{address}</dd></div>
              <div><dt>Email</dt><dd><a href="mailto:info@coreservegroup.co.uk">info@coreservegroup.co.uk</a></dd></div>
              <div><dt>Telephone</dt><dd><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></dd></div>
            </dl>
            <p>Coreserve Facilities Group Ltd acts as the data controller for the personal information covered by this policy, unless otherwise stated.</p>
          </section>

          <section id="information-we-collect">
            <h2><span>03</span> Information we collect</h2>
            <p>Depending on how you interact with us, we may collect the following information:</p>
            <h3>Personal and contact information</h3>
            <ul><li>Full name</li><li>Home or business address</li><li>Email address</li><li>Telephone number</li><li>Company or organisation name</li></ul>
            <h3>Customer and service information</h3>
            <ul><li>Property address and relevant property details</li><li>Cleaning and facilities management requirements</li><li>Service requests and booking details</li><li>Quotations, invoices and payment records</li><li>Communications, feedback and complaints</li><li>Access arrangements and relevant service instructions</li></ul>
            <h3>Website and technical information</h3>
            <ul><li>IP address</li><li>Browser type and device information</li><li>Website usage and interaction data</li><li>Cookies and similar tracking technologies, where permitted</li></ul>
            <h3>Supplier and contractor information</h3>
            <ul><li>Business contact details</li><li>Company information</li><li>Qualifications and professional credentials where relevant</li><li>Contractual and payment information</li></ul>
            <p>We only collect information that is relevant and reasonably necessary for our business activities.</p>
          </section>

          <section id="how-we-collect">
            <h2><span>04</span> How we collect your information</h2>
            <p>We may collect personal information through:</p>
            <ul><li>Our website and online enquiry forms.</li><li>Telephone calls, emails and other correspondence.</li><li>Requests for quotations and service bookings.</li><li>Contracts and customer registration processes.</li><li>Business networking and professional contacts.</li><li>Letting agents, landlords, property managers and commercial clients who provide information relevant to a service.</li><li>Recruitment applications and contractor registration.</li><li>Cookies and website analytics tools, where applicable.</li></ul>
          </section>

          <section id="how-we-use">
            <h2><span>05</span> How we use your information</h2>
            <p>We may use your personal information for the following purposes:</p>
            <ul><li>Responding to enquiries and providing quotations.</li><li>Arranging and delivering cleaning services.</li><li>Providing property maintenance and facilities management services.</li><li>Managing bookings, appointments and customer accounts.</li><li>Processing invoices and payments.</li><li>Communicating service updates and important information.</li><li>Managing complaints, feedback and customer support.</li><li>Maintaining business, financial and contractual records.</li><li>Improving our website and customer experience.</li><li>Sending relevant business updates and marketing communications where legally permitted.</li><li>Meeting legal, regulatory, insurance and accounting obligations.</li><li>Protecting our business, customers, employees and property.</li></ul>
          </section>

          <section id="lawful-basis">
            <h2><span>06</span> Lawful basis for processing</h2>
            <p>We process personal information under one or more of the following lawful bases:</p>
            <div className="privacy-basis-grid">
              <div><h3>Contract</h3><p>Where processing is necessary to provide a service, fulfil a booking, prepare a quotation at your request or meet contractual obligations.</p></div>
              <div><h3>Legitimate interests</h3><p>Where processing is necessary for our legitimate business interests, such as responding to general business enquiries, managing customer relationships, improving our services and protecting our business. We balance these interests against your rights and freedoms.</p></div>
              <div><h3>Legal obligation</h3><p>Where we need to process information to comply with applicable laws, regulations, accounting requirements or other legal obligations.</p></div>
              <div><h3>Consent</h3><p>Where you have given permission for a specific purpose, such as certain marketing communications or non-essential cookies.</p></div>
            </div>
            <p>Where we rely on consent, you may withdraw it at any time.</p>
          </section>

          <section id="sharing">
            <h2><span>07</span> Sharing your personal information</h2>
            <p>We do not sell, rent or trade your personal information to third parties.</p>
            <p>However, we may share relevant information with trusted third parties where necessary to operate our business and deliver our services, including:</p>
            <ul><li>Approved subcontractors and service providers.</li><li>Cleaning and facilities management personnel.</li><li>Property managers, landlords and letting agents involved in the service.</li><li>Payment processing and banking providers.</li><li>Website hosting, email and IT service providers.</li><li>Accountants, auditors and professional advisers.</li><li>Insurers and legal advisers.</li><li>Government bodies, regulators and law enforcement agencies where legally required.</li></ul>
            <p>Where third parties process personal information on our behalf, we take reasonable steps to ensure appropriate contractual and security arrangements are in place.</p>
          </section>

          <section id="security">
            <h2><span>08</span> Data security</h2>
            <p>We take appropriate technical and organisational measures to protect personal information against:</p>
            <ul><li>Unauthorised access.</li><li>Accidental loss or destruction.</li><li>Unauthorised alteration.</li><li>Misuse or disclosure.</li><li>Other forms of unlawful processing.</li></ul>
            <p>These measures may include access controls, password protection, secure systems, staff guidance and appropriate security procedures.</p>
            <p>Although we take reasonable precautions, no method of electronic transmission or storage can be guaranteed to be completely secure.</p>
          </section>

          <section id="retention">
            <h2><span>09</span> How long we keep your information</h2>
            <p>We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including legal, accounting and reporting requirements.</p>
            <p>Retention periods may vary depending on the type of information:</p>
            <ul><li><strong>General enquiries:</strong> normally up to 12 months after the last meaningful contact.</li><li><strong>Customer and service records:</strong> normally up to 6 years after the end of the relevant contractual relationship, where appropriate.</li><li><strong>Financial and accounting records:</strong> generally 6 years, subject to applicable legal requirements.</li><li><strong>Supplier and contractor records:</strong> for the duration of the relationship and an appropriate period afterwards.</li><li><strong>Marketing information:</strong> until you unsubscribe, object or the information is no longer required.</li><li><strong>Website and cookie information:</strong> according to the applicable cookie and analytics settings.</li></ul>
            <p>When information is no longer required, we will securely delete or anonymise it where appropriate.</p>
          </section>

          <section id="marketing">
            <h2><span>10</span> Marketing communications</h2>
            <p>We may occasionally send information about our services, business updates and relevant offers.</p>
            <p>We will only send marketing communications where permitted under applicable privacy and electronic communications laws.</p>
            <p>You can opt out of marketing communications at any time by:</p>
            <ul><li>Clicking the unsubscribe link in an email, where provided.</li><li>Contacting us directly by email.</li><li>Informing us that you no longer wish to receive marketing communications.</li></ul>
            <p>Opting out of marketing will not affect essential communications relating to an existing booking, contract or service.</p>
          </section>

          <section id="cookies">
            <h2><span>11</span> Cookies and website tracking</h2>
            <p>Our website may use cookies and similar technologies to improve functionality, understand website usage and enhance the visitor experience.</p>
            <p>Cookies may include:</p>
            <ul><li>Essential cookies required for website functionality.</li><li>Analytical cookies used to understand website traffic and performance.</li><li>Functional cookies that remember website preferences.</li><li>Marketing cookies, if used, to support advertising and marketing activities.</li></ul>
            <p>Where required, we will request your consent before placing non-essential cookies on your device.</p>
            <p>You can manage cookie preferences through our website&apos;s cookie settings and your browser settings.</p>
          </section>

          <section id="rights">
            <h2><span>12</span> Your data protection rights</h2>
            <p>Under applicable data protection legislation, you may have the right to:</p>
            <ul><li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li><li><strong>Rectification:</strong> Ask us to correct inaccurate or incomplete information.</li><li><strong>Erasure:</strong> Request deletion of your personal information in certain circumstances.</li><li><strong>Restriction:</strong> Ask us to restrict how we process your information in certain circumstances.</li><li><strong>Objection:</strong> Object to certain types of processing, particularly processing based on legitimate interests or direct marketing.</li><li><strong>Data portability:</strong> Request certain personal information in a commonly used electronic format where the right applies.</li><li><strong>Withdraw consent:</strong> Withdraw consent where we rely on it as our lawful basis.</li></ul>
            <p>To exercise any of these rights, please contact us using the details provided in this policy.</p>
            <p>We will respond to requests in accordance with applicable legal requirements. We may need to verify your identity before responding.</p>
          </section>

          <section id="third-party-websites">
            <h2><span>13</span> Third-party websites</h2>
            <p>Our website may contain links to external websites, services or platforms.</p>
            <p>We are not responsible for the privacy practices, content or security of third-party websites. We recommend reviewing their individual privacy policies before providing personal information.</p>
          </section>

          <section id="children">
            <h2><span>14</span> Children&apos;s privacy</h2>
            <p>Our services are generally intended for adults and business customers.</p>
            <p>We do not knowingly collect personal information directly from children unless it is necessary for a legitimate service-related purpose and handled appropriately.</p>
          </section>

          <section id="complaints">
            <h2><span>15</span> Complaints and regulatory authority</h2>
            <p>If you have concerns about how we collect or use your personal information, please contact us first so that we can investigate and address your concerns.</p>
            <p>You also have the right to complain to the UK&apos;s Information Commissioner&apos;s Office (ICO).</p>
            <div className="privacy-callout">
              <strong>Information Commissioner&apos;s Office (ICO)</strong>
              <span>Website: <a href="https://ico.org.uk/" target="_blank" rel="noreferrer">ico.org.uk</a></span>
              <span>Telephone: <a href="tel:03031231113">0303 123 1113</a></span>
            </div>
          </section>

          <section id="changes">
            <h2><span>16</span> Changes to this privacy policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our business operations, services, technology or legal requirements.</p>
            <p>Any updates will be published on our website, together with the revised effective date.</p>
          </section>

          <section id="contact" className="privacy-contact">
            <span className="eyebrow">Privacy enquiries</span>
            <h2><span>17</span> Contact us</h2>
            <p>If you have any questions about this Privacy Policy, how we handle your personal information or wish to exercise your data protection rights, please contact:</p>
            <address>
              <strong>Coreserve Facilities Group Ltd</strong>
              <a href="https://coreservegroup.co.uk/">coreservegroup.co.uk</a>
              <a href="mailto:info@coreservegroup.co.uk">info@coreservegroup.co.uk</a>
              <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
              <span>{address}</span>
            </address>
            <p>We will be happy to assist with any privacy or data protection enquiries.</p>
          </section>
        </article>
      </div>
    </main>
  );
}
