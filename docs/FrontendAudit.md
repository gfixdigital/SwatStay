# SwatStay Frontend Audit

Audit date: 15 September 2026

Scope:

- Tourist website in `apps/web`
- Admin dashboard in `apps/admin`
- Shared frontend contracts and future database notes
- Provider dashboard in `apps/provider`

## Verified now

- Tourist website TypeScript check passes.
- Tourist website production build passes and generates 22 routes.
- Admin TypeScript check passes.
- Admin production build passes.
- No merge conflict markers remain in application or documentation files.
- The corrupt Next.js build cache was replaced and a clean build was generated.
- Tourist dashboard QR action is above support actions and Emergency Support is at the bottom.
- Admin QR voucher flow supports draft generation, activation, traveler QR preview, PNG download, provider delivery preview, accepted and rejected scan simulation, service progress, revocation, and audit history.
- Admin navigation is grouped by work area and each navigation item has role-access metadata ready for future authentication.
- Provider portal supports hotel, transport, tour guide, restaurant, photographer, and activity-provider previews with availability, assignment, code-validation, service-outcome, issue-report, support, and settlement-preview screens.

## Tourist website status

### Complete for the current frontend review

- Homepage, packages list, package detail, booking, booking success, custom trip, About, Contact, FAQ, Terms, Privacy, onboarding, login, signup, saved packages, provider registration, traveler dashboard, and not-found experience.
- Responsive header and mobile navigation.
- Package save and recently viewed behavior using browser storage.
- Currency and partial language preferences using browser storage.
- Package service details, itinerary printing, sharing, booking legal consent, pickup suggestions, and cancellation summary.
- First-visit onboarding preference.
- Frontend support request demonstration with phone and WhatsApp actions.
- Compact traveler dashboard with payment proof, trip changes, itinerary, documents, service vouchers, QR preview, and emergency support.

### Frontend issues still worth fixing

1. Forgot password is currently an inert button. Add a clear frontend information state or hide it until the recovery flow is designed.
2. Contact, booking, custom-trip, provider registration, and support forms only change local component state. This is correct for the current boundary but submissions disappear after refresh.
3. The language selector translates only navigation and key calls to action. Full page content, forms, validation, dates, and right-to-left Urdu layout are pending.
4. Currency conversion uses approximate static rates. Conversion timestamps and live pricing must wait for the backend or exchange service.
5. The traveler dashboard has one static sample trip. Multiple bookings, empty history, cancelled trips, and completed-trip states need explicit UI states before API integration.
6. Payment proof files are browser-only previews. Add file size, file type, upload progress, replacement, rejection reason, and retry states when storage is connected.
7. Some routes inherit global SEO metadata instead of having route-specific titles. Add metadata for dashboard, booking success, login, signup, onboarding, and provider registration.
8. Remote travel images are rendered as CSS backgrounds or normal browser images in several places. Image optimization, source ownership, loading fallbacks, and responsive sizing need a dedicated performance pass.
9. Manual accessibility testing is still required for keyboard focus, screen readers, 200 percent zoom, Urdu layout, and modal focus trapping.

## Admin dashboard status

### Complete or substantially functional in frontend state

- Dashboard overview and quick operational links.
- Booking list filters, assigned-team-member filter, booking details, team owner assignment/reassignment with reason and history, call status actions, payment overview, internal notes, provider assignment entry points, and trip timeline.
- Call queue outcomes and call-note modal.
- Complete trip-change request review flow with callback details, impact notes, activity log, approval, rejection, and apply state.
- Package create, edit, duplicate, activate, deactivate, image selection, itinerary editing, SEO fields, validation, and preview.
- Website content search, editing, draft preview, save, and publish confirmation.
- Provider suggestions and assignment summary.
- Payment proof review state and finance notes.
- Team role definitions and member editing in frontend state.
- QR voucher lifecycle and scan simulation.
- Grouped, collapsible, role-ready navigation with a compact scrollbar.

### Admin workflows still incomplete

1. Global search in the header is visual only. It needs a command result panel across bookings, tourists, providers, payments, tickets, and vouchers.
2. Notification bell has no notification list, read state, or destination links.
3. Booking export still shows a placeholder instead of downloading the filtered rows as CSV.
4. Destination editing needs required validation, unique slug checks, popular-service editing, working image assignment, preview, confirmation feedback, and persisted frontend state.
5. Media upload does not add selected files to the library. Copy URL does not copy, and deletion needs confirmation plus usage protection.
6. Language editor does not persist draft text by section. Publish does not validate missing content or show translation history.
7. Settings cards are informational. They need controlled forms, validation, save feedback, and role restrictions before being treated as usable settings.
8. Provider approve, reject, and suspend actions need confirmation dialogs, required reasons, document-level review, status history, and visible audit entries.
9. Provider records need structured prices, availability, bank-verification status, assigned bookings, service history, and dispute history.
10. Payment rejection needs a required reason. Verification needs confirmation and should update the linked booking payment state in the same frontend store.
11. Payout completion needs a payment reference, paid date, confirmation step, and audit entry.
12. Provider assignment currently permits confirming a partial set. Required package services and intentionally skipped services need explicit validation.
13. Booking assignment and booking-status changes are saved in this browser through localStorage. Payment, notes, provider assignments, and other workflows still need one shared frontend store before they can remain consistent across every admin route.
14. Admin modal focus trapping and return-focus behavior need accessibility improvement.
15. Empty, loading, and error states are not consistently implemented on every table and editor.

## Provider dashboard status

### Complete for the current frontend review

- Service-type preview for hotel, transport, tour guide, restaurant, photographer, and activity providers.
- Availability, service-scoped assignment queue, accept or decline actions, QR/code-entry handoff screen, service-outcome confirmation, issue-report state, support preview, compliance profile, and settlement-status screens.
- Completion is intentionally blocked from the assignment queue. A provider must accept a service, validate its code, and confirm the real service outcome before the browser preview permits completion.

### Provider integration gaps

1. The profile selector is for review only. Real provider authentication must show one provider account and its own services only.
2. QR camera capture, signed-code verification, voucher expiry checks, duplicate-scan prevention, and cross-app status updates need the API.
3. Declines and issue reports need required reason fields, evidence uploads, and GFix ticket creation.
4. Availability needs resource-level inventory, for example individual rooms, vehicles, drivers, guides, tables, sessions, or activity slots, rather than a simple day status.
5. Settlements intentionally show no invented money amounts. Backend finance records must supply approved rates, commission, adjustments, and payout references.

## QR workflow boundary

The current QR workflow is a complete interaction preview inside the admin browser. It is not shared across application origins. A change made in `apps/admin` cannot automatically appear in `apps/web` or `apps/provider` without a backend, shared service, or same-origin host bridge.

The production flow should later connect these steps:

1. Admin confirms booking and provider assignments.
2. Admin generates and activates one trip voucher.
3. Backend stores only a signed voucher reference in the QR.
4. Traveler dashboard receives the voucher.
5. Each assigned provider receives a service-scoped assignment packet.
6. Logged-in provider scans the traveler QR.
7. Backend validates voucher, provider, service, expiry, and duplicate use.
8. Service handoff and audit event are recorded.
9. Tourist and admin dashboards receive the updated service status.

The QR should track service milestones, not continuously track the tourist. Location should be optional, approximate, and permission-based.

## Frontend cleanup completed after this audit

- Browser-persistent payment review, provider approval, destination, media, translation, and payout preview state.
- Required payment rejection reason, provider decision path, protected media deletion, local upload preview, booking-linked payment update, header search results, notification panel, and modal focus trap.
- Public route metadata expansion and an honest password-recovery information state.

## Work intentionally deferred

See `docs/FutureFixes.md` for the planned backend and product roadmap.

## Useful future additions

These are sensible after the current frontend gaps are closed:

- Manual six-character voucher code fallback when a provider camera cannot scan.
- Provider scan issue flow with photo evidence and admin review.
- Voucher regeneration after a lost or exposed code.
- Service exception board for delayed pickup, hotel replacement, guide no-show, and weather rescheduling.
- Tourist consent-controlled location sharing during an active pickup only.
- Admin saved filter views for call queue, payments, active trips, and voucher issues.
- Operations shift handover summary with unresolved bookings and support cases.
- Data retention and identity-document deletion controls.

## Backend-dependent work

- Real authentication and role enforcement
- NestJS APIs and validation
- PostgreSQL persistence through the approved database layer
- File storage and secure upload URLs
- Email, WhatsApp, and SMS delivery
- Real payment verification and gateway integration
- Authorized provider QR scanning
- Cross-application realtime updates
- Audit logging that cannot be changed from the browser
- Rate limiting, token rotation, session security, and privacy enforcement
