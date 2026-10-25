"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/areas-we-cover", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
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
          <span className="utility-bar__location">Based in North-West | Nationwide coverage</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
            <Link className="button button--primary button--small" href="/contact">Request a quote</Link>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Menu className="menu-open" /><X className="menu-close" /></summary>
            <nav aria-label="Mobile navigation">
              {links.map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
              <a href={siteConfig.phoneHref}>Call {siteConfig.phoneDisplay}</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
