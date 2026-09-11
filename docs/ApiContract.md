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

## 8. Booking Endpoints

### POST /bookings/request

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

### POST /payments/proof

Protected or public with booking token.

Purpose: tourist uploads manual payment proof.

Request:

```json
{
  "bookingId": "uuid",
  "amount": 15000,
  "paymentMethod": "BANK_TRANSFER",
  "referenceNumber": "TXN-12345",
  "proofFileId": "uuid"
}
```

### GET /admin/payments

Protected: `ADMIN`, `FINANCE`.

### PATCH /admin/payments/:id/verify

Protected: `ADMIN`, `FINANCE`.

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
3. `POST /bookings/request`
4. `POST /providers/register`
5. `GET /admin/bookings`
6. `PATCH /admin/bookings/:id/call-confirm`
7. `PATCH /admin/bookings/:id/payment-status`
8. `GET /admin/bookings/:id/provider-suggestions`
9. `PATCH /admin/bookings/:id/assign-providers`
10. `GET /provider/bookings`
11. `PATCH /provider/bookings/:bookingItemId/accept`
12. `PATCH /provider/bookings/:bookingItemId/reject`
