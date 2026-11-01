import type { Metadata, Viewport } from "next";
import { AdminStudio } from "@/components/admin/AdminStudio";
import { isSanityConfigured } from "@/sanity/env";

export const metadata: Metadata = { title: "Content Admin", robots: { index: false, follow: false }, referrer: "same-origin" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function AdminPage() {
  return (
    <main id="main-content" className="admin-shell">
      {isSanityConfigured ? <AdminStudio /> : (
        <section className="admin-setup">
          <span>CoreServe content admin</span>
          <h1>Connect the Sanity project to activate the editor.</h1>
          <p>The complete editor is installed. Add the project ID and dataset to your local environment, then restart the development server.</p>
          <pre><code>NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id{"\n"}NEXT_PUBLIC_SANITY_DATASET=production</code></pre>
          <p className="admin-setup__note">This page is marked noindex. Before deployment, also protect <strong>/admin</strong> with Cloudflare Access.</p>
        </section>
      )}
    </main>
  );
}
