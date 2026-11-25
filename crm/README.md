# CoreServe Workspace — UI pilot

Isolated Next.js application. The public website, its routes, deployment scripts and secrets are not used by the CRM.

From the repository root, run:

```powershell
npm --prefix crm run dev
```

Open http://localhost:3002/login/ and select **Take the interactive demo**. Explore `/tour/`, then use the header role selector to switch between Admin, Manager, Supervisor and Cleaner. Direct navigation to unavailable areas displays a restricted screen; Cleaner sees Amelia's assignments and Supervisor sees Preston jobs.

## Scope

This is an interface prototype, not a production CRM. Authentication, signup, recovery and Google OAuth are illustrative screens; passwords are never stored or sent. Role previews are client-side only and are not a security boundary. Use fictional data only. No database, email, file storage, GPS or external integration is connected. Sample image previews remain in browser memory. Job edits and the demo role use sessionStorage; clear site data to reset. Other record forms are screen previews.

Routes: login, signup, forgot-password, auth/callback, dashboard, jobs, jobs/CS-1042 through CS-1045, schedule, team, customers, properties, enquiries, evidence, locations, reports, access, settings, notifications, tour.

## Next phase

Connect Supabase authentication and database, implement row-level policies and private media access, invite-only team provisioning, verified OAuth callback, email recovery, durable assignments/checklists, consent-based location capture, audit events and backups. Remove demo role switching before real data is introduced. Provision a separate Cloudflare project for app.coreservegroup.co.uk only when deployment is requested.

Production build: `npm --prefix crm run build` (static prototype in `crm/out`). Dependencies currently resolve from the parent installation. For a separate repository/deployment install the exact dependencies declared in crm/package.json and commit its lockfile.
