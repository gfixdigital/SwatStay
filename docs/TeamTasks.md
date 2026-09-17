# SwatStay Team Task Board

**Project:** SwatStay backend transition  
**Team:** Project lead, Asim, Ahmed  
**Status:** Backend Sprint 1 in progress  
**Last updated:** 17 September 2026

This is the shared task board for the first backend milestone. Update the status, checklist, notes, and PR link when work changes. Keep backend work inside `services/api` unless a frontend integration is explicitly part of the task.

## Status legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `Blocked:` Add the reason and the person needed to unblock it

## Assignment overview

| Owner | Workstream | Main area | Depends on |
|---|---|---|---|
| Project lead | Backend foundation, database, auth, roles | `services/api`, Prisma schema, environment setup | None |
| Asim | Public catalogue and booking requests | Packages, destinations, booking request APIs | Foundation types and database schema |
| Ahmed | Admin operations and provider workflow | Admin booking actions, assignments, provider APIs | Booking API and shared status model |

---

## Task 1: Project lead

**Title:** Set up NestJS backend foundation, database schema, and access control  
**Priority:** High  
**Status:** `[~]` In progress  
**Owner:** Project lead

### Goal

Prepare the API so the other two developers can build feature modules against a stable database, validation, authentication, and role model.

### Checklist

- [x] Add NestJS configuration loading and environment placeholders.
- [ ] Add `.env.example` without real secrets.
- [ ] Add Prisma and configure Supabase PostgreSQL connection.
- [ ] Convert the required first-sprint entities from `docs/DatabaseSchema.md` into Prisma models and migrations:
  - [ ] Users and roles
  - [ ] Tourist profiles
  - [ ] Destinations
  - [ ] Packages and package items
  - [ ] Bookings and booking items
  - [ ] Team members or support assignments
  - [ ] Providers and provider services
  - [ ] Booking events / audit timeline
- [ ] Add seed data for development only.
- [x] Add global request validation and CORS configuration for web, admin, and provider apps.
- [x] Add shared JWT-ready authentication types, role decorator, and role guard primitive.
- [x] Keep `/health` and add a database-not-connected readiness response.
- [ ] Update API and database docs when field names differ from the planned contracts.

### Acceptance criteria

- `pnpm --filter @swatstay/api typecheck` passes.
- A clean local setup can run migrations and seed data using documented commands.
- Protected routes can identify the user and reject an incorrect role.
- No Supabase service key or other secret is committed.
- Asim and Ahmed can import shared types/status values without duplicating them.

### Handoff to team

- [ ] Share the migration/seed command.
- [ ] Share the auth and role-guard usage example.
- [ ] Share the final booking/provider status enums.
- [ ] Share the API error format.

**PR/branch:** `main, local foundation pass`  
**Notes/blockers:**

- Prisma CLI/client versions are aligned and client generation passes.
- A local `DATABASE_URL` is now configured in the ignored API `.env` file.

---

## Task 2: Asim

**Title:** Build public packages, destinations, and booking-request APIs  
**Priority:** High  
**Status:** `[ ]` Not started  
**Owner:** Asim

### Goal

Replace the tourist website's static package flow with the first real read and write APIs while preserving the existing frontend design.

### Checklist

- [ ] Create Packages module and service.
- [ ] Create Destinations module and service.
- [ ] Implement `GET /packages` with destination, package type, travelers, and date filters where supported.
- [ ] Implement `GET /packages/:slug`.
- [ ] Implement `GET /destinations` and destination detail data if required by the existing pages.
- [ ] Create booking request DTO with validation for:
  - [ ] Tourist/contact details
  - [ ] Package or custom-trip reference
  - [ ] Travel dates
  - [ ] Traveler count
  - [ ] Pickup city
  - [ ] Special requests
  - [ ] Required terms/privacy consent
- [ ] Implement `POST /bookings/request`.
- [ ] Store the initial booking status as `CALL_PENDING`.
- [ ] Store an event for booking creation.
- [ ] Return a safe booking reference without exposing internal database IDs unnecessarily.
- [ ] Add tests for valid requests, invalid dates, missing consent, and unknown package slugs.
- [ ] Integrate the tourist packages/search/booking forms only after the API contract is stable.

### Acceptance criteria

- A tourist can load real package data from the API.
- A valid package or custom-trip request is persisted and receives a booking reference.
- Invalid requests return the documented validation format.
- The request appears in the admin booking queue through the API.
- No payment is taken and no provider is assigned in this task.

### Handoff to Ahmed

- [ ] Share booking request DTO and response examples.
- [ ] Share booking status/event enum names.
- [ ] Share the endpoint for fetching admin-visible booking records.

**PR/branch:** `____________________________`  
**Notes/blockers:**

---

## Task 3: Ahmed

**Title:** Build admin booking operations and provider assignment workflow  
**Priority:** High  
**Status:** `[ ]` Not started  
**Owner:** Ahmed

### Goal

Turn a persisted booking request into a controlled operational workflow for the admin/support team and eligible providers.

### Checklist

- [ ] Create admin bookings module and authorization rules.
- [ ] Implement `GET /admin/bookings` with search and status filters.
- [ ] Implement booking detail retrieval for authorized admin/support members.
- [ ] Implement `PATCH /admin/bookings/:id/assign-support`.
- [ ] Implement `PATCH /admin/bookings/:id/call-confirm`.
- [ ] Store confirmation date, confirming team member, call notes, preferences, and a booking event.
- [ ] Implement payment status update as a status-only frontend-ready operation. Do not verify real payments yet.
- [ ] Implement provider suggestion retrieval grouped by service type:
  - [ ] Hotel
  - [ ] Transport
  - [ ] Guide
  - [ ] Restaurant/meals
  - [ ] Activity
  - [ ] Photography where applicable
- [ ] Implement provider assignment with one selected provider per service type.
- [ ] Prevent provider assignment before the booking reaches the required workflow step.
- [ ] Implement provider accept/reject endpoints and record events.
- [ ] Return a clear timeline for the admin and future traveler/provider dashboards.
- [ ] Add tests for role access, invalid transitions, duplicate assignments, and provider rejection.
- [ ] Integrate admin and provider screens only after endpoint responses are stable.

### Acceptance criteria

- An admin can assign a booking to a support member.
- A booking cannot skip required workflow steps.
- Call confirmation records who confirmed it and when.
- Admin can assign eligible providers by service type.
- Provider can accept or reject an assigned service.
- Every operational action creates a timeline event.
- Tourist/provider dashboards can later consume the same booking state without separate fake records.

### Handoff to team

- [ ] Share workflow transition rules.
- [ ] Share provider assignment response shape.
- [ ] Share event/timeline response shape.
- [ ] Document which operations are still frontend-only: QR, realtime, payment verification, notifications.

**PR/branch:** `____________________________`  
**Notes/blockers:**

---

## Shared integration rules

- [ ] Do not start payment gateway, live QR scanning, realtime chat, email/WhatsApp notifications, or payout automation in this sprint.
- [ ] Do not duplicate booking, payment, provider, or status types across modules.
- [ ] Every status-changing operation must create an event with actor, timestamp, old value, and new value.
- [ ] Admin and support permissions must be checked on the API, not only hidden in the UI.
- [ ] Keep consent, data-deletion requests, and privacy audit records in scope for the authentication/user foundation.
- [ ] Use the endpoint shapes documented in `docs/ApiContract.md`; update that file when an intentional change is made.
- [ ] Each developer opens a separate branch and pull request. Do not commit directly to `main`.

## Definition of done for Backend Sprint 1

- [ ] API starts from documented commands.
- [ ] Database migration and seed complete successfully.
- [ ] Tourist can view packages and submit a booking request.
- [ ] Admin can see the request and assign a support member.
- [ ] Support member can confirm the call with notes.
- [ ] Admin can assign providers by service type.
- [ ] Provider can accept or reject an assignment.
- [ ] Booking timeline records the complete first workflow.
- [ ] Web, admin, provider, and API typechecks pass.
- [ ] API tests cover authorization and invalid workflow transitions.
- [ ] No backend secrets are committed.

## Progress log

| Date | Owner | Update | Next action |
|---|---|---|---|
| 17 Sep 2026 | Team | Backend transition approved; task board created. | Start Task 1 and agree on shared enums. |
| 17 Sep 2026 | Project lead | NestJS global prefix, CORS, validation, throttler, health readiness, shared roles, and Prisma schema starter added. API typecheck and build pass. | Finish Prisma installation, validate schema, then add migrations and auth module. |
| 17 Sep 2026 | Project lead | Supabase database URL and `ap-southeast-1` region configured locally; `.env` confirmed ignored by Git. | Align Prisma CLI/client versions, validate the schema, then run the first migration. |
| 17 Sep 2026 | Project lead | Prisma 7 client generation, API typecheck, and API build pass. Migration reached Supabase but returned a schema-engine connection error; no migration was created. | Verify Supabase connection/network settings, then rerun migration before adding seed data. |
| 17 Sep 2026 | Project lead | Direct Supabase hostname DNS lookup failed from the development machine; Prisma migration did not change the database. | Obtain a resolvable Supabase direct or pooler connection string, then rerun the migration. |
