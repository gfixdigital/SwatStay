# SwatStay Future Features

## Status guide

- Frontend preview implemented: Works locally in `apps/web` without an API or account.
- Backend pending: Requires NestJS, database storage, authentication, external services, or operational workflows.

## Frontend previews implemented

| Feature | Current behavior | Storage or browser capability |
| --- | --- | --- |
| Save package | Tourists can save and remove packages without login and review them on `/saved-packages`. | `localStorage` |
| Recently viewed packages | Package detail visits are stored on the device and up to four are shown on the homepage. | `localStorage` |
| Share package | Uses the Web Share API when supported, copies the link as a fallback, and provides WhatsApp sharing. | Browser APIs |
| Pickup city suggestions | Booking and custom trip forms suggest Islamabad, Rawalpindi, Peshawar, Lahore, Mingora, and Saidu Sharif while allowing custom entries. | Frontend form only |
| Print itinerary | Package details include a browser print layout with package, service, itinerary, cancellation, and contact information. | Browser print |
| Currency preview | Package prices can be estimated in PKR, USD, or CNY using clearly identified static approximate rates. | `localStorage` |
| Language foundation | English, Urdu, and Chinese preferences translate navigation and selected CTA labels, with English as fallback. | `localStorage` |
| Admin QR voucher flow | Admin can create, activate, view, download, revoke, preview provider delivery, simulate scan validation, and inspect audit history. | `localStorage` in `apps/admin` |
| Provider operations flow | Provider profiles can preview service-specific availability, assignments, code validation, service outcomes, issue reports, support, and settlement status for hotel, transport, guide, restaurant, photographer, and activity services. | Browser component state in `apps/provider` |

## Backend-dependent features still pending

- Account-synced saved packages and recently viewed history
- Live exchange rates and currency-aware checkout
- Complete English, Urdu, and Chinese content translation managed by operations
- Server-generated PDF itineraries and downloadable booking vouchers
- Pickup location validation, route pricing, and dispatch availability
- Real package sharing analytics
- Package, provider, hotel, transport, restaurant, guide, and activity management
- NestJS API integration
- Supabase PostgreSQL and Prisma persistence
- Authentication and account synchronization
- Payment gateway and payment proof workflows
- Real support chat and emergency case handling
- Real signed QR vouchers, authorized provider scanning, cross-application delivery, and realtime service updates
- Weather and road condition integrations
- Shared admin/provider records, authenticated permissions, and real-time operational workflows

## Current boundary

The tourist website remains frontend-only. The previews in this file must not be treated as confirmed bookings, live pricing, translated legal content, or server-backed user records.

## Frontend cleanup completed

- Admin payment reviews persist in the browser, require a rejection reason, and update the linked booking preview.
- Admin provider approval decisions require a confirmation path, preserve a browser review log, and show document and photo status.
- Destination edits validate required content and unique slugs, preserve popular services, and persist locally.
- The media library supports local preview uploads, guarded deletion of unassigned files, copy feedback, and persistent browser state.
- Translation drafts, publishing guardrails, payout payment references, global search results, notification read state, and modal keyboard focus handling are implemented as frontend previews.
- Tourist login now explains that password recovery is unavailable until real accounts are connected, and route-specific metadata was expanded.

See `docs/FutureFixes.md` for work intentionally deferred until the NestJS API, authenticated roles, and secure storage exist.
