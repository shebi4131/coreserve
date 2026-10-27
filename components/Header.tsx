"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/areas-we-cover", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services/domestic-cleaning", label: "Domestic Cleaning" },
  { href: "/services/deep-move-cleaning", label: "Deep Cleaning" },
  { href: "/services/end-of-tenancy-cleaning", label: "End-of-Tenancy Cleaning" },
  { href: "/services/commercial-office-cleaning", label: "Commercial & Office Cleaning" },
  { href: "/services/carpet-upholstery-cleaning", label: "Carpet & Upholstery Cleaning" },
  { href: "/services/after-builders-cleaning", label: "After-Builders Cleaning" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href === "/services" && pathname.startsWith("/services/"));

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-bar__inner">
          <span>Professional cleaning, clearly coordinated</span>
          <a href={siteConfig.phoneHref}><Phone size={14} aria-hidden="true" /> {siteConfig.phoneDisplay}</a>
          <span className="utility-bar__location">Based in North-West | Wider UK coverage</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link className={isActive("/") ? "is-active" : undefined} aria-current={isActive("/") ? "page" : undefined} href="/">Home</Link>
            <div className="nav-services">
              <Link className={isActive("/services") ? "is-active" : undefined} aria-current={pathname === "/services" ? "page" : undefined} href="/services">Services <ChevronDown size={15} aria-hidden="true" /></Link>
              <div className="services-menu" aria-label="Cleaning services">
                <div className="services-menu__heading"><span>Our cleaning services</span><Link href="/services">View all services</Link></div>
                <div className="services-menu__grid">
                  {serviceLinks.map((service, index) => (
                    <Link className={pathname === service.href ? "is-active" : undefined} aria-current={pathname === service.href ? "page" : undefined} key={service.href} href={service.href}>
                      <span>{String(index + 1).padStart(2, "0")}</span><strong>{service.label}</strong>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {links.slice(1).map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
            <Link className="button button--primary button--small" href="/contact">Request a quote</Link>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Menu className="menu-open" /><X className="menu-close" /></summary>
            <nav aria-label="Mobile navigation">
              <Link className={isActive("/") ? "is-active" : undefined} aria-current={isActive("/") ? "page" : undefined} href="/">Home</Link>
              <div className="mobile-nav-services">
                <Link className={isActive("/services") ? "is-active" : undefined} aria-current={pathname === "/services" ? "page" : undefined} href="/services">Services</Link>
                <div>
                  {serviceLinks.map((service) => <Link className={pathname === service.href ? "is-active" : undefined} aria-current={pathname === service.href ? "page" : undefined} key={service.href} href={service.href}>{service.label}</Link>)}
                </div>
              </div>
              {links.slice(1).map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
              <a href={siteConfig.phoneHref}>Call {siteConfig.phoneDisplay}</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
