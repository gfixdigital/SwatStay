# Finance Flow

## Customer payment

1. The traveler sees the total, paid amount, remaining balance, payment instructions, booking reference, and proof-upload form.
2. The traveler uploads a receipt or screenshot with the amount, method, and transaction reference.
3. Finance reviews the proof after the confirmation call. A verified payment unlocks provider assignment.
4. The traveler should see the verified amount, remaining balance, and final-payment instruction after the backend is connected.

## GFix commission

Commission is GFix revenue for arranging a specific provider service. It is calculated per service, not as an extra automatic charge to the tourist.

Example: a hotel service costs PKR 18,000 and the agreed provider commission is 10%. The commission record is PKR 1,800. The finance team keeps PKR 1,800 and the provider's service settlement is PKR 16,200, subject to the signed provider agreement and any tax rules.

The Commissions page records booking reference, provider, service type, gross service amount, agreed rate, calculated commission, and clearance status.

## Provider payout

Payout is the amount actually paid to the provider after the service and settlement conditions are met. Finance records the payout method, transfer reference, confirmation note, amount paid, remaining balance, and status.

## API foundation now available

The API now exposes the first finance foundation under `/api/v1`:

- `POST /bookings/:id/payment-proof` lets the owning tourist submit amount, method, reference, and a frontend-provided proof URL placeholder.
- `GET /admin/payments` and `PATCH /admin/payments/:id/review` are restricted to `ADMIN` and `FINANCE` roles.
- `POST /admin/finance/commissions` creates a per-service commission and its pending provider payout.
- `GET /admin/finance/bookings/:id` and `GET /admin/payouts` provide finance views.
- `PATCH /admin/payouts/:id/status` enforces `PENDING -> APPROVED -> PROCESSING -> PAID` with a failed-payment retry path through `FAILED -> PROCESSING`.
- `GET /provider/finance` is restricted to the signed-in provider and returns only that provider's commissions and payouts.

Every review, commission creation, and payout transition writes an audit log. File storage, payment gateway processing, tax handling, duplicate payout protection, and automated settlement remain later work.
