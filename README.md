# Coreserve Facilities Group website

Marketing and enquiry website for **Coreserve Facilities Group Ltd**, a cleaning company based at 124 Colne Road, Burnley, BB10 1LP. The company serves North-West England and takes enquiries from the rest of the UK, depending on location and availability.

It is a Next.js (App Router) site built as a static export and hosted on Cloudflare Pages. Blog content comes from Sanity. Quote enquiries are saved to Google Sheets, and cleaner applications go to a Google Form.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/services` and `/services/[slug]` | Service directory and seven service pages with quote forms (domestic, end-of-tenancy, Airbnb & housekeeping, deep/move, commercial & office, carpet & upholstery, after-builders). Content lives in `lib/services.ts`. |
| `/areas-we-cover` and `/areas-we-cover/[slug]` | Coverage hub plus Preston/Lancashire, Manchester, Liverpool and London pages, with a postcode checker. Data lives in `lib/areas.ts`. |
| `/end-of-tenancy-cleaning-checklist` | Room-by-room cleaning scope |
| `/about`, `/faqs`, `/contact` | Company information and the main quote form |
| `/join-us` | Cleaner job application form |
| `/blog`, `/blog/[slug]`, `/blog/category/[slug]` | Sanity-powered articles (see `docs/BLOG_CMS_SETUP.md`) |
| `/admin` | Embedded Sanity Studio, password-protected on Cloudflare (see below) |
| `/privacy`, `/terms`, `/complaints` | Customer-information pages |
| `/sitemap.xml`, `/robots.txt`, `/feed.xml` | Generated at build time |

Business details (name, phone, address, social links, map) are stored in one place: `lib/site.ts`.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # TypeScript check
```

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap and structured data |
| `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` | Quote form; Apps Script web app from `scripts/google-sheets-enquiry-webhook.gs` |
| `NEXT_PUBLIC_APPLICATION_RELAY_URL` | Optional. Cleaner-application relay from `scripts/google-forms-application-relay.gs` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Blog content and `/admin` |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID`, `NEXT_PUBLIC_TAWK_WIDGET_ID` | Optional Tawk.to live chat |

Set the same variables in Cloudflare Pages (Production and Preview) before building there.

## Forms

- **Quote form** (`components/QuoteForm.tsx`): posts to the Google Apps Script webhook. The script returns `{"ok":true}` only after it has written the row, and the form shows "submitted" only when it receives that reply. If the webhook is down, misconfigured or slow (25-second timeout), the visitor sees an error asking them to try again, call or use WhatsApp, and their answers stay in the form.
- **Cleaner application** (`components/CleanerApplicationForm.tsx`): sends answers to a Google Form. Google Forms replies can't be read from the browser, so success can only be confirmed through the relay:
  1. Create a **new** Apps Script project and paste in `scripts/google-forms-application-relay.gs`.
  2. Deploy it as a web app (Execute as: Me, Access: Anyone).
  3. Set the resulting `/exec` URL as `NEXT_PUBLIC_APPLICATION_RELAY_URL`, then rebuild.

  Without that variable, the form posts straight to Google Forms as before and can only catch network errors.

After you edit an Apps Script, publish a new version of the **existing** deployment (Deploy → Manage deployments → Edit → New version) so the `/exec` URL stays the same.

## Admin protection

`functions/admin/_middleware.ts` is a Cloudflare Pages Function that requires a username and password for `/admin` and `/admin/*`. It runs only on those paths, so public pages are still served as plain static files and don't use the free Functions quota.

In Cloudflare Pages → **Settings → Variables and Secrets**, add these as encrypted secrets for **both** Production and Preview:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` (long and random)

Then redeploy. If either value is missing, `/admin` returns 503 (the gate stays closed). `npm run dev` doesn't run Pages Functions, so local editing isn't affected. Editing content still requires a Sanity login on top of this password.

If you want per-person logins instead of a shared password, Cloudflare Zero Trust → Access (free for up to 50 users) can protect `/admin*` with email one-time codes. That is configured in the Cloudflare dashboard and can sit in front of this gate.

## Build and deploy

```bash
npm run build                 # static export to out/
npm run preview:cloudflare    # serve out/ plus functions/ locally with Wrangler
npm run deploy                # build and deploy to the "coreserve" Pages project, production branch
```

Branches: `shoaib-dev` is for development, `staging` is for pre-release checks and `main` is production. Only deploy or merge to `main` once a change has been checked on staging.

`public/_headers` sets security and noindex headers. `public/_redirects` holds legacy URL redirects.

## Tracking and SEO

- The Meta Pixel (`lib/meta-pixel.ts`) loads only after the visitor accepts marketing cookies (`components/MarketingConsent.tsx`).
- Each route has its own title, description and canonical URL. The site also generates a sitemap, robots.txt, an RSS feed and LocalBusiness, Service, FAQ and Article structured data.
- Search engine verification files live in `public/` (Google and Bing).

## Repository notes

- `docs/source/` holds the original supplied site (`original-site.html`) and the source logo. `scripts/prepare-logo.mjs` reads the logo from there.
- The illustrations in `public/illustrations/` come from [unDraw](https://undraw.co/illustrations) and were recoloured to the brand palette.
