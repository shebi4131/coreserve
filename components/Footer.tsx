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
            <p>Professional cleaning coordinated with care from our North-West base, with wider UK coverage subject to location and availability.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <nav aria-label="Footer navigation">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/areas-we-cover">Areas we cover</Link>
              <Link href="/about">About</Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/contact">Request a quote</Link>
            </nav>
          </div>
          <div>
            <h2>Contact</h2>
            <nav aria-label="Contact details">
              <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
              <span>Based in North-West</span>
              <span>Wider UK coverage</span>
            </nav>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Coreserve Facilities Group. All rights reserved.</span>
          <nav className="footer__legal" aria-label="Legal information"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/complaints">Complaints</Link></nav>
        </div>
      </div>
    </footer>
  );
}
