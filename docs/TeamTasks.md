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
**Status:** `[x]` Complete  
**Owner:** Project lead

### Goal

Prepare the API so the other two developers can build feature modules against a stable database, validation, authentication, and role model.

### Checklist

- [x] Add NestJS configuration loading and environment placeholders.
- [ ] Add `.env.example` without real secrets.
- [x] Add Prisma and configure Supabase PostgreSQL connection.
- [x] Convert the required first-sprint entities from `docs/DatabaseSchema.md` into Prisma models and migrations:
  - [x] Users and roles
  - [x] Tourist profiles
  - [x] Destinations
  - [x] Packages and package items
  - [x] Bookings and booking items
  - [x] Team members or support assignments
  - [x] Providers and provider services
  - [x] Booking events / audit timeline
- [x] Remove development seed data before real verification.
- [x] Add global request validation and CORS configuration for web, admin, and provider apps.
- [x] Add JWT authentication endpoints and global role-guard foundation for tourist, admin, support, and provider users.
- [x] Keep `/health` and add a database readiness check.
- [ ] Update API and database docs when field names differ from the planned contracts.

### Acceptance criteria

- `pnpm --filter @swatstay/api typecheck` passes.
- A clean setup can run migrations against an explicitly configured database; no demo data is inserted automatically.
- Protected routes can identify the user and reject an incorrect role.
- No Supabase service key or other secret is committed.
- Asim and Ahmed can import shared types/status values without duplicating them.

### Handoff to team

- [x] Share the migration command; no seed command is available after demo-data cleanup.
- [x] Share the auth and role-guard usage example.
- [x] Share the final booking/provider status enums.
- [x] Share the API error format.

**PR/branch:** `main, backend foundation complete`  
**Notes/blockers:**

- Prisma client generation, migration, and seed pass through the regional pooler connection.
- A local `DATABASE_URL` is configured in the ignored API `.env` file.
- Demo records and the development seed script were removed on 17 Sep 2026. Create real accounts through signup or an approved deployment process.

---

## Task 2: Asim

**Title:** Build public packages, destinations, and booking-request APIs  
**Priority:** High  
**Status:** `[ ]` Not started  
**Owner:** Asim

### Goal

Replace the tourist website's static package flow with the first real read and write APIs while preserving the existing frontend design.

### Checklist

- [x] Create Packages module and service.
- [x] Create Destinations module and service.
- [x] Implement public `GET /packages`, `GET /packages/:slug`, and `GET /destinations`.
- [ ] Create booking request DTO with validation for:
  - [ ] Tourist/contact details
  - [ ] Package or custom-trip reference
  - [ ] Travel dates
  - [ ] Traveler count
  - [ ] Pickup city
  - [ ] Special requests
  - [ ] Required terms/privacy consent
- [x] Implement `POST /bookings`.
- [x] Store the initial booking status as `CALL_PENDING`.
- [x] Store an event and safe booking reference for booking creation.
- [x] Add runtime coverage for valid requests, empty package catalog, and route behavior.
- [x] Integrate the tourist booking form with API loading, errors, and success reference.

### Acceptance criteria

- A tourist can load real package data from the API.
- A valid package or custom-trip request is persisted and receives a booking reference.
- Invalid requests return the documented validation format.
- The request appears in the admin booking queue through the API.
- No payment is taken and no provider is assigned in this task.

### Progress update

- Package and booking APIs are implemented in `services/api/src/packages` and `services/api/src/bookings`.
- The tourist booking form now submits to the API. The database is intentionally empty after demo-data cleanup, so packages must be created through the future admin package workflow before package cards appear.

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
| 17 Sep 2026 | Project lead | Local Supabase environment is configured; `.env` is confirmed ignored by Git. The regional connection must use the Supabase pooler hostname. | Obtain a resolvable regional pooler URL, then rerun the first migration. |
| 17 Sep 2026 | Project lead | Prisma 7 client generation, API typecheck, and API build pass. Direct migration is blocked by the database host connection; no migration was created. | Verify the regional pooler connection, then rerun migration before adding seed data. |
| 17 Sep 2026 | Project lead | Direct Supabase hostname DNS lookup failed from the development machine; Prisma migration did not change the database. | Obtain a resolvable Supabase direct or pooler connection string, then rerun the migration. |
| 17 Sep 2026 | Project lead | Regional Supabase pooler connection works. Prisma client generation passed and `backend_foundation` migration was applied successfully. | Add development seed data, then continue with the auth/database service modules. |
| 17 Sep 2026 | Project lead | Prisma service, seed data, JWT signup/login/me, bearer guard, global role guard, database readiness, and runtime health checks completed. | Handoff stable foundation to Asim and Ahmed. |
| 17 Sep 2026 | Project lead | Auth hardening completed: database-backed sessions, refresh, logout, signup consent enforcement, account checks, privacy record models, and auth smoke test passed. | Begin package and booking API integration with Asim and Ahmed. |
| 17 Sep 2026 | Project lead | Shared integration task completed: profile read/update, consent history, deletion requests, request IDs, API response helpers, reusable booking audit service, migration, and authenticated endpoint smoke tests. | Integrate Asim and Ahmed feature modules when their branches are ready. |
| 17 Sep 2026 | Project lead | Public intake and support APIs completed, migrated, and smoke-tested for contact, custom trip, provider registration, tickets, and messages. | Push the task and hand off endpoint contracts to the team. |
| 17 Sep 2026 | Project lead | Finance foundation completed: payment proof submission/review, per-service commission calculation, provider settlement records, role-protected payout transitions, provider finance view, audit events, and Supabase migration. | Connect finance UI to these endpoints after the admin/provider frontend branches are ready. |
