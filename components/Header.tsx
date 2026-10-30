"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Armchair, Building2, ChevronDown, Hammer, House, KeyRound, Menu, Phone, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/areas-we-cover", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services/domestic-cleaning", label: "Domestic Cleaning", icon: House },
  { href: "/services/deep-move-cleaning", label: "Deep Cleaning", icon: Sparkles },
  { href: "/services/end-of-tenancy-cleaning", label: "End-of-Tenancy Cleaning", icon: KeyRound },
  { href: "/services/commercial-office-cleaning", label: "Commercial & Office Cleaning", icon: Building2 },
  { href: "/services/carpet-upholstery-cleaning", label: "Carpet & Upholstery Cleaning", icon: Armchair },
  { href: "/services/after-builders-cleaning", label: "After-Builders Cleaning", icon: Hammer },
];

export function Header() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const isActive = (href: string) => pathname === href
    || (href === "/services" && pathname.startsWith("/services/"))
    || (href === "/blog" && pathname.startsWith("/blog/"));

  useEffect(() => {
    setServicesOpen(false);
    mobileMenuRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeMenus = () => {
    setServicesOpen(false);
    mobileMenuRef.current?.removeAttribute("open");
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

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
            <div
              className={`nav-services${servicesOpen ? " is-open" : ""}`}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onFocus={() => setServicesOpen(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
              }}
            >
              <Link className={isActive("/services") ? "is-active" : undefined} aria-current={pathname === "/services" ? "page" : undefined} href="/services" onNavigate={closeMenus}>Services <ChevronDown size={15} aria-hidden="true" /></Link>
              <div className="services-menu" aria-label="Cleaning services">
                <div className="services-menu__heading"><span>Our cleaning services</span><Link href="/services" onNavigate={closeMenus}>View all services</Link></div>
                <div className="services-menu__grid">
                  {serviceLinks.map((service) => (
                    <Link className={pathname === service.href ? "is-active" : undefined} aria-current={pathname === service.href ? "page" : undefined} key={service.href} href={service.href} onNavigate={closeMenus}>
                      <span className="services-menu__icon"><service.icon size={18} strokeWidth={1.8} aria-hidden="true" /></span><strong>{service.label}</strong>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {links.slice(1).map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
            <Link className="button button--primary button--small" href="/contact">Request a quote</Link>
          </nav>
          <details className="mobile-menu" ref={mobileMenuRef}>
            <summary aria-label="Open navigation"><Menu className="menu-open" /><X className="menu-close" /></summary>
            <nav aria-label="Mobile navigation">
              <Link className={isActive("/") ? "is-active" : undefined} aria-current={isActive("/") ? "page" : undefined} href="/">Home</Link>
              <div className="mobile-nav-services">
                <Link className={isActive("/services") ? "is-active" : undefined} aria-current={pathname === "/services" ? "page" : undefined} href="/services">Services</Link>
                <div>
                  {serviceLinks.map((service) => <Link className={pathname === service.href ? "is-active" : undefined} aria-current={pathname === service.href ? "page" : undefined} key={service.href} href={service.href} onNavigate={closeMenus}><service.icon size={16} strokeWidth={1.8} aria-hidden="true" /><span>{service.label}</span></Link>)}
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
