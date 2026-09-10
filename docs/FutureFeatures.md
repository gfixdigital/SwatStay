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
- Real QR vouchers and authorized provider scanning
- Weather and road condition integrations
- Admin and provider operational workflows

## Current boundary

The tourist website remains frontend-only. The previews in this file must not be treated as confirmed bookings, live pricing, translated legal content, or server-backed user records.
