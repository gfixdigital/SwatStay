# SwatStay Platform

SwatStay is a local-first tourism booking platform for Swat Valley. This repository is a pnpm workspace managed by Turborepo.

## Current scope

The active product is the static tourist website in `apps/web`. It includes the homepage, packages, package details, custom trip planning, booking flow, onboarding, login/signup UI, provider registration, traveler dashboard, QR voucher prototype, and live support prototype.

The future admin panel and provider dashboard are React + TypeScript + Vite applications in `apps/admin` and `apps/provider`. The backend is a NestJS application in `services/api`. The current website and dashboard starters use static fake data. Supabase, Prisma, payments, production authentication, realtime events, and real QR scanning are not connected yet.

## Requirements

- Node.js 20 or newer
- Corepack-enabled pnpm 9+
- Git

## Install dependencies

From the repository root:

```bash
corepack enable
pnpm install
```

If Corepack is unavailable, use the pinned pnpm version through npx:

```bash
npx pnpm@9.15.0 install
```

## Run the website locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Run only the web app:

```bash
pnpm --filter @swatstay/web dev
```

## Useful commands

```bash
pnpm typecheck       # Type-check all workspace packages
pnpm build           # Build all workspace apps and packages
pnpm lint            # Run workspace lint commands when configured
pnpm --filter @swatstay/web typecheck
pnpm --filter @swatstay/web build
```

Do not run `pnpm build` at the same time as `pnpm dev` for the web app. Both use `.next`, and concurrent runs can create stale development chunks. If that happens, stop the dev server, remove `apps/web/.next`, and restart `pnpm dev`.

## Website routes

- `/` - Tourist homepage
- `/packages` - Package listing and filters
- `/packages/[slug]` - Package detail and booking request
- `/custom-trip` - Custom trip planning form
- `/booking` - General booking request
- `/booking/success` - Booking confirmation
- `/login` - Login prototype
- `/signup` - Signup prototype with CNIC/passport logic
- `/onboarding` - Onboarding screens
- `/provider/register` - Provider registration docket
- `/dashboard` - Traveler dashboard with QR voucher and service status prototype
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy

## Project structure

```text
apps/
  web/       Next.js App Router tourist website
  admin/     React + TypeScript + Vite admin dashboard
  provider/  React + TypeScript + Vite provider dashboard
  mobile/    Mobile app starter
services/
  api/       NestJS API starter
packages/
  config/    Shared configuration
  types/     Shared TypeScript types
docs/
  Design.md
  DatabaseSchema.md
  ApiContract.md
  Final_Project_Plan.md
```

## Data and database planning

All current forms and dashboard data are static. The future field inventory and planned entities are documented in [docs/DatabaseSchema.md](docs/DatabaseSchema.md). Update that file whenever a new form field, workflow, QR event, support feature, provider action, or admin requirement is added.

The planned architecture is:

```text
Next.js tourist website ─┐
React admin/provider apps ─┼─> NestJS API -> Prisma -> Supabase PostgreSQL
                          └─────────────────────────> Supabase Storage or Cloudflare R2
```

The QR code currently demonstrates the interface and check-in state transition only. The production QR payload should contain a signed voucher reference, not personal identity data. Provider scans should be authorized and recorded as auditable service handoff events.

## Environment variables

No environment variables are required for the current static prototype. When integrations are added, create an `.env.local` file in the relevant app and document safe placeholder names in `.env.example`. Never commit secrets.

## Design direction

The interface follows the Stitch design system “Editorial Alpine Utility”: Pine, River, Snow, Mist, Stone, Charcoal, Amber, Manrope, Inter, 8px structural corners, hairline borders, restrained motion, responsive layouts, and local Swat travel imagery.
