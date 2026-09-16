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

Current UI pages are browser-only previews. The backend must later calculate settlements from selected provider arrangements, prevent duplicate payouts, validate roles, store proof, and create immutable finance audit entries.
