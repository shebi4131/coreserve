import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SocialIcon } from "@/components/SocialIcon";
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
              <span>{siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.postcode}</span>
              <span>Wider UK coverage</span>
            </nav>
            <div className="footer__socials" role="group" aria-label="Coreserve social media">
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Follow Coreserve on Instagram" title="Instagram"><SocialIcon platform="instagram" /></a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Follow Coreserve on Facebook" title="Facebook"><SocialIcon platform="facebook" /></a>
              <a href={siteConfig.social.whatsapp} target="_blank" rel="noreferrer" aria-label="Message Coreserve on WhatsApp" title="WhatsApp"><MessageCircle /></a>
            </div>
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
