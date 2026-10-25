# Coreserve Facilities Group website

A complete, search-optimised Next.js website for Coreserve Facilities Group, focused on nationwide residential, commercial and property-management cleaning.

## Pages

- `/` — Home
- `/services` — Service directory
- `/services/[service]` — Three detailed, indexable core cleaning pages with enquiry forms
- `/end-of-tenancy-cleaning-checklist` — Room-by-room cleaning scope
- `/areas-we-cover` — North-West base, priority regions and nationwide coverage guidance
- `/about` — Company approach and positioning
- `/faqs` — Service and booking questions
- `/contact` — Detailed WhatsApp quote form
- `/privacy`, `/terms`, `/complaints` — Customer-information pages

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production configuration

Copy `.env.example` to `.env.local` and replace the example URL with the final public domain:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.co.uk
```

This value is used for canonical URLs, sitemap entries and structured data. Set the same variable in Cloudflare before the production build.

## Verify a production build

```bash
npm run build
npm run preview:cloudflare
```

## Deploy to Cloudflare Pages

1. Create a free Cloudflare account and authenticate Wrangler:

   ```bash
   npx wrangler login
   ```

2. Create a Pages project named `coreserve-facilities-group`, or change the project name in the `deploy` script.
3. Set `NEXT_PUBLIC_SITE_URL` before building, then deploy:

   ```bash
   npm run deploy
   ```

The production build is a static Next.js export in `out/`, so every public page is served directly from Cloudflare's edge without paid compute. You can also connect the Git repository in Cloudflare Pages and use `npm run build` as the build command and `out` as the output directory.

If server-side features are added later, the same project can use Cloudflare Pages Functions or switch to the OpenNext Workers adapter. Supabase can also be connected without changing the page structure.

## Contact form

The site-wide and service-page forms build a pre-filled WhatsApp message to `+44 330 111 9592`. They store nothing and require no database or paid email provider. The implementation can later be replaced with a server action using Resend, Supabase or another CRM without changing the public form design.

## SEO included

- Route-specific titles, descriptions and canonical links
- `sitemap.xml` and `robots.txt`
- Local business, service, FAQ and item-list structured data
- Semantic landmarks and heading hierarchy
- Crawlable service pages and a detailed end-of-tenancy checklist
- Fast static-first pages, responsive layouts and local font optimisation

Before launch, connect the domain, verify the website in Google Search Console and create or update the Google Business Profile with matching contact details.

## Illustration assets

The SVG artwork in `public/illustrations/` is sourced from [unDraw](https://undraw.co/illustrations) and recoloured to the Coreserve navy and blue palette. The images are decorative, locally hosted and lazy-loaded.
