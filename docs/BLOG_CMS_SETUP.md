# CoreServe blog and content admin setup

The website now contains a complete Sanity-powered knowledge centre at `/blog` and an embedded editor at `/admin`. The implementation is compatible with the existing Next.js static export and Cloudflare Pages deployment.

Nothing is published automatically by this repository setup. A newly published Sanity article becomes public only after Cloudflare builds the website again.

## What is included

- Responsive blog listing and SEO-focused article pages.
- Rich article editing: headings, lists, links, images, callouts, authors, categories and FAQs.
- Per-article SEO title, description, canonical URL, social image and noindex control.
- Article, breadcrumb and FAQ structured data.
- Published articles automatically included in `sitemap.xml` and `feed.xml` at build time.
- Related service and related article links.
- Embedded Sanity Studio at `/admin` using hash-based navigation for Cloudflare static hosting.
- `/admin` excluded from search engines through metadata, `robots.txt` and response headers.
- Safe fallback: the existing website and an empty blog still build when Sanity has not been connected.

## 1. Create the free Sanity project

1. Sign in at [sanity.io/manage](https://www.sanity.io/manage).
2. Create a project named **CoreServe Content**.
3. Create or keep a public dataset named **production**.
4. Copy the project ID from the project settings.

Sanity's free plan is suitable for launching this blog. Plan limits and pricing can change, so review the current Sanity plan before inviting a larger editorial team.

## 2. Connect the local website

Create `.env.local` in the project root and add:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-10-30
```

Do not put a write token in a `NEXT_PUBLIC_` variable. The public website only reads published content; editing is handled by the authenticated Sanity Studio.

Restart the local server:

```powershell
npm run dev
```

Open `http://localhost:3000/admin`, sign in to Sanity, and confirm that the editor loads.

## 3. Add allowed origins in Sanity

In Sanity Manage, open **API > CORS origins** and add the origins that will host the editor:

- `http://localhost:3000` — allow credentials.
- `https://staging.coreserve-csq.pages.dev` — allow credentials when staging is activated.
- `https://coreservegroup.co.uk` — allow credentials only when production is intentionally activated.

Use origins only—do not include `/admin` or a trailing path.

## 4. Prepare the content library

In `/admin`, create content in this order:

1. **Authors** — add the writer name, role, short biography and optional photo.
2. **Categories** — use focused topics such as Cleaning Advice, End-of-Tenancy, Landlord Guides and Commercial Cleaning.
3. **Blog settings** — add the knowledge-centre heading, introduction and default SEO text.
4. **Blog posts** — write the article, add a descriptive featured image and alt text, select an author and category, complete the SEO tab, then publish.

Use one clear search intent per article. Keep titles natural, add useful internal links to relevant service pages, and avoid publishing thin or repetitive location pages.

## 5. Review and release safely

The recommended workflow keeps production controlled:

1. Draft and review the article in Sanity.
2. Publish the article in Sanity.
3. Run a staging build so the static website fetches the new content.
4. Review the article on staging, including mobile layout, metadata and links.
5. Trigger or approve the production build only after review.

Because the site is statically exported, publishing in Sanity does not instantly change the live website. This is intentional and protects production from accidental content changes.

For automation later, create separate Cloudflare deploy hooks for staging and production. Connect only the staging hook to a Sanity publish webhook; keep production manual unless the release process changes.

## 6. Protect the admin route

Sanity requires an authenticated Sanity account to edit content. Add a second perimeter with Cloudflare Access before exposing the editor publicly:

1. In Cloudflare Zero Trust, create a self-hosted Access application.
2. Protect `coreservegroup.co.uk/admin*`.
3. Create an allow policy for approved company email addresses only.
4. Test in a private browser window before relying on the rule.

The Studio uses hash-based internal routes, so all editor screens remain under `/admin` and work with the static export.

## 7. Configure Cloudflare variables when ready

Add the three `NEXT_PUBLIC_SANITY_*` values to the intended Cloudflare environment. Configure staging first and verify it before copying them to production.

Environment values are build-time values. Changing them requires a new build.

## 8. Routine publishing checklist

- Confirm the post has a unique title and useful excerpt.
- Use one H1 (the title), followed by meaningful H2 and H3 headings.
- Add original, relevant images with accurate alt text.
- Link to at least one relevant CoreServe service page when useful.
- Add FAQs only when they answer genuine reader questions.
- Check the SEO title and description for clarity, not keyword stuffing.
- Preview the final staging page on desktop and mobile.
- After release, inspect the URL in Google Search Console and monitor impressions, clicks and indexing.

## Local commands

```powershell
npm run dev          # Run the site and embedded editor locally
npm run check        # Type-check the website and CMS code
npm run cms:validate # Validate the Sanity schema
npm run build        # Verify the complete static export locally
npm run cms:manage   # Open the Sanity project management page
```

Do not use `npm run deploy` during local development or content review; that script publishes directly to Cloudflare.
