# SwatStay Deferred Roadmap

This is the agreed list of work that remains after the frontend-only cleanup. It is deliberately separated from the current prototype so browser previews are not mistaken for live operations.

## Complete after the NestJS API begins

1. Authentication and role enforcement
   - Secure tourist, admin, support, operations, finance, QA, and provider accounts.
   - Server-side permissions, session expiry, password reset, and account recovery.
   - Remove all demo login and hard-coded role behavior.

2. Shared operational records
   - Persist bookings, payment proofs, notes, provider assignments, trip changes, support tickets, and vouchers in PostgreSQL.
   - Make every linked screen update from the same API record.
   - Add immutable audit logs with actor, time, old value, and new value.

3. Payment and refunds
   - Secure proof uploads, validation, rejection reasons, resubmission, payment gateway records, refunds, and reconciliation.
   - Send verified/rejected payment status to the traveler dashboard.

4. Provider operations
   - Connect the existing provider dashboard to authenticated provider accounts, resource-level availability, approved service pricing, document verification, bank verification, assignments, disputes, and payout statements.

5. QR voucher production flow
   - Signed, expiring, service-scoped QR tokens.
   - Logged-in provider scan authorization, duplicate-scan protection, service handoff events, voucher regeneration, and offline/manual fallback code.

6. Communication and support
   - WhatsApp, SMS, email, call logs, response templates, real ticket conversation, emergency escalation, and operations shift handover.

7. Travel intelligence
   - Live currency rates, route/pickup validation, hotel and provider availability, weather and road conditions, and confirmed itinerary PDFs.

8. Localization and compliance
   - Full English, Urdu, and Chinese translation workflow, Urdu right-to-left experience, retention controls, identity-document consent, deletion requests, and accessibility review.

## Useful later product additions

- Active-trip exception board for late pickup, hotel replacement, guide no-show, and weather rescheduling.
- Saved admin filter views and daily operations handover.
- Pre-trip traveler checklist and booking progress tracker.
- Multiple traveler trips, completed-trip history, cancellation history, and service replacement view.
- Booking CSV exports, operational reports, and finance reconciliation reports.
- Global availability calendar across providers and service categories.

## Do not start yet

- Supabase connection
- Payment gateway
- Real chat
- Real QR scanning
- Provider API integration and real provider authentication
- Mobile app

These require approved backend contracts, real authentication, and secure storage first.
