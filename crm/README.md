# CoreServe Workspace — connected pilot

Isolated Next.js frontend and Cloudflare Worker API. The public website source, secrets, deployment configuration and Google Sheets are not changed by this app.

## Local development

The initial local database and Superadmin have been created. Run in two terminals from the repository root:

```powershell
npm --prefix crm run api
npm --prefix crm run dev
```

Open http://localhost:3002/login/. API: http://127.0.0.1:3003. Frontend requests use a same-origin development proxy. Sessions use HttpOnly, SameSite=Strict cookies; Secure is added under HTTPS. No session token or password is stored in browser storage.

Superadmin: info@coreservegroup.co.uk. The temporary password is supplied separately in chat, never committed. Change it through Settings. Password changes and account access changes revoke sessions.

On a new machine, install parent dependencies, run `npm --prefix crm run setup` and provide the initial password on stdin, then `npm --prefix crm run db:migrate`. Setup preserves existing accounts; it does not reset passwords. Runtime files under crm/.wrangler/ are the persistent LOCAL database and media. Keep them to retain local records.

## Interface

All styling lives in `app/crm.css` (design tokens at the top: navy/blue/teal brand palette, Manrope 400–800, radii, shadows). Shared building blocks are in `components/ui.jsx`; sign-in, signup and password reset are in `components/AuthScreen.jsx`. Every list and table uses the single `components/Pagination.jsx` component and its `usePagination` hook (page size choice, reset to page 1 when filters change). The sidebar can be collapsed to icons on desktop (remembered per browser) and becomes a slide-in menu on phones. `public/brand/coreserve-logo-light.png` and `coreserve-mark-light.png` are transparent variants for dark backgrounds.

## Connected workflows

The operations workbook has been mapped into a cleaner directory, estate-agent outreach, a service/property/area catalogue, a complete lead-to-job record and finance/follow-up fields. The dashboard uses these records. See [coverage and private import notes](docs/operations-coverage.md). The 68 source records are in the local database; private source data is ignored by Git and is not frontend seed data.

- Signup creates pending accounts in the default Cleaner role. Accounts can be activated, suspended and assigned any built-in or custom role by someone with the account-management permission.
- Roles & access has an editable permission catalogue and a user-assignment tab. Permissions belong to roles and are enforced on every API request; menus and actions reflect them. All four initial roles can be renamed and edited, and custom roles can be created or deleted once unassigned. The default Cleaner and Superadmin role records remain available for signup and owner recovery. The owner email retains full access to prevent lockout. Delegated administrators can grant only permissions they hold. Role/account changes revoke affected sessions and stop location sharing.
- Job access is scoped to assigned cleaner/supervisor unless the role has View all jobs. Customer/property/enquiry access and create/edit/delete permissions are independent. Work updates, assignment, review, photographs and locations have separate permissions.
- Customer, property and enquiry create/edit/delete; enquiries have pipeline stages.
- Jobs & leads tracks contact/source, property details, quote, costs/profit/margin, payments/balance, delivery flags, reviews and follow-ups. Booking transfers the enquiry into a single job record. Cancelled and re-clean-requested work is tracked separately; re-clean cycles reset the checklist and require fresh evidence.
- Cleaner directory profiles have separate day/time slots, coverage, travel, skills and onboarding records. They are distinct from login accounts. Estate-agent outreach and service/property-type/area catalogues have CRUD screens. Catalogue renames keep linked record labels consistent.
- Job create/edit/assignment, calendar filtering, persisted checklists, private Before/After photos, issues and supervisor approval.
- Explicit location check-in/out and Start/Stop sharing on an assigned job in progress. Device permission is required. Sharing survives client-side navigation, sends at most one watch update per 30 seconds plus a fresh-position request every minute, and ends on checkout, logout, access revocation or when the job leaves In progress. The tracking API checks ownership, assignment, fresh coordinates and the eight-hour session limit on every update.
- Team locations polls every 30 seconds and shows a last-position OpenStreetMap view, device accuracy and Sharing/Stale/Stopped status. Positions older than two minutes are stale. This is foreground browser sharing: closing the app, a locked phone or an interrupted connection can stop updates. Page-close stop is best effort. No native background-location service is claimed. Each sharing session stores its latest position, not a continuous route. The view shows 24 hours; a daily Worker cron removes sessions older than 30 days and expires old sessions/tokens. Locally, cleanup also runs when a new sharing session starts; production cron starts only after a separate deployment.
- A shared accessible toaster shows success/error/info messages across dashboard routes, with dismissal, auto-expiry and pause on hover/focus.
- Profile, password, coverage, travel and weekly availability updates.
- Activity history, real report totals and CSV export.
- Password recovery uses administrator-issued, one-use links expiring after 30 minutes. The request screen instructs users to contact their administrator. Automated email delivery is NOT configured and no email is claimed to have been sent.
- Google sign-in is intentionally disabled and labelled Coming soon.

Records refresh after writes and page loads; the location board polls. Automated recurring jobs, invoices, payroll and customer portal are outside the small pilot. The map uses OpenStreetMap's public embed and its availability/usage policy. No paid API or new subscription was added; Cloudflare free-tier allowances still apply.

## Cloud resources and launch boundary

Cloudflare D1 coreserve-crm and private R2 coreserve-crm-private have been created. The latest role/tracking migration is applied locally only; run migrations for the production environment before a future CRM deployment. The production Wrangler environment points to the cloud resources; default uses separate local storage. The cloud database is not seeded with an account; no CRM Worker/domain has been deployed.

Before deployment: confirm data jurisdiction (the current empty D1 database was created in APAC), seed the cloud Superadmin with a fresh private password, verify free-plan password-hashing CPU usage and quotas, harden public signup abuse controls, arrange backups/restore tests, configure domain/HTTPS, and deploy separately at app.coreservegroup.co.uk. Do not use remote storage for real workforce/customer records before launch review. No paid plan was selected. Provider allowances still have limits.

## Verification

`npm --prefix crm run build` exports assets to crm/out.

With the API running, execute `node crm/scripts/test-api.mjs` and provide the local Superadmin password on stdin. Tests exercise login, activation, escalation prevention, assignment scoping, private photos, completion validation, optimistic concurrency, origin checks, password rotation, one-use resets and logout. Only this run's self-created local test fixtures are removed.

`node crm/scripts/test-access-tracking.mjs` additionally exercises custom-role assignment, delegated-access limits, owner protection, role-edit concurrency, assigned-role deletion protection, tracking ownership and scope, malformed/stale coordinates, permission revocation, stop and logout. It uses disposable local fixtures and removes only those fixtures. Real device GPS permission and phone sleep behavior still need a device check over HTTPS (localhost is also permitted).

`node crm/scripts/test-operations.mjs` covers the operations modules, importer counts, money calculations, independent availability, catalogue changes, booking without duplication, sensitive-field redaction and write permissions. Provide the local administrator password through stdin. `node crm/scripts/import-operations.mjs` performs a duplicate-safe local dry run; add `--apply` only for the reviewed private snapshot.

Older Workspace.jsx and demo.js preserve the UI reference. Live routes render LiveWorkspace.jsx. No demo login or role switch is exposed. Shared navigation/checklist labels come from demo.js; fictional customers and jobs are not used by the live app.
