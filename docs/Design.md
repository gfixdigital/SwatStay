# Swat Tourism Platform - Design.md

## 1. Project Context

Design a modern tourism booking platform for Swat, Pakistan. The product is for local Pakistani tourists and international tourists who want curated travel packages for Swat, Kalam, Malam Jabba, Bahrain, Madyan, and nearby destinations.

The platform is not a generic SaaS landing page. It is a real travel booking and operations product. The first prototype should look practical, local, trustworthy, and premium enough for international tourists.

The business model:

- Tourists browse packages and submit booking requests.
- GFix team calls the tourist to confirm details.
- After confirmation and payment, admin approves provider assignments.
- Hotels, transport providers, guides, restaurants, and activity providers receive notifications.
- GFix takes commission from every confirmed booking.

Primary users:

- Tourist
- Provider
- Admin
- Support team
- Finance team

Supported languages:

- English
- Urdu
- Chinese

## 2. Design Direction

The design should feel like a trusted local travel operator with a polished booking system.

Use this style:

- Clean travel editorial layout
- Real destination photography
- Premium but not luxury-only
- Practical booking controls
- Calm colors inspired by Swat: pine green, river blue, snow white, stone gray
- Strong information hierarchy
- Clear package comparison
- Dashboard screens that feel operational and usable

Do not make it look like:

- AI startup landing page
- Crypto dashboard
- Generic purple SaaS website
- Over-animated agency portfolio
- Fake social proof website
- Template marketplace clone

## 3. Strict Anti-Slop Rules

Follow these rules exactly.

Do not include:

- Purple gradients
- Abstract gradient blobs
- Vague hero text
- Fake counters
- Fake reviews
- Fake metrics
- Emoji icons
- Cursor animations
- Too many scroll animations
- Pill-shaped buttons everywhere
- "Made with AI" tag
- AI-style copy
- Generic AI images
- Unrealistic testimonials
- Overused glassmorphism cards
- Huge empty hero sections
- Repeated floating cards
- Nested cards
- Negative letter spacing
- Em dashes

Must include:

- Site favicon placeholder
- Privacy Policy page
- Terms and Conditions page
- Clear booking form
- Realistic package details
- Real destination imagery
- Practical admin/provider dashboards
- Clear empty states
- Clear loading and error states

## 4. Visual Identity

### Brand Feel

Brand personality:

- Local expert
- Safe
- Organized
- Honest
- Helpful
- Tourism-focused
- Practical

Possible brand name in prototype:

**SwatStay**

Alternative names:

- VisitSwat
- SwatTrip
- SwatRoutes
- TourSwat

Use **SwatStay** for the prototype unless changed later.

### Color Palette

Use a restrained palette.

| Token | Color | Use |
| --- | --- | --- |
| Pine | `#12372A` | Primary brand color, headings, nav |
| River | `#176B87` | Links, active states, selected filters |
| Snow | `#F8FAF7` | Main page background |
| Mist | `#EEF4F1` | Section background |
| Stone | `#647067` | Muted text |
| Charcoal | `#17211B` | Body text |
| Amber | `#C9852B` | Price highlights, warning, premium tag |
| White | `#FFFFFF` | Cards, forms |
| Border | `#D9E2DD` | Borders and dividers |

Do not use:

- Purple
- Neon colors
- Heavy blue gradients
- All-black dark theme for MVP
- Brown/orange dominant theme

### Typography

Use clean, readable fonts.

Recommended:

- Headings: Inter, Satoshi, or Manrope
- Body: Inter or system sans
- Urdu: Noto Nastaliq Urdu or Noto Sans Arabic
- Chinese: Noto Sans SC

Rules:

- No hero-scale text unless it is on the homepage only.
- Dashboard text should be compact and scannable.
- Letter spacing must be normal.
- Body copy should be short and specific.

### Buttons

Button radius: `8px`

Use:

- Primary rectangular buttons
- Secondary outline buttons
- Text links for low-priority actions
- Icon + text only when the icon is familiar

Avoid:

- Pill buttons
- Giant CTA buttons
- Animated buttons
- Gradient buttons

## 5. Imagery Direction

Use real or realistic destination photos:

- Kalam valley
- Malam Jabba
- Swat river
- Bahrain bazaar/river area
- Madyan
- Hotel rooms
- Local transport
- Hiking trails
- Family travel
- Couple travel

Images should be:

- Bright but natural
- Clear and inspectable
- Not dark and moody
- Not over-blurred
- Not fake AI-looking
- Not abstract

Hero image:

- Full-width destination photo background or large editorial image
- Text overlay should be readable
- Use a subtle dark overlay only if needed

Do not use:

- Abstract mountain SVGs
- Generated-looking people
- Stock photos with fake smiles
- Collages that make the page busy

## 6. Layout System

Use a 12-column desktop grid and simple mobile stacking.

Desktop:

- Max content width: `1180px`
- Page padding: `24px`
- Section spacing: `64px`
- Card radius: `8px`
- Card border: `1px solid #D9E2DD`

Mobile:

- Page padding: `16px`
- Section spacing: `40px`
- Booking form should appear early
- Filters should collapse into a bottom sheet or drawer
- Tables should become stacked rows

Spacing should feel dense but comfortable. Avoid giant blank sections.

## 7. Navigation

Main public navigation:

- Destinations
- Packages
- Providers
- Custom Trip
- About
- Contact

Right side:

- Language selector
- Login
- Book Trip

Mobile navigation:

- Menu icon
- Language selector
- Sticky bottom "Book Trip" button on package pages

Header behavior:

- Sticky after scroll
- White or Snow background
- Thin border bottom
- No heavy blur effect

## 8. Homepage Design

### Hero Section

Goal: immediately tell the user this is for booking real Swat travel packages.

Headline:

**Book verified Swat tour packages with local operators**

Subtext:

Hotels, transport, meals, guides, and hiking plans arranged through one confirmed booking.

Hero controls:

- Destination select
- Travel dates
- Travelers count
- Package type
- Search packages button

Hero background:

- Real Swat/Kalam/Malam Jabba photo
- Natural overlay for readability

Do not use vague text like:

- "Experience the future of travel"
- "Your journey starts here"
- "Explore without limits"

### Trust Strip

Use factual trust points, not fake numbers.

Examples:

- Verified local providers
- Call-confirmed bookings
- Urdu, English, and Chinese support
- Advance and full payment options

Do not use fake metrics like:

- 10,000 happy travelers
- 99 percent satisfaction
- 500 verified hotels

### Featured Packages

Show 3 to 6 package cards.

Each card includes:

- Destination photo
- Package type
- Tier
- Duration
- Starting price
- Included services icons from lucide
- "View details" button

Example cards:

- Couple Standard - Kalam 3 Days
- Family Basic - Swat 2 Days
- Private Premium - Malam Jabba 3 Days
- Group Sharing - Bahrain and Madyan 2 Days

### How It Works

Use 4 clear steps:

1. Choose package
2. Submit request
3. Confirm by call
4. Providers are booked

Keep it simple. No timeline animation needed.

### Destinations Section

Use editorial cards for:

- Kalam
- Malam Jabba
- Bahrain
- Madyan
- Mingora
- Fizagat

Each card should include:

- Real image
- Best for
- Travel time from Mingora
- Popular services

### Custom Trip CTA

Short section:

**Need a custom Swat plan?**

Tell us your dates, budget, people count, and preferred hotel level. Our team will call you with a confirmed plan.

CTA:

- Request custom trip

### Footer

Include:

- Logo
- Short business description
- Contact
- WhatsApp placeholder
- Email placeholder
- Destinations
- Packages
- Provider registration
- Terms and Conditions
- Privacy Policy

## 9. Package Listing Page

Purpose: help tourists compare packages quickly.

Top area:

- Title: Swat Tour Packages
- Short specific subtitle
- Filters

Filters:

- Destination
- Dates
- Travelers
- Type: Solo, Couple, Family, Group, Sharing, Private
- Tier: Basic, Standard, Premium, Luxury
- Services: Hotel, meals, transport, guide, hiking
- Price range

Package card layout:

- Left: destination image
- Middle: title, route, included services, duration
- Right: price, availability note, CTA

CTA:

- View details
- Request booking

Important:

- Do not show fake urgency.
- Do not show fake discount countdowns.
- Do not show fake reviews.

## 10. Package Detail Page

This is the most important public page.

Page sections:

1. Package overview
2. Image gallery
3. Included services
4. Day-by-day itinerary
5. Hotel level
6. Transport details
7. Meals
8. Guide and hiking options
9. Add-ons
10. Pricing breakdown
11. Cancellation policy
12. Booking request form

Hero:

- Package name
- Destination
- Duration
- Starting price
- Package type and tier
- Real image

Booking form should include:

- Full name
- Phone/WhatsApp
- Email
- Country
- Language preference
- Travel dates
- Number of travelers
- Package type
- Tier
- Pickup city
- Special requests
- Preferred payment method

After submit message:

**Request received. Our team will call you to confirm your trip details before providers are booked.**

## 11. Custom Trip Page

This page is for tourists who do not want a fixed package.

Layout:

- Left: simple explanation
- Right: form

Form fields:

- Destination interests
- Number of days
- Travelers count
- Traveler type
- Hotel level
- Meal preference
- Transport type
- Hiking or activities
- Budget range
- Pickup city
- Language preference
- Contact details

Do not make this feel like an AI trip planner. It is a human-confirmed travel request.

## 12. Provider Registration Page

Purpose: allow hotels, transport providers, guides, restaurants, and activity providers to join.

Headline:

**Register your tourism service with SwatStay**

Subtext:

Join free during launch. Receive confirmed booking opportunities and pay commission only on successful bookings.

Provider types:

- Hotel
- Restaurant
- Transport
- Tour guide
- Hiking guide
- Photographer
- Activity provider

Form fields:

- Business name
- Owner name
- Phone/WhatsApp
- Email
- Service category
- City/location
- Business address
- CNIC or business document upload
- Service photos
- Price range
- Capacity
- Availability notes
- Bank/payment details
- Agreement checkbox

Provider success state:

**Registration submitted. Our team will verify your service before it becomes active.**

## 13. Tourist Dashboard

Keep this simple for MVP.

Screens:

- My bookings
- Booking detail
- Payment status
- Itinerary
- Support ticket
- Profile

Booking detail should show:

- Status timeline
- Package details
- Call confirmation status
- Payment status
- Assigned services after confirmation
- Support contact

## 14. Provider Dashboard

Provider dashboard should feel practical, not fancy.

Main screens:

- Overview
- Assigned bookings
- Services
- Availability
- Earnings
- Profile verification
- Notifications

Overview widgets:

- Pending assignments
- Accepted bookings
- Upcoming services
- Unpaid earnings

These are real operational values. Do not show fake demo metrics.

Assigned booking card:

- Booking ID
- Service type
- Date/time
- Location
- Tourist count
- Required action
- Accept button
- Reject button

## 15. Admin Dashboard

Admin dashboard is the control center.

Main navigation:

- Dashboard
- Booking requests
- Call queue
- Packages
- Providers
- Provider suggestions
- Payments
- Commissions
- Payouts
- Support tickets
- Reports
- Settings

Admin dashboard home:

- Real summary cards using placeholder labels only
- Booking requests needing calls
- Provider approvals pending
- Payment proofs pending
- Active trips today
- Support issues

Do not use fake big numbers. Use sample states like:

- 4 requests need call
- 2 providers need review
- 1 payment proof pending

Booking request detail:

- Tourist information
- Package selected
- Call notes
- Payment status
- Suggested providers
- Manual provider selection
- Confirm booking button
- Cancel request button

Provider suggestion panel:

- Hotel suggestions
- Transport suggestions
- Guide suggestions
- Meal provider suggestions

Each suggestion should show:

- Provider name
- Location
- Capacity
- Price
- Commission
- Availability
- Admin select button

## 16. Terms and Conditions Page

Must be included in the prototype.

Sections:

- Booking confirmation
- Payment and advance
- Provider responsibility
- Cancellation policy
- Refund policy
- Tourist behavior and safety
- Weather and road conditions
- Service changes
- Emergency support
- Contact

Use plain language.

## 17. Privacy Policy Page

Must be included in the prototype.

Sections:

- What information is collected
- Contact details
- Travel details
- Payment records
- Provider documents
- How information is used
- How long records are kept
- User rights
- Contact

Keep it simple and credible.

## 18. Components

Use these components:

- Header
- Language selector
- Destination search bar
- Package card
- Destination card
- Booking form
- Price breakdown
- Itinerary timeline
- Provider card
- Admin data table
- Status badge
- Empty state
- Modal
- Drawer for mobile filters
- Toast notification
- File upload field
- Date picker
- Select menus
- Checkbox group

Use lucide-style icons only, not emoji.

Icon examples:

- MapPin
- Calendar
- Users
- Car
- Hotel
- Utensils
- Mountain
- ShieldCheck
- Phone
- Mail
- CreditCard
- FileText

## 19. Status Badges

Use clear status badges.

| Status | Color Direction |
| --- | --- |
| Request submitted | River blue |
| Call pending | Amber |
| Tourist confirmed | Pine green |
| Payment pending | Amber |
| Provider pending | River blue |
| Confirmed | Green |
| Active | Blue |
| Completed | Neutral |
| Cancelled | Red |

Badge radius: `6px`

## 20. Forms UX

Forms should be clear and serious.

Rules:

- Labels above inputs
- Helper text only when useful
- Required fields marked clearly
- Use select menus for known values
- Use text area for special requests
- Show inline validation
- Do not hide errors in toast only
- Keep submit buttons clear

Primary form CTA examples:

- Submit booking request
- Request custom trip
- Register provider
- Confirm provider assignment

## 21. Copywriting Rules

Use human, specific copy.

Good copy:

- "Our team will call you before your hotel, transport, and guide are booked."
- "Choose a fixed package or request a custom Swat plan."
- "Providers are verified before they receive tourist bookings."
- "Advance payment confirms the booking request."

Bad copy:

- "Unlock seamless travel experiences"
- "Revolutionize your journey"
- "AI-powered adventure starts here"
- "Discover limitless possibilities"

Tone:

- Clear
- Honest
- Local
- Calm
- Professional

No em dashes.

## 22. Mobile Design

Mobile is very important because many tourists will use phones.

Mobile rules:

- Search form should be first-screen usable.
- Package cards should be vertical.
- Price and CTA should stay visible on package detail page.
- Use sticky bottom booking CTA on package detail.
- Filters should open in drawer.
- Admin tables should turn into list cards.
- Provider booking actions should be thumb-friendly.

Do not overcrowd the mobile homepage.

## 23. Prototype Screen Checklist

Create these screens in Stitch:

1. Homepage
2. Package listing
3. Package detail
4. Booking request success
5. Custom trip request
6. Provider registration
7. Tourist dashboard
8. Provider dashboard
9. Admin dashboard
10. Admin booking detail
11. Provider suggestion screen
12. Terms and Conditions
13. Privacy Policy
14. Login
15. Signup

## 24. Sample Data For Prototype

Use realistic sample data only.

Destinations:

- Kalam
- Malam Jabba
- Bahrain
- Madyan
- Mingora
- Fizagat

Packages:

- Couple Standard - Kalam 3 Days
- Family Basic - Swat 2 Days
- Private Premium - Malam Jabba 3 Days
- Group Sharing - Bahrain and Madyan 2 Days
- Solo Standard - Kalam and Ushu Forest 3 Days

Providers:

- Pine View Hotel Kalam
- Swat River Transport
- Malam Jabba Local Guides
- Bahrain Family Restaurant
- Ushu Valley Hiking Support

Use these as prototype names only. Do not present them as verified real businesses.

## 25. Stitch Master Prompt

Create a complete high-fidelity prototype for **SwatStay**, a tourism booking and provider operations platform for Swat, Pakistan.

Design the following screens:

1. Homepage
2. Package listing
3. Package detail
4. Booking request success
5. Custom trip request
6. Provider registration
7. Tourist dashboard
8. Provider dashboard
9. Admin dashboard
10. Admin booking detail
11. Provider suggestion screen
12. Terms and Conditions
13. Privacy Policy
14. Login
15. Signup

Use a clean travel editorial style with practical dashboard UX. The product should feel like a real tourism platform operated by a local team, not a generic AI SaaS landing page.

Use this visual identity:

- Primary color: Pine `#12372A`
- Secondary color: River `#176B87`
- Background: Snow `#F8FAF7`
- Section background: Mist `#EEF4F1`
- Text: Charcoal `#17211B`
- Muted text: Stone `#647067`
- Accent: Amber `#C9852B`
- Border: `#D9E2DD`
- Button radius: `8px`
- Card radius: `8px`

Use real destination-style photography for Swat, Kalam, Malam Jabba, Bahrain, Madyan, hotels, transport, and hiking. Do not use abstract illustrations or fake AI-looking images.

Homepage requirements:

- Sticky clean header with logo, nav, language selector, login, and Book Trip button.
- Hero with real Swat destination photo and booking search controls.
- Headline: "Book verified Swat tour packages with local operators"
- Subtext: "Hotels, transport, meals, guides, and hiking plans arranged through one confirmed booking."
- Search controls: destination, dates, travelers, package type, search button.
- Trust strip with factual points only.
- Featured package cards.
- How it works with 4 steps: choose package, submit request, confirm by call, providers are booked.
- Destinations section.
- Custom trip CTA.
- Footer with Terms and Conditions and Privacy Policy links.

Package detail requirements:

- Real image gallery.
- Package overview.
- Included services.
- Day-by-day itinerary.
- Hotel level.
- Transport details.
- Meals.
- Guide and hiking options.
- Add-ons.
- Pricing breakdown.
- Cancellation policy.
- Booking request form.
- Confirmation note: "Our team will call you to confirm your trip details before providers are booked."

Admin requirements:

- Dashboard for booking operations.
- Booking call queue.
- Provider approval list.
- Payment proof pending list.
- Provider suggestion screen where system suggests hotel, transport, guide, restaurant, and admin confirms.
- Do not use fake large metrics. Use small realistic placeholder values.

Provider requirements:

- Provider registration form.
- Provider dashboard with assigned bookings, availability, services, earnings, and profile verification.
- Booking assignment card with accept and reject buttons.

Tourist dashboard requirements:

- My bookings.
- Booking detail.
- Payment status.
- Itinerary.
- Support ticket.

Strict design restrictions:

- No purple gradients.
- No abstract blobs.
- No fake counters.
- No fake reviews.
- No fake metrics.
- No emoji icons.
- No cursor animations.
- No excessive scroll animations.
- No pill-shaped buttons.
- No AI copy.
- No made with AI label.
- No generic SaaS hero text.
- No em dashes.

Include:

- Site favicon placeholder.
- Terms and Conditions page.
- Privacy Policy page.
- Loading states.
- Empty states.
- Error states.
- Mobile responsive versions.

Make the prototype feel complete enough that a developer can build the first MVP directly from it.

## 26. Final Quality Bar

The prototype is successful only if:

- A tourist understands what they can book in the first 5 seconds.
- The booking flow clearly says the team will call before provider booking.
- Admin screens feel useful for real operations.
- Provider screens make it obvious how providers receive and accept bookings.
- The design does not look like AI-generated SaaS slop.
- Legal pages and favicon are included.
- Mobile screens are not afterthoughts.

## 27. Design Revision 2: Distinctive Editorial Experience

This section supersedes the earlier restriction against animation and overly expressive presentation. The UI should remain practical, but it must feel memorable, crafted, and visually rich enough to communicate the landscape of Swat immediately.

### Experience Principles

- Build a strong visual rhythm: cinematic hero, compact booking panel, editorial content bands, then operational detail.
- Use layered composition instead of a flat stack of identical cards.
- Give every section a clear job, a distinct visual treatment, and an obvious next action.
- Use real destination imagery as the primary visual language.
- Make the booking panel feel like the product's control surface, not a generic contact form.
- Use micro-interactions to explain hierarchy and affordance, never as decoration without purpose.

### Motion System

Use lightweight CSS or Framer Motion transitions with an accessible reduced-motion fallback.

- Hero content enters with a short fade and upward movement on first load.
- Search panel fields reveal in a gentle stagger of 50 to 80 milliseconds.
- Package and destination cards lift 3 to 5 pixels on hover and reveal a quiet image zoom.
- Section headings and editorial blocks use one-time viewport reveal animations.
- Buttons may shift an icon 3 pixels on hover and change color. Do not use bouncing, cursor-following, or infinite decorative motion.
- Use a slow, subtle image scale or pan in the hero only. Keep content readable and stable.
- Respect `prefers-reduced-motion: reduce` by removing transforms and transitions.

### Homepage Composition

The homepage must have these visual layers:

1. A compact announcement bar with a practical message such as call-confirmed booking support.
2. A sticky navigation header with a small mountain mark, clear active states, and a strong booking action.
3. A two-column hero with a large landscape image, route label, headline, and a floating but grounded booking panel overlapping the lower edge.
4. A factual trust rail using icon, title, and one-line explanation rather than counters.
5. A featured package rail with one highlighted lead card and supporting cards.
6. A four-step booking path with numbered markers and a connecting route line on desktop.
7. A destination atlas with one large feature destination and smaller supporting tiles.
8. A local knowledge band explaining when to travel, how confirmation works, and what is arranged.
9. A custom trip callout with a strong visual split and one clear action.
10. A structured footer with contact, navigation, legal, and provider registration.

### Component Detail Rules

- Header: announcement state, active navigation state, mobile drawer, language menu, and a visible booking CTA.
- SearchPanel: four labeled controls, date affordance, traveler selector, submit state, and a short helper line explaining that results are a starting point.
- PackageCard: image, destination marker, package type, tier, duration, route, service badges, price, and primary action. Add a quiet featured label only when factual.
- DestinationCard: image, location, best-for line, travel time, service line, and arrow affordance.
- BookingForm: grouped sections for contact, dates, preferences, and requests, inline validation, confirmation note, and a clear submission state.
- PriceBreakdown: transparent line items, traveler count, final starting price, and a note that the team confirms the final amount.
- ItinerarySection: day marker, route title, detail, and visual progression from one day to the next.

### Depth and Surface Rules

- Use one primary surface per section. Avoid cards inside cards.
- Use borders, image crops, soft shadows, and background bands for depth.
- Keep radii between 8px and 14px. Buttons stay rectangular with an 8px radius.
- Use Pine for authority, River for action and links, Amber for travel notes and selected details.
- Do not use purple, neon colors, heavy gradients, fake metrics, fake reviews, emojis, generic AI copy, or em dashes.

### Responsive Direction

- On mobile, the hero becomes image first, content second, and booking controls third without hiding the primary action.
- Use horizontal scroll rails for featured packages and destination highlights where they improve browsing.
- Keep booking actions sticky only on the package detail page.
- Collapse secondary navigation into a real drawer with focusable controls.
- Preserve generous image crops, but keep form labels and pricing fully visible.
