# Operations workbook coverage

Source: [CoreServe operations workbook](https://docs.google.com/spreadsheets/d/1KALsCLBYoR6rF330q92b0hDWeulgoAeP9On2WNCW1xI/edit). Inspected 26 November 2026. The spreadsheet is unchanged.

| Workbook area | CRM implementation |
| --- | --- |
| Dashboard | Real counts, money summary, follow-ups, agency outreach, onboarding checks, booking conversion, today's jobs and activity. No fabricated revenue or jobs. |
| Detailed dashboard totals | Reports provides all-time/current-month lead summaries, lead-source/area breakdowns, job statuses, lost/cancelled work, cleaner pay/costs, average booked value, team/travel/coverage/verification totals and every outreach status. Operations CSV follows the 38-column workbook layout for authorised finance users; columns outside the role's permissions are omitted. |
| Jobs & Leads: contact and source | Jobs & leads: generated reference, received date, source, customer name, phone and email. |
| Jobs & Leads: property and scope | Postcode, area, address, service, property type, bedrooms, bathrooms, notes, preferred date and time. |
| Jobs & Leads: quoting and delivery | Quote, lead status, booking state, directory cleaner assignment and derived phone. Booking moves the same enquiry into a scheduled job without duplication. Job date, completion date and review workflow remain linked to it. |
| Jobs & Leads: money | Cleaner pay, materials/other costs, calculated total cost, profit and margin; payment status, paid amount, calculated balance and invoice reference. Values are stored as integer pence. |
| Jobs & Leads: customer follow-through | Photos sent, same-day summary sent, rating, review requested, follow-up date and internal notes. These flags record activity; they do not send emails or messages. |
| Cleaners | Directory ID, contact, address, coverage, travel, separate day/time availability, skills, declared visa/RTW, document checks, DBS, insurance, hourly rate, baseline completed jobs, status, applied date and notes. New completed CRM jobs add to the baseline count. |
| Estate Agents | Agency/branch, area, phone, email, outreach status, contacted/follow-up dates, contact person, jobs referred and notes. No outreach is sent automatically. |
| Services & Prices | Editable service catalogue with starting price (or quote on request), price notes, service URL, active status and booking/quote totals. Starting prices do not overwrite agreed quotes. |
| Lists | No spreadsheet-style Lists page. CRUD catalogue tabs for service types, property types and areas. Options are used in lead/job forms. Renaming catalogue entries updates linked records atomically; used entries can be deactivated instead of deleted. Other workflow statuses remain explicit application options. |

## Data import

Imported locally: **11 cleaner profiles, 20 agencies, 23 services, 8 property types and 6 areas**. The source Jobs & Leads table was empty. Availability, blank verification fields, unverified-email notes and contact statuses were preserved. RTW declarations were not treated as completed checks.

This is a one-time copy, not two-way Google Sheets synchronisation. No sign-in accounts, shared passwords, emails or remote records were created. Cleaner directory records are separate from Workspace accounts. When a directory cleaner is assigned, an existing active account with matching email and job-work permission is linked; otherwise assignment remains a directory assignment. After activating a new login, reassign the cleaner on their jobs to link that account.

The private connector snapshot lives in ignored `crm/.local/operations-source.json`; it must never be committed or bundled into frontend assets. `crm/.wrangler/` contains the private local database. The tracked importer contains mapping logic only.

Dry-run: `node crm/scripts/import-operations.mjs`. Apply locally: append `--apply`. The importer checks workbook identity, uses stable source IDs, skips existing records and verifies inserted values. A rerun skipped all 68 imported records. Existing records are never overwritten by this importer; source updates require a reviewed reconciliation.

## Access and checks

Catalogue, directory, onboarding, estate-agent and finance permissions are separate. API reads redact onboarding and finance fields when not authorised, and writes enforce the corresponding permission. Existing edited/custom roles are not silently expanded. The owner can grant the new permissions through Roles & access.

`test-operations.mjs` verifies import counts, independent availability, CRUD permissions, money calculations, catalogue integrity and renaming, one-record booking, payment/review updates, stale bookings, invalid inputs, cancellation/re-clean states and restricted reads/writes. It removes only its disposable local fixtures. Existing authentication/job/evidence regression tests also pass.

All code remains on the isolated CRM branch. The public website, production database, DNS and hosting have not been changed.
