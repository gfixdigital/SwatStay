# SwatStay Booking Workflow and Frontend Handoff Map

## Required operational order

Each booking moves through one ordered workflow. The admin frontend blocks the next operational action until the prerequisite has been completed in its browser preview.

1. Booking inbox, owned by Operations
2. Call confirmation, owned by Support
3. Payment review, owned by Finance
4. Provider assignment, owned by Operations
5. Trip voucher preparation, owned by Operations
6. Active-trip support and close, owned by Support

The current frontend rules are:

- Finance cannot review a payment while the booking call is still pending.
- Provider assignment is locked until Finance has marked the booking payment as verified.
- A voucher can be generated only for an active booking, which is set after required provider assignment is confirmed.
- A booking can be marked completed only while it is active.
- A trip-change request is applied only after approval. The preview updates the matching booking's relevant travel field and records the request log.

## Tourist website to admin mapping

| Tourist-facing area | Admin area | Current frontend behavior | Backend requirement |
| --- | --- | --- | --- |
| Booking form | Booking inbox | Admin sample data shows the same booking workflow fields | Create a single booking record and reference after submission |
| Call-confirmed status | Call queue and booking detail | Admin can record call notes and mark confirmation | Persist call outcome, notes, callback, and audit actor |
| Payment proof submission | Payments and booking detail | Finance preview updates linked admin booking payment status | Secure upload, payment record, verification event, and traveler notification |
| Request a trip change | Trip change requests | Admin approval and apply action updates the matching preview booking | Persist change requests, approval log, pricing/provider impact, and traveler notification |
| Support request | Support tickets | Admin support queue uses sample tickets | Create ticket from the traveler request and sync replies/status |
| Service/voucher display | Provider assignment and vouchers | Voucher UI is a prototype with local state and simulated scans only | Signed voucher, provider authorization, event log, and privacy-scoped provider access |
| Traveler trip dashboard | Booking detail and voucher pages | Both describe the same intended booking lifecycle | Shared API so status, payment, services, and documents update across apps |

## Admin-only areas

These are intentionally not shown in the traveler dashboard because they are internal or supplier-facing operations: provider approvals, provider commission/payouts, content and media management, languages, team management, audit logs, and admin settings. They remain useful because they prepare or govern the traveler-facing service.

## Current frontend boundary

`apps/web` runs at `localhost:3000` and `apps/admin` at `localhost:3001`. Each app stores preview state in its own browser localStorage origin. Therefore, an action in one app does not update the other app live today. The screens use aligned sample concepts and booking references, but real synchronization must wait for the NestJS API and database.

## Backend implementation requirement

The NestJS API must enforce these same transitions server-side. UI disabled states are a convenience, not a security rule. The API should reject skipped, duplicate, unauthorized, or out-of-order transitions and append an immutable audit event for every permitted transition.
