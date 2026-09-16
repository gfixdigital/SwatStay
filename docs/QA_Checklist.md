# SwatStay Frontend QA Checklist

## Public website

- Test each public route, 404 route, booking/custom-trip/contact form validation, legal links, mobile navigation, and package filters.
- Test keyboard navigation, visible focus, modal Escape/close behavior, 200 percent zoom, and reduced-motion settings.
- Test saved packages, recently viewed packages, language/currency preference, onboarding preference, and browser storage reset.

## Admin operations

- Test the booking sequence: booking inbox, assigned owner, call confirmation, payment review, provider assignment, voucher, support, and close.
- Test contact inbox, promotions, trip review moderation, and legal-content draft/publish preview states.
- Test approval, rejection, assignment, payout, and status-change confirmation paths.

## Provider operations

- Test each provider type: hotel, transport, guide, restaurant, photographer, and activity provider.
- Test the gated handoff path: accept, code validation, completion outcome, and issue report.
- Confirm providers cannot view unrelated booking services, identity documents, payment proofs, or internal notes.

## Before release

- Test Chrome, Edge, Android Chrome, and iPhone Safari.
- Test slow network, empty, loading, error, and refresh states once APIs are connected.
- Confirm all notification tones require user interaction and all production alerts are opt-in.
