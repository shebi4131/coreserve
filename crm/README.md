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

## Connected workflows

- Signup creates pending Cleaner accounts. Superadmin approves, suspends and changes team roles.
- Server roles: Superadmin, Manager, Supervisor, Cleaner. Customer/property/enquiry records are manager-only. Cleaners see their assigned jobs; supervisors see explicitly supervised jobs. Only Superadmin changes roles and issues reset links.
- Customer, property and enquiry create/edit/delete; enquiries have pipeline stages.
- Job create/edit/assignment, calendar filtering, persisted checklists, private Before/After photos, issues and supervisor approval.
- Explicit location check-in/out with accuracy and timestamp. No background tracking.
- Profile, password, coverage, travel and weekly availability updates.
- Activity history, real report totals and CSV export.
- Password recovery uses administrator-issued, one-use links expiring after 30 minutes. The request screen instructs users to contact their administrator. Automated email delivery is NOT configured and no email is claimed to have been sent.
- Google sign-in is intentionally disabled and labelled Coming soon.

Updates refresh after writes and page loads. This is not a live dispatch/WebSocket system. Automated recurring jobs, invoices, payroll and customer portal are outside the small pilot.

## Cloud resources and launch boundary

Cloudflare D1 coreserve-crm and private R2 coreserve-crm-private have been created, and remote migrations applied. The production Wrangler environment points to these; default uses separate local storage. The cloud database is not seeded with an account; no CRM Worker/domain has been deployed.

Before deployment: confirm data jurisdiction (the current empty D1 database was created in APAC), seed the cloud Superadmin with a fresh private password, verify free-plan password-hashing CPU usage and quotas, harden public signup abuse controls, arrange backups/restore tests, configure domain/HTTPS, and deploy separately at app.coreservegroup.co.uk. Do not use remote storage for real workforce/customer records before launch review. No paid plan was selected. Provider allowances still have limits.

## Verification

`npm --prefix crm run build` exports assets to crm/out.

With the API running, execute `node crm/scripts/test-api.mjs` and provide the local Superadmin password on stdin. Tests exercise login, activation, escalation prevention, assignment scoping, private photos, completion validation, optimistic concurrency, origin checks, password rotation, one-use resets and logout. Only this run's self-created local test fixtures are removed.

Older Workspace.jsx and demo.js preserve the UI reference. Live routes render LiveWorkspace.jsx. No demo login or role switch is exposed. Shared navigation/checklist labels come from demo.js; fictional customers and jobs are not used by the live app.
