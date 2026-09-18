# SwatStay API Contract

## 1. Purpose

This file defines the first API contract for the SwatStay tourism platform.

Frontend apps will use fake data first, then connect to these endpoints one by one.

Frontend ownership:

- `apps/web`: Next.js tourist website
- `apps/admin`: React + TypeScript + Vite admin panel
- `apps/provider`: React + TypeScript + Vite provider dashboard
- `apps/mobile`: mobile client later

Apps using this API:

- Tourist website
- Admin dashboard
- Provider dashboard
- Mobile app later

Backend:

- NestJS
- Prisma
- Supabase PostgreSQL

Base URL for MVP:

```txt
https://api-swat.gfixdigital.com/api/v1
```

Local development:

```txt
http://localhost:4000/api/v1
```

## 2. API Rules

- All responses must use JSON.
- All protected routes require Bearer token auth.
- Public package and destination routes do not require auth.
- Admin routes require the exact role allowed for that module. Navigation visibility is not authorization.
- Provider routes require `PROVIDER` role.
- Finance routes require `ADMIN` or `FINANCE` role.

Planned admin access:

| Role | Modules |
|---|---|
| `ADMIN` | Full admin panel, team access, settings, and audit logs |
| `OPERATIONS` | Bookings, calls, packages, destinations, providers, assignments, support, content, and media |
| `SUPPORT` | Dashboard, call queue, booking details, traveler change requests, and support tickets |
| `FINANCE` | Payments, commissions, payouts, and booking payment summaries |
| `QA` | Read-only workflow and content preview |

NestJS guards must enforce these permissions on every protected endpoint. The admin frontend may hide unavailable navigation and actions for usability, but frontend hiding must never be treated as security.
- Use pagination for list endpoints.
- Use clear status values instead of booleans for booking lifecycle.

### Future rate limiting and abuse protection

Rate limits must be enforced by the API gateway and NestJS guards, never by frontend checks alone. Initial MVP targets:

- Public read endpoints: 120 requests per minute per IP.
- Contact, booking, custom-trip, provider-registration, login, and password-reset endpoints: 5 requests per 15 minutes per IP plus a per-identifier limit where applicable.
- Authenticated mutation endpoints: 60 requests per minute per user.
- QR scan and voucher-code validation: 10 attempts per 5 minutes per provider account and device session.
- Email, WhatsApp, and notification send actions: queued server-side with per-booking and per-recipient limits.

The API should return HTTP `429` with a safe retry-after value. CAPTCHA or equivalent bot verification must be verified on the server for public forms after the provider is selected. Frontend checkboxes are only a visual preview and provide no protection.

### Public intake and support endpoints

The first backend implementation includes these routes. Public intake routes require validated Terms and Privacy consent and are rate limited.

```txt
POST /contact
POST /custom-trips/request
POST /providers/register
POST /support/tickets              protected
GET  /support/tickets              protected
POST /support/tickets/:id/messages protected
GET  /users/me                     protected
PATCH /users/me                    protected
GET  /privacy/consents             protected
POST /privacy/data-deletion        protected
```

Contact, custom-trip, and provider registration responses return a frontend-safe reference and status. Email, WhatsApp, file storage, realtime chat, and admin review notifications remain pending backend work.

## 3. Standard Response Shape

Success:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

List:

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number is required"
    }
  ]
}
```

## 4. Roles

```txt
TOURIST
PROVIDER
ADMIN
SUPPORT
FINANCE
```

## 5. Auth Endpoints

### POST /auth/signup

Purpose: create tourist account.

Request:

```json
{
  "fullName": "Adnan Khan",
  "email": "adnan@example.com",
  "phone": "+923001234567",
  "password": "StrongPassword123",
  "preferredLanguage": "en"
}
```

### POST /auth/login

Request:

```json
{
  "email": "adnan@example.com",
  "password": "StrongPassword123"
}
```

Response data:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "fullName": "Adnan Khan",
    "email": "adnan@example.com",
    "role": "TOURIST"
  }
}
```

### GET /auth/me

Protected.

Purpose: get current logged-in user.

## 6. Destinations Endpoints

### GET /destinations

Public.

Query:

```txt
?search=kalam&language=en
```

Response item:

```json
{
  "id": "uuid",
  "name": "Kalam",
  "slug": "kalam",
  "shortDescription": "Mountain valley destination in Swat",
  "imageUrl": "https://...",
  "bestFor": ["Families", "Couples", "Hiking"],
  "isActive": true
}
```

### GET /destinations/:slug

Public.

## 7. Package Endpoints

### GET /packages

Public.

Query:

```txt
?destination=kalam&type=COUPLE&tier=STANDARD&minPrice=20000&maxPrice=80000&page=1&limit=20
```

Response item:

```json
{
  "id": "uuid",
  "title": "Couple Standard - Kalam 3 Days",
  "slug": "couple-standard-kalam-3-days",
  "destination": "Kalam",
  "type": "COUPLE",
  "tier": "STANDARD",
  "durationDays": 3,
  "durationNights": 2,
  "startingPrice": 45000,
  "currency": "PKR",
  "imageUrl": "https://...",
  "includedServices": ["Hotel", "Breakfast", "Dinner", "Transport", "Guide"]
}
```

### GET /packages/:slug

Public.

Response data:

```json
{
  "id": "uuid",
  "title": "Couple Standard - Kalam 3 Days",
  "slug": "couple-standard-kalam-3-days",
  "destination": {
    "name": "Kalam",
    "slug": "kalam"
  },
  "type": "COUPLE",
  "tier": "STANDARD",
  "description": "A call-confirmed Swat package for couples.",
  "durationDays": 3,
  "durationNights": 2,
  "startingPrice": 45000,
  "currency": "PKR",
  "gallery": [],
  "itinerary": [],
  "includedServices": [],
  "addons": [],
  "cancellationPolicy": "Advance payment is refundable according to policy."
}
```

### POST /admin/packages

Protected: `ADMIN`, `OPERATIONS`.

Purpose: create package.

### PATCH /admin/packages/:id

Protected: `ADMIN`, `OPERATIONS`.

Purpose: update package.

### GET /admin/destinations

Protected: `ADMIN`, `OPERATIONS`. Returns the destination catalog for package editors.

### POST /admin/destinations

Protected: `ADMIN`, `OPERATIONS`. Creates a destination with a unique lowercase slug.

The payload may include `description`, `shortDescription`, `fullDescription`, `bestFor`, `travelTime`, `popularServices`, `imageUrl`, `gallery`, `seoTitle`, and `seoDescription`.

### PATCH /admin/destinations/:id

Protected: `ADMIN`, `OPERATIONS`. Updates destination content, media references, and SEO metadata. The change is recorded in the audit log.

### PATCH /admin/destinations/:id/active

Protected: `ADMIN`, `OPERATIONS`. Body: `{ "isActive": true|false }`. Activates or archives a destination and records the change in the audit log.

### GET /admin/packages

Protected: `ADMIN`, `OPERATIONS`. Returns active and inactive packages with destination and included service items.

### POST /admin/packages

Protected: `ADMIN`, `OPERATIONS`. Creates a package with destination, pricing, package type, tier, optional media/SEO/itinerary metadata, and service items.

### PATCH /admin/packages/:id/active

Protected: `ADMIN`, `OPERATIONS`. Activates or archives a package without deleting its record.

## 8. Booking Endpoints

### POST /bookings

Public or tourist protected.

Purpose: tourist submits booking request. This does not book providers yet.

Request:

```json
{
  "packageId": "uuid",
  "fullName": "Adnan Khan",
  "phone": "+923001234567",
  "whatsapp": "+923001234567",
  "email": "adnan@example.com",
  "country": "Pakistan",
  "preferredLanguage": "en",
  "travelStartDate": "2026-10-10",
  "travelEndDate": "2026-10-12",
  "travelersCount": 2,
  "travelerType": "COUPLE",
  "tier": "STANDARD",
  "pickupCity": "Islamabad",
  "specialRequests": "Need private transport",
  "preferredPaymentMethod": "BANK_TRANSFER"
}
```

Initial status:

```txt
REQUEST_SUBMITTED
```

Response:

```json
{
  "success": true,
  "message": "Booking request received. Our team will call the tourist before providers are booked.",
  "data": {
    "bookingId": "uuid",
    "status": "REQUEST_SUBMITTED"
  }
}
```

### GET /tourist/bookings

Protected: `TOURIST`.

Purpose: tourist sees own bookings.

### GET /tourist/bookings/:id

Protected: `TOURIST`.

Purpose: tourist sees booking detail and itinerary.

### POST /tourist/bookings/:id/change-requests

Protected: `TOURIST` or public with a valid booking token.

Purpose: tourist requests a booking change. Submitting this request never changes the booking automatically.

Request:

```json
{
  "changeType": "ADD_ACTIVITY",
  "message": "Please call me about adding a guided activity on Day 2.",
  "preferredCallbackAt": "2026-10-10T15:30:00+05:00"
}
```

### GET /admin/bookings/:id/change-requests

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

Purpose: admin sees pending and completed traveler change requests for a booking.

### PATCH /admin/change-requests/:id

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

Purpose: update request status, callback outcome, and resolution notes after speaking with the tourist.

## 9. Admin Booking Endpoints

### GET /admin/bookings

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

Query:

```txt
?status=CALL_PENDING&page=1&limit=20
```

### GET /admin/bookings/:id

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

### PATCH /admin/bookings/:id/assignment

Protected: `ADMIN`, `OPERATIONS`.

Assigns, reassigns, or unassigns the internal team owner for tourist follow-up. The API must add an immutable assignment history entry and notify the newly assigned user.

Request:

```json
{
  "assignedTeamMemberId": "uuid-or-null",
  "reason": "Urdu confirmation call and vegetarian meal follow-up"
}
```

### PATCH /admin/bookings/:id/call-confirm

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

Purpose: support team confirms tourist by call.

Request:

```json
{
  "callStatus": "CONFIRMED",
  "callNotes": "Tourist confirmed 2 people, private transport, 3 days.",
  "confirmedByUserId": "uuid"
}
```

New status:

```txt
TOURIST_CONFIRMED
```

### PATCH /admin/bookings/:id/payment-status

Protected: `ADMIN`, `FINANCE`.

Request:

```json
{
  "paymentStatus": "ADVANCE_PAID",
  "amountPaid": 15000,
  "paymentMethod": "BANK_TRANSFER",
  "referenceNumber": "TXN-12345"
}
```

### GET /admin/bookings/:id/provider-suggestions

Protected: `ADMIN`, `OPERATIONS`.

Purpose: system suggests providers for hotel, transport, guide, meals, and activities.

Response item:

```json
{
  "serviceType": "HOTEL",
  "suggestions": [
    {
      "providerId": "uuid",
      "providerName": "Pine View Hotel Kalam",
      "location": "Kalam",
      "price": 18000,
      "commissionRate": 12,
      "capacityAvailable": 2,
      "availabilityStatus": "AVAILABLE",
      "score": 86
    }
  ]
}
```

### PATCH /admin/bookings/:id/assign-providers

Protected: `ADMIN`, `OPERATIONS`.

Request:

```json
{
  "assignments": [
    {
      "serviceType": "HOTEL",
      "providerId": "uuid",
      "providerServiceId": "uuid",
      "price": 18000,
      "commissionRate": 12
    },
    {
      "serviceType": "TRANSPORT",
      "providerId": "uuid",
      "providerServiceId": "uuid",
      "price": 25000,
      "commissionRate": 10
    }
  ]
}
```

New status:

```txt
PROVIDER_PENDING
```

## 10. Provider Endpoints

### POST /providers/register

Public.

Purpose: provider registration request.

Request:

```json
{
  "businessName": "Pine View Hotel Kalam",
  "ownerName": "Provider Owner",
  "phone": "+923001234567",
  "whatsapp": "+923001234567",
  "email": "provider@example.com",
  "serviceCategory": "HOTEL",
  "location": "Kalam",
  "address": "Main Kalam Road",
  "priceRangeMin": 8000,
  "priceRangeMax": 30000,
  "capacity": 20,
  "availabilityNotes": "Available in season",
  "documents": [],
  "photos": []
}
```

Initial status:

```txt
PENDING_REVIEW
```

### GET /admin/providers

Protected: `ADMIN`, `OPERATIONS`.

### PATCH /admin/providers/:id/approve

Protected: `ADMIN`, `OPERATIONS`.

### PATCH /admin/providers/:id/reject

Protected: `ADMIN`, `OPERATIONS`.

Request:

```json
{
  "reason": "Documents are incomplete"
}
```

### GET /provider/bookings

Protected: `PROVIDER`.

Purpose: provider sees assigned bookings.

### PATCH /provider/bookings/:bookingItemId/accept

Protected: `PROVIDER`.

### PATCH /provider/bookings/:bookingItemId/reject

Protected: `PROVIDER`.

Request:

```json
{
  "reason": "Unavailable on selected dates"
}
```

## 11. Payment Endpoints

### POST /bookings/:bookingId/payment-proof

Protected: booking owner. This first backend foundation accepts a payment method, amount, optional transaction reference, optional proof URL placeholder, and notes. Real file upload is a later storage task.

### GET /admin/payments

Protected: `ADMIN`, `FINANCE`.

### PATCH /admin/payments/:id/review

Protected: `ADMIN`, `FINANCE`. Accepts `VERIFIED` or `REJECTED` plus an optional review note.

## 12. File Endpoints

### POST /files/upload-url

Protected.

Purpose: create upload URL for Cloudflare R2 or Supabase Storage.

Request:

```json
{
  "fileName": "hotel-photo.jpg",
  "mimeType": "image/jpeg",
  "folder": "providers"
}
```

Response:

```json
{
  "uploadUrl": "https://...",
  "fileId": "uuid",
  "publicUrl": "https://..."
}
```

## 13. Notification Endpoints

### GET /admin/notifications

Protected.

### PATCH /admin/notifications/:id/read

Protected.

Email events:

- Booking request submitted
- Tourist call confirmed
- Payment proof submitted
- Providers assigned
- Provider accepted
- Provider rejected
- Final itinerary ready

## 14. Support Endpoints

### POST /support/tickets

Protected or public with booking token.

Request:

```json
{
  "bookingId": "uuid",
  "issueType": "PAYMENT_QUESTION",
  "message": "Please confirm whether my updated receipt is readable.",
  "priority": "NORMAL"
}
```

### GET /admin/support/tickets

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

### PATCH /admin/support/tickets/:id

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`.

## 15. Booking Status Values

```txt
DRAFT
REQUEST_SUBMITTED
CALL_PENDING
TOURIST_CONFIRMED
PAYMENT_PENDING
ADVANCE_PAID
FULLY_PAID
PROVIDER_SELECTION
PROVIDER_PENDING
CONFIRMED
ACTIVE
COMPLETED
CANCELLED
REFUNDED
REQUIRES_ADMIN_ACTION
```

## 16. Provider Status Values

```txt
PENDING_REVIEW
APPROVED
REJECTED
SUSPENDED
```

## 17. Package Types

```txt
SOLO
COUPLE
FAMILY
GROUP
SHARING
PRIVATE
```

## 18. Package Tiers

```txt
BASIC
STANDARD
PREMIUM
LUXURY
```

## 19. Service Types

```txt
HOTEL
TRANSPORT
GUIDE
HIKING_GUIDE
RESTAURANT
PHOTOGRAPHY
ACTIVITY
```

## 20. First Integration Order

Connect APIs in this order:

1. `GET /packages`
2. `GET /packages/:slug`
3. `POST /bookings`
4. `POST /providers/register`
5. `GET /admin/bookings`
6. `PATCH /admin/bookings/:id/call-confirm`
7. `PATCH /admin/bookings/:id/payment-status`
8. `GET /admin/bookings/:id/provider-suggestions`
9. `PATCH /admin/bookings/:id/assign-providers`
10. `GET /provider/bookings`
11. `PATCH /provider/bookings/:bookingItemId/accept`
12. `PATCH /provider/bookings/:bookingItemId/reject`

## 21. Planned Service Voucher Endpoints

These contracts document the approved QR flow only. They are not implemented yet.

### POST /admin/bookings/:bookingId/vouchers

Protected: `ADMIN`, `OPERATIONS`.

Creates a draft voucher from confirmed booking items and provider assignments.

### PATCH /admin/vouchers/:voucherId/activate

Protected: `ADMIN`, `OPERATIONS`.

Activates the voucher and prepares service-scoped traveler and provider notifications.

### GET /admin/vouchers

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`, `QA`.

Supports booking, tourist, status, provider, service type, and travel-date filters.

### GET /admin/vouchers/:voucherId

Protected: `ADMIN`, `OPERATIONS`, `SUPPORT`, `QA`.

Returns voucher metadata, assigned service items, delivery status, scan history, and audit events. It does not return raw identity documents.

### POST /admin/vouchers/:voucherId/deliver

Protected: `ADMIN`, `OPERATIONS`.

Queues traveler dashboard/email delivery and separate provider assignment notifications.

### PATCH /admin/vouchers/:voucherId/revoke

Protected: `ADMIN`, `OPERATIONS`.

Requires a reason and retains previous handoff history.

### GET /traveler/bookings/:bookingId/voucher

Protected: booking owner.

Returns the active traveler-facing trip voucher and service progress.

### POST /provider/vouchers/scan

Protected: approved provider user.

Accepts the signed voucher reference and the provider's selected service action. The API derives provider identity from authentication, validates assignment and voucher status, records the result, and never trusts a provider ID sent by the browser.

The scan creates a validated service-handoff session. It does not complete the service by itself.

### POST /provider/service-handoffs/:handoffId/complete

Protected: assigned provider user.

Records the actual service outcome after a successful voucher validation. The request includes only the assigned completion method, an optional provider note, and optional traveler acknowledgement. The API must reject completion when the provider is not assigned, the voucher is expired or revoked, or the service was already completed.

### POST /provider/service-handoffs/:handoffId/issues

Protected: assigned provider user.

Creates a service exception instead of completing the handoff. Required fields: issue type and provider note. Optional fields: evidence file IDs and preferred callback time. This endpoint changes the service to `ISSUE_REPORTED`, creates an auditable support/operations task, and must never be used as a cancellation shortcut.

### GET /provider/bookings/:bookingId/voucher-access

Protected: assigned provider user.

Returns only the traveler and service fields required for that provider's assignment.

## Finance foundation

### POST /bookings/:bookingId/payment-proof

Protected: booking owner. Accepts amount, method, optional transaction reference, proof URL placeholder, and notes. Creates a `PROOF_SUBMITTED` payment record and updates the booking payment status.

### GET /admin/payments

Protected: `ADMIN`, `FINANCE`. Lists payment submissions for review.

### PATCH /admin/payments/:paymentId/review

Protected: `ADMIN`, `FINANCE`. Accepts `VERIFIED` or `REJECTED` plus an optional review note and records the reviewer audit event.

### POST /admin/finance/commissions

Protected: `ADMIN`, `FINANCE`. Creates a per-service commission from gross amount and rate, calculates provider settlement, and creates a pending payout.

### GET /admin/finance/bookings/:bookingId

Protected: `ADMIN`, `FINANCE`. Returns payment, commission, provider, and payout records for one booking.

### GET /admin/payouts and PATCH /admin/payouts/:payoutId/status

Protected: `ADMIN`, `FINANCE`. Payout transitions are `PENDING -> APPROVED -> PROCESSING -> PAID`; failed transfers can move `FAILED -> PROCESSING`. Invalid transitions are rejected.

### GET /provider/finance

Protected: `PROVIDER`. Returns only the authenticated provider's commission and payout records.
