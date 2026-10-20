import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div>
            <Logo inverse />
            <p>Professional cleaning and property compliance support, coordinated with care from Preston for clients across England.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <nav aria-label="Footer navigation">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Request a quote</Link>
            </nav>
          </div>
          <div>
            <h2>Contact</h2>
            <nav aria-label="Contact details">
              <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
              <span>{siteConfig.address.street}</span>
              <span>{siteConfig.address.locality}, {siteConfig.address.postcode}</span>
            </nav>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Coreserve Facilities Group. All rights reserved.</span>
          <span>Professional service. Clear communication.</span>
        </div>
      </div>
    </footer>
  );
}
