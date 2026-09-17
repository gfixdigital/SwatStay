# Third-Party SDK and Client Storage Audit

Last reviewed: 17 September 2026

## Current frontend state

The current SwatStay prototype has no advertising, behavioral analytics, payment, identity verification, mapping, CAPTCHA, chat, or QR-scanning SDK enabled in the tourist website.

| Item | Purpose | Data sent to a third party | Consent required before production |
| --- | --- | --- | --- |
| Next.js and React | Website rendering | No application data in the frontend preview | No |
| `next/font` Google font build integration | Font delivery | No traveler form data | Review hosting and privacy policy before launch |
| Unsplash image URLs | Prototype destination imagery | Visitor requests image assets from Unsplash | Replace with owned/CDN-hosted media before production or add to policy and consent review |
| `localStorage` | Language, currency, onboarding, saved packages, recent views, consent, and UI preview state | No third-party transmission | Essential preference notice |
| WhatsApp links | Opens a user-initiated support conversation | The user chooses whether to contact WhatsApp | Explain the external destination beside the action |

## Production gate

Before adding any SDK or third-party script:

1. Record owner, vendor, purpose, categories of data, region, retention, and legal basis.
2. Decide whether it is essential, functional, analytics, or marketing.
3. Add it to the consent manager and block non-essential scripts until consent is saved.
4. Update the Privacy Policy, vendor register, deletion process, and API audit logs.
5. Verify that provider views receive only the minimum traveler information for their assigned service.

## Consent records required with the API

Store consent type, policy version, timestamp, actor, source form, IP or device metadata where legally appropriate, and withdrawal timestamp. Do not use the browser-preview localStorage record as a production audit record.

