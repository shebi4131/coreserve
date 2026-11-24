"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Armchair, BedDouble, Building2, ChevronDown, CookingPot, Droplets, Hammer, KeyRound, MapPin, Menu, Phone, Refrigerator, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { serviceAreas } from "@/lib/areas";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/join-us", label: "Join us" },
  { href: "/contact", label: "Contact" },
];

const serviceGroups = [
  {
    title: "Homes & tenancies",
    description: "Everyday homes, moves and handovers",
    links: [
      { href: "/services/bnb-housekeeping", label: "Airbnb & Housekeeping", detail: "Guest-ready short let changeovers", icon: BedDouble },
      { href: "/services/end-of-tenancy-cleaning", label: "End-of-tenancy cleaning", detail: "Checklist-led move-out cleaning", icon: KeyRound },
      { href: "/services/deep-move-cleaning", label: "Deep & move cleaning", detail: "A detailed property reset", icon: Sparkles },
    ],
  },
  {
    title: "Offices & businesses",
    description: "Planned cleaning around your operation",
    links: [
      { href: "/services/commercial-office-cleaning", label: "Commercial & office", detail: "Workplaces and managed properties", icon: Building2 },
    ],
  },
  {
    title: "Specialist cleaning",
    description: "Focused cleaning for specific surfaces",
    links: [
      { href: "/services/carpet-upholstery-cleaning", label: "Carpet & upholstery", detail: "Carpets, rugs, sofas and seating", icon: Armchair },
      { href: "/services/oven-cleaning", label: "Oven cleaning", detail: "Ovens, hobs and extractors · from £35", icon: CookingPot },
      { href: "/services/fridge-freezer-cleaning", label: "Fridge & freezer", detail: "Inside and out · from £25", icon: Refrigerator },
      { href: "/services/jet-washing", label: "Jet washing", detail: "Driveways, patios, decking · from £65", icon: Droplets },
      { href: "/services/after-builders-cleaning", label: "After-builders cleaning", detail: "Post-work dust and residue", icon: Hammer },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<"services" | "areas" | null>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const isActive = (href: string) => pathname === href
    || (href === "/services" && pathname.startsWith("/services/"))
    || (href === "/areas-we-cover" && pathname.startsWith("/areas-we-cover/"))
    || (href === "/blog" && pathname.startsWith("/blog/"));

  useEffect(() => {
    setOpenMenu(null);
    mobileMenuRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeMenus = () => {
    setOpenMenu(null);
    mobileMenuRef.current?.removeAttribute("open");
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-bar__inner">
          <span>Itemised quotes · Completion photos the same day</span>
          <a href={siteConfig.phoneHref}><Phone size={14} aria-hidden="true" /> {siteConfig.phoneDisplay}</a>
          <span className="utility-bar__location">Professional cleaning | Across the UK</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link className={isActive("/") ? "is-active" : undefined} aria-current={isActive("/") ? "page" : undefined} href="/">Home</Link>
            <div
              className={`nav-mega nav-services${openMenu === "services" ? " is-open" : ""}`}
              onMouseEnter={() => setOpenMenu("services")}
              onMouseLeave={() => setOpenMenu(null)}
              onFocus={() => setOpenMenu("services")}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
              }}
            >
              <Link className={isActive("/services") ? "is-active" : undefined} aria-current={pathname === "/services" ? "page" : undefined} href="/services" onNavigate={closeMenus}>Services <ChevronDown size={15} aria-hidden="true" /></Link>
              <div className="services-menu" aria-label="Cleaning services">
                <div className="mega-menu__heading"><div><span>Cleaning services</span><p>Start with the type of property or work.</p></div><Link href="/services" onNavigate={closeMenus}>View all services <ArrowRight size={15} /></Link></div>
                <div className="services-menu__groups">
                  {serviceGroups.map((group) => (
                    <section className="services-menu__group" key={group.title}>
                      <div className="services-menu__group-title"><span>{group.title}</span><small>{group.description}</small></div>
                      <div>
                        {group.links.map((service) => (
                          <Link className={pathname === service.href ? "is-active" : undefined} aria-current={pathname === service.href ? "page" : undefined} key={service.href} href={service.href} onNavigate={closeMenus}>
                            <span className="services-menu__icon"><service.icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                            <span><strong>{service.label}</strong><small>{service.detail}</small></span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                <Link className="mega-menu__feature" href="/services/end-of-tenancy-cleaning" onNavigate={closeMenus}><span>Moving out soon?</span><strong>See what an end-of-tenancy clean can include.</strong><ArrowRight size={18} /></Link>
              </div>
            </div>
            <div
              className={`nav-mega nav-areas${openMenu === "areas" ? " is-open" : ""}`}
              onMouseEnter={() => setOpenMenu("areas")}
              onMouseLeave={() => setOpenMenu(null)}
              onFocus={() => setOpenMenu("areas")}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
              }}
            >
              <Link className={isActive("/areas-we-cover") ? "is-active" : undefined} aria-current={pathname === "/areas-we-cover" ? "page" : undefined} href="/areas-we-cover" onNavigate={closeMenus}>Areas <ChevronDown size={15} aria-hidden="true" /></Link>
              <div className="areas-menu" aria-label="Cleaning service areas">
                <div className="mega-menu__heading"><div><span>Areas we cover</span><p>Four priority hubs, with national enquiries considered.</p></div><Link href="/areas-we-cover" onNavigate={closeMenus}>Explore all areas <ArrowRight size={15} /></Link></div>
                <div className="areas-menu__grid">
                  {serviceAreas.map((area) => (
                    <Link className={pathname === `/areas-we-cover/${area.slug}` ? "is-active" : undefined} aria-current={pathname === `/areas-we-cover/${area.slug}` ? "page" : undefined} href={`/areas-we-cover/${area.slug}`} key={area.slug} onNavigate={closeMenus}>
                      <span className="areas-menu__icon"><MapPin size={18} aria-hidden="true" /></span>
                      <span><small>{area.region}</small><strong>{area.name}</strong><em>{area.postcodeAreas.slice(0, 3).join(" · ")}</em></span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                <div className="areas-menu__footer">
                  <div><strong>Not sure which area?</strong><span>Check a postcode in seconds.</span></div>
                  <Link href="/areas-we-cover#coverage-checker" onNavigate={closeMenus}>Check coverage <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
            {links.slice(1).map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
            <Link className="button button--primary button--small" href="/contact">Request Free Quote</Link>
          </nav>
          <details className="mobile-menu" ref={mobileMenuRef}>
            <summary aria-label="Open navigation"><Menu className="menu-open" /><X className="menu-close" /></summary>
            <nav aria-label="Mobile navigation">
              <Link className={isActive("/") ? "is-active" : undefined} aria-current={isActive("/") ? "page" : undefined} href="/">Home</Link>
              <div className="mobile-nav-services">
                <Link className={isActive("/services") ? "is-active" : undefined} aria-current={pathname === "/services" ? "page" : undefined} href="/services">Services</Link>
                {serviceGroups.map((group) => <div className="mobile-nav-group" key={group.title}><strong>{group.title}</strong><div>{group.links.map((service) => <Link className={pathname === service.href ? "is-active" : undefined} aria-current={pathname === service.href ? "page" : undefined} key={service.href} href={service.href} onNavigate={closeMenus}><service.icon size={16} strokeWidth={1.8} aria-hidden="true" /><span>{service.label}</span></Link>)}</div></div>)}
              </div>
              <div className="mobile-nav-areas">
                <Link className={isActive("/areas-we-cover") ? "is-active" : undefined} aria-current={pathname === "/areas-we-cover" ? "page" : undefined} href="/areas-we-cover">Areas we cover</Link>
                <div>{serviceAreas.map((area) => <Link className={pathname === `/areas-we-cover/${area.slug}` ? "is-active" : undefined} aria-current={pathname === `/areas-we-cover/${area.slug}` ? "page" : undefined} href={`/areas-we-cover/${area.slug}`} key={area.slug} onNavigate={closeMenus}><MapPin size={15} /><span>{area.name}</span><small>{area.region}</small></Link>)}</div>
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
