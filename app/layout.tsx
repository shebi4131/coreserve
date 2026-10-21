import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActions } from "@/components/MobileActions";
import { siteConfig } from "@/lib/site";

const brandFont = localFont({
  src: [
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../node_modules/@fontsource/manrope/files/manrope-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Coreserve Facilities Group | Cleaning Services Preston",
    template: "%s | Coreserve Facilities Group",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteConfig.name,
    title: "Coreserve Facilities Group",
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { themeColor: "#10243a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={brandFont.variable}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        {children}
        <Footer />
        <MobileActions />
      </body>
    </html>
  );
}
