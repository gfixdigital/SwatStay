# SwatStay Final Project Plan

## 1. Project Start Decision

Project will start with a **frontend-first prototype and API contract approach**.

The team will first create the complete visual prototype, then convert it into the real frontend code. Backend APIs will be planned at the same time using clear endpoint contracts, but full backend integration will happen step by step after the main screens are ready.

This approach is best because:

- Sana can start frontend work immediately.
- Full stack developers can prepare architecture, database, API contracts, and backend modules in parallel.
- The team can review the product flow visually before writing too much backend logic.
- The frontend can use fake data first, then connect to real APIs later.

## 2. First Project Rule

Before development starts, everyone should clone the same project repository and use the same design files.

Required files:

- `Design.md`
- `Final_Project_Plan.md`
- `ApiContract.md` later
- `DatabaseSchema.md` later
- `SprintPlan.md` later

Everyone must follow `Design.md` so the product does not look like a generic AI SaaS website.

Design restrictions:

- No purple gradients
- No vague hero text
- No fake counters
- No fake reviews
- No fake metrics
- No emoji icons
- No cursor animations
- No excessive scroll animations
- No pill-shaped buttons
- No AI copy
- No made with AI label
- No em dashes

## 3. Recommended Project Structure

Use one monorepo workspace.

```txt
swatstay-platform/
  apps/
    web/
    admin/
    provider/
    mobile/
  services/
    api/
  packages/
    ui/
    types/
    config/
  prisma/
    schema.prisma
  docs/
    Design.md
    Final_Project_Plan.md
    ApiContract.md
    DatabaseSchema.md
    SprintPlan.md
  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  turbo.json
```

## 4. Technology Stack

| Area | Technology |
| --- | --- |
| Tourist website | Next.js or React with TypeScript |
| Admin dashboard | Next.js or React with TypeScript |
| Provider dashboard | Next.js or React with TypeScript |
| Backend | NestJS |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Email | Resend |
| File storage | Cloudflare R2 or Supabase Storage |
| Frontend hosting | Vercel |
| Backend hosting | Railway |
| Mobile app | React Native or Flutter later |
| Monorepo | pnpm workspace + Turborepo |

Recommended frontend choice:

Use **Next.js with TypeScript** for public website because SEO matters for tourism pages.

## 5. Domain Plan

For MVP, use GFix subdomains.

| Area | MVP Domain |
| --- | --- |
| Tourist website | `swat.gfixdigital.com` |
| Admin dashboard | `admin-swat.gfixdigital.com` |
| Provider dashboard | `provider-swat.gfixdigital.com` |
| Backend API | `api-swat.gfixdigital.com` |

Later, when the product becomes a separate brand:

| Area | Future Domain |
| --- | --- |
| Tourist website | `swatstay.com` |
| Admin dashboard | `admin.swatstay.com` |
| Provider dashboard | `provider.swatstay.com` |
| Backend API | `api.swatstay.com` |

## 6. System Architecture

Do not start with microservices.

Start with a **modular monolith backend** using NestJS. This means one backend project with separate clean modules.

```txt
Frontend apps
  web
  admin
  provider
  mobile later
        |
        v
NestJS Backend API
        |
        v
Supabase PostgreSQL
```

Only backend should connect to the database.

Frontend apps should call backend APIs.

## 7. Backend Modules

Create these backend modules inside NestJS:

| Module | Purpose |
| --- | --- |
| Auth | Login, signup, roles, permissions |
| Users | Tourist, provider, admin, support, finance users |
| Packages | Package types, tiers, prices, included services |
| Destinations | Swat, Kalam, Malam Jabba, Bahrain, Madyan |
| Providers | Provider registration, verification, services |
| Bookings | Booking request, call confirmation, booking lifecycle |
| Provider Matching | System suggests providers, admin confirms |
| Payments | Advance/full payment, payment status |
| Commissions | GFix commission per booking |
| Payouts | Provider payout tracking |
| Notifications | Email first, SMS/WhatsApp later |
| Files | Provider documents, package images, payment proofs |
| Support | Tickets, complaints, emergency support |
| Reviews | Tourist feedback later |
| Reports | Admin reports and analytics |

## 8. Main Apps

| App | Purpose | Build Priority |
| --- | --- | --- |
| Tourist website | Public package browsing and booking requests | First |
| Admin dashboard | GFix team controls bookings and providers | First |
| Provider dashboard | Providers receive and manage bookings | First |
| Mobile app | Tourist/provider mobile experience | Later |

## 9. Booking Flow

The booking flow must stay admin-controlled in MVP.

1. Tourist visits website.
2. Tourist selects package.
3. Tourist submits booking request.
4. GFix support team calls tourist.
5. Tourist confirms details.
6. Payment or advance is confirmed.
7. System suggests providers.
8. Admin reviews and confirms providers.
9. Providers receive notification.
10. Providers accept or reject booking.
11. Final itinerary is sent to tourist.

## 10. Team Members

| Member | Role |
| --- | --- |
| Adnan | Full stack, architecture, backend lead, final review |
| Ahmed | Full stack, provider module, notifications, payments |
| Asim | Full stack, admin module, admin APIs, dashboard logic |
| Sana | Frontend developer, tourist website, responsive UI, design implementation |
| Samreen | Testing team |
| Wohaib | Testing team |

## 11. Team Responsibilities

| Area | Owner |
| --- | --- |
| Architecture | Adnan |
| Repository setup | Adnan |
| Database schema | Adnan + Ahmed |
| API contracts | Adnan + Asim |
| Tourist website frontend | Sana |
| Shared UI components | Sana + Asim |
| Admin dashboard frontend | Asim |
| Admin backend APIs | Asim |
| Provider dashboard frontend | Ahmed |
| Provider backend APIs | Ahmed |
| Booking backend flow | Adnan |
| Payment status module | Ahmed |
| Email notifications | Ahmed |
| Deployment | Adnan |
| Development team testing | Adnan, Ahmed, Asim, Sana |
| Testing team QA | Samreen, Wohaib |
| Final QA review | Adnan + Samreen + Wohaib |

## 12. Sana First Task

Sana will start first because she is frontend-focused.

### Sana Task 1: Tourist Website UI Foundation

Sana should create the first frontend screens using `Design.md`.

Screens:

1. Homepage
2. Package listing page
3. Package detail page
4. Booking request form
5. Booking request success page

Requirements:

- Follow the design system from `Design.md`.
- Use realistic Swat tourism layout.
- Use fake data only for now.
- Do not connect APIs yet.
- Make all pages responsive.
- Use clean components that can later be reused.
- Avoid all anti-slop design items listed in `Design.md`.

Suggested folder:

```txt
apps/web/
  app/
    page.tsx
    packages/page.tsx
    packages/[slug]/page.tsx
    booking/success/page.tsx
  components/
    Header.tsx
    PackageCard.tsx
    DestinationCard.tsx
    BookingForm.tsx
    Footer.tsx
  data/
    packages.ts
    destinations.ts
```

Deliverable:

- Tourist website UI with static sample data.
- Mobile responsive version.
- Design review with Adnan before API integration.

## 13. Adnan First Task

Adnan should prepare the foundation.

Tasks:

1. Create the monorepo.
2. Add `apps/web`, `apps/admin`, `apps/provider`, and `services/api`.
3. Set up pnpm workspace.
4. Add shared TypeScript config.
5. Add linting and formatting.
6. Add basic README.
7. Add `docs/Design.md` and `docs/Final_Project_Plan.md`.
8. Prepare initial database planning.
9. Prepare API contract draft.

Deliverable:

- Repository ready for all team members to clone.

## 14. Ahmed First Task

Ahmed should start provider-side planning and backend module structure.

Tasks:

1. Plan provider registration fields.
2. Plan provider service types.
3. Plan provider dashboard screens.
4. Create provider API contract draft.
5. Work with Adnan on database tables for providers.

Provider types:

- Hotel
- Restaurant
- Transport
- Tour guide
- Hiking guide
- Photographer
- Activity provider

Deliverable:

- Provider module plan and provider API draft.

## 15. Asim First Task

Asim should start admin dashboard planning.

Tasks:

1. Plan admin dashboard sidebar.
2. Plan booking request table.
3. Plan call queue screen.
4. Plan provider suggestion screen.
5. Create admin API contract draft.
6. Work with Adnan on booking status logic.

Deliverable:

- Admin module plan and admin dashboard UI draft.

## 16. Samreen and Wohaib First Task

Samreen and Wohaib will prepare the testing checklist from the beginning.

Tasks:

1. Read `Design.md`.
2. Read `Final_Project_Plan.md`.
3. Create frontend UI checklist.
4. Create mobile responsive checklist.
5. Create booking flow checklist.
6. Create admin dashboard checklist.
7. Create provider dashboard checklist.
8. Create bug report format.

Deliverable:

- `QA_Checklist.md`
- Bug report template

## 17. Development Flow

Recommended flow:

1. Adnan creates repository.
2. Adnan pushes initial monorepo structure.
3. Everyone clones the same repository.
4. Sana starts `apps/web`.
5. Asim starts admin planning and screens.
6. Ahmed starts provider planning and APIs.
7. Adnan creates backend foundation.
8. Team reviews UI before API integration.
9. Backend endpoints are connected one by one.
10. Testing team checks each module before merge.

## 18. Git Branch Plan

Use separate branches.

| Branch | Owner | Purpose |
| --- | --- | --- |
| `main` | Adnan | Stable production-ready code |
| `dev` | Team | Shared development branch |
| `feature/web-homepage` | Sana | Tourist homepage |
| `feature/web-packages` | Sana | Package pages |
| `feature/admin-dashboard` | Asim | Admin dashboard |
| `feature/provider-dashboard` | Ahmed | Provider dashboard |
| `feature/api-bookings` | Adnan | Booking backend |
| `feature/api-providers` | Ahmed | Provider backend |

Rule:

No direct push to `main`. Work should go through pull requests.

## 19. First Sprint Plan

### Sprint 0: Setup and Design Alignment

Duration: 2 to 3 days

Tasks:

- Create monorepo
- Add documentation
- Add design system
- Add sample data
- Add base routes
- Confirm UI direction
- Confirm database entities
- Confirm API contracts

### Sprint 1: Frontend Prototype

Duration: 5 to 7 days

Tasks:

- Homepage
- Package listing
- Package detail
- Booking form
- Provider registration page
- Admin dashboard basic layout
- Provider dashboard basic layout

### Sprint 2: Backend Foundation

Duration: 5 to 7 days

Tasks:

- NestJS setup
- Prisma setup
- Supabase PostgreSQL connection
- Auth roles
- Package APIs
- Booking request APIs
- Provider registration APIs

### Sprint 3: Integration

Duration: 5 to 7 days

Tasks:

- Connect package pages to API
- Connect booking form to API
- Connect provider registration to API
- Connect admin booking queue to API
- Add Resend email for booking request
- Add payment status placeholder

### Sprint 4: QA and MVP Polish

Duration: 4 to 6 days

Tasks:

- UI QA
- Mobile QA
- Booking flow QA
- Admin flow QA
- Provider flow QA
- Error states
- Loading states
- Empty states
- Deployment test

## 20. API Integration Strategy

Start frontend with fake data.

Then replace fake data with APIs step by step.

Recommended order:

1. `GET /packages`
2. `GET /packages/:slug`
3. `POST /bookings/request`
4. `POST /providers/register`
5. `GET /admin/bookings`
6. `PATCH /admin/bookings/:id/call-confirm`
7. `GET /admin/providers/suggestions/:bookingId`
8. `PATCH /admin/bookings/:id/assign-providers`
9. `PATCH /provider/bookings/:id/accept`
10. `PATCH /provider/bookings/:id/reject`

## 21. Real-Time Plan

Do not start with full real-time.

MVP:

- Normal API requests
- Dashboard refresh
- Simple polling every 30 to 60 seconds if needed
- Email notifications through Resend

Later:

- Supabase Realtime or WebSocket gateway
- Provider instant booking notification
- Admin live booking queue
- Push notifications for mobile app

## 22. QA Ownership

Testing will be handled by both:

- Development team
- Testing team

Development team:

- Adnan
- Ahmed
- Asim
- Sana

Testing team:

- Samreen
- Wohaib

Testing team responsibilities:

- Check design against `Design.md`.
- Check mobile responsiveness.
- Check all forms.
- Check booking flow.
- Check provider registration.
- Check admin actions.
- Report bugs clearly.
- Retest fixed bugs.

Bug report format:

```txt
Title:
Module:
Screen:
Device:
Browser:
Steps to reproduce:
Expected result:
Actual result:
Screenshot/video:
Priority:
Assigned to:
Status:
```

## 23. MVP Definition

The MVP is complete when:

- Tourist can browse packages.
- Tourist can submit a booking request.
- Admin can see booking requests.
- Support can mark call confirmation.
- Admin can approve providers.
- Admin can assign providers to booking.
- Provider can accept or reject assigned booking.
- Email notification works through Resend.
- Payment status can be tracked manually.
- Basic commission can be recorded.
- Website is responsive.
- Admin and provider dashboard are usable.

## 24. Final Recommendation

Start with one monorepo and a modular NestJS backend.

Do not start with microservices.

Do not start with mobile app.

Do not connect the frontend to backend immediately.

First create the frontend prototype using `Design.md`, then prepare API contracts, then connect the real backend step by step.

Sana should start with the tourist website UI first. Adnan should prepare the repo and backend foundation. Ahmed should prepare provider module planning. Asim should prepare admin module planning. Samreen and Wohaib should prepare QA checklists from the first sprint.

