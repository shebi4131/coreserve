"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Armchair, BedDouble, Building2, ChevronDown, CookingPot, Droplets, Hammer, KeyRound, MapPin, Menu, Microwave, Phone, Refrigerator, Sparkles, Tag, WashingMachine, X } from "lucide-react";
import { lowestPrice, PRICES } from "@/lib/prices";
import { Logo } from "@/components/Logo";
import { serviceAreas } from "@/lib/areas";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const price = (amount: number) => `£${amount}`;

const serviceGroups = [
  {
    title: "Homes & lettings",
    description: "Move-outs, move-ins and changeovers",
    links: [
      { href: "/services/end-of-tenancy-cleaning", label: "End of tenancy", detail: "Move-out cleans for deposits", price: price(PRICES.endOfTenancy), icon: KeyRound },
      { href: "/services/deep-move-cleaning", label: "Deep & move cleaning", detail: "A full top-to-bottom reset", price: price(PRICES.deepCleaning), icon: Sparkles },
      { href: "/services/bnb-housekeeping", label: "Airbnb & housekeeping", detail: "Guest-ready changeovers", icon: BedDouble },
      { href: "/services/after-builders-cleaning", label: "After-builders", detail: "Post-renovation dust", icon: Hammer },
    ],
  },
  {
    title: "Kitchen appliances",
    description: "On their own or added to any clean",
    links: [
      { href: "/services/oven-cleaning", label: "Oven cleaning", detail: "Ovens, hobs and extractors", price: price(PRICES.oven), icon: CookingPot },
      { href: "/services/fridge-freezer-cleaning", label: "Fridge & freezer", detail: "Cleaned and sanitised", price: price(PRICES.fridgeFreezer), icon: Refrigerator },
      { href: "/services/washing-machine-cleaning", label: "Washing machine", detail: "Seal, drawer and drum", price: price(PRICES.washingMachine), icon: WashingMachine },
      { href: "/services/microwave-cleaning", label: "Microwave", detail: "Inside and out", price: price(PRICES.microwave), icon: Microwave },
    ],
  },
  {
    title: "Specialist & commercial",
    description: "Surfaces, outdoors and workplaces",
    links: [
      { href: "/services/carpet-upholstery-cleaning", label: "Carpet & upholstery", detail: "Carpets, sofas, curtains", price: price(PRICES.sofa), icon: Armchair },
      { href: "/services/jet-washing", label: "Jet washing", detail: "Driveways, patios, decking", price: price(PRICES.driveway), icon: Droplets },
      { href: "/services/commercial-office-cleaning", label: "Commercial & office", detail: "Offices and workplaces", icon: Building2 },
      { href: "/prices", label: "All prices", detail: "Full price list", icon: Tag },
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
          <span className="utility-bar__location">Across the UK · <Link href="/join-us">Join our team</Link></span>
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
                            {"price" in service && service.price ? <em className="services-menu__price">from <b>{service.price}</b></em> : null}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                <Link className="mega-menu__feature" href="/prices" onNavigate={closeMenus}><span>Prices from £{lowestPrice}</span><strong>See our full price list. Free itemised quotes, no hidden extras.</strong><ArrowRight size={18} /></Link>
              </div>
            </div>
            <Link className={isActive("/prices") ? "is-active" : undefined} aria-current={isActive("/prices") ? "page" : undefined} href="/prices">Prices</Link>
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
              <Link className={isActive("/prices") ? "is-active" : undefined} aria-current={isActive("/prices") ? "page" : undefined} href="/prices">Prices</Link>
              <div className="mobile-nav-areas">
                <Link className={isActive("/areas-we-cover") ? "is-active" : undefined} aria-current={pathname === "/areas-we-cover" ? "page" : undefined} href="/areas-we-cover">Areas we cover</Link>
                <div>{serviceAreas.map((area) => <Link className={pathname === `/areas-we-cover/${area.slug}` ? "is-active" : undefined} aria-current={pathname === `/areas-we-cover/${area.slug}` ? "page" : undefined} href={`/areas-we-cover/${area.slug}`} key={area.slug} onNavigate={closeMenus}><MapPin size={15} /><span>{area.name}</span><small>{area.region}</small></Link>)}</div>
              </div>
              {links.slice(1).map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href}>{link.label}</Link>)}
              <Link className={isActive("/join-us") ? "is-active" : undefined} href="/join-us">Join our team</Link>
              <a href={siteConfig.phoneHref}>Call {siteConfig.phoneDisplay}</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
