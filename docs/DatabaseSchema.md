# SwatStay Database Schema

## 1. Purpose

This file defines the first database plan for the SwatStay tourism platform.

Database:

- Supabase PostgreSQL
- Prisma ORM

Only the NestJS backend should connect to the database. Frontend apps should use API endpoints.

## 2. Main Entities

Core entities:

- Users
- Tourist profiles
- Provider profiles
- Destinations
- Packages
- Package items
- Package add-ons
- Bookings
- Booking items
- Payments
- Commissions
- Payouts
- Notifications
- Support tickets
- Reviews
- Files
- Audit logs

## 3. Enums

```prisma
enum UserRole {
  TOURIST
  PROVIDER
  ADMIN
  SUPPORT
  FINANCE
}

enum Language {
  EN
  UR
  ZH
}

enum PackageType {
  SOLO
  COUPLE
  FAMILY
  GROUP
  SHARING
  PRIVATE
}

enum PackageTier {
  BASIC
  STANDARD
  PREMIUM
  LUXURY
}

enum ServiceType {
  HOTEL
  TRANSPORT
  GUIDE
  HIKING_GUIDE
  RESTAURANT
  PHOTOGRAPHY
  ACTIVITY
}

enum ProviderStatus {
  PENDING_REVIEW
  APPROVED
  REJECTED
  SUSPENDED
}

enum BookingStatus {
  DRAFT
  REQUEST_SUBMITTED
  CALL_PENDING
  TOURIST_CONFIRMED
  PAYMENT_PENDING
  ADVANCE_PAID
  FULLY_PAID
  PROVIDER_SELECTION
  PROVIDER_PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
  REFUNDED
  REQUIRES_ADMIN_ACTION
}

enum PaymentStatus {
  PENDING
  PROOF_SUBMITTED
  VERIFIED
  REJECTED
  REFUNDED
}

enum AssignmentStatus {
  PENDING_PROVIDER
  ACCEPTED
  REJECTED
  CANCELLED
}
```

## 4. Prisma Starter Schema

```prisma
model User {
  id                String          @id @default(uuid())
  fullName          String
  email             String?         @unique
  phone             String?         @unique
  passwordHash      String?
  role              UserRole
  preferredLanguage Language        @default(EN)
  isActive          Boolean         @default(true)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  touristProfile    TouristProfile?
  providerProfile   Provider?
  auditLogs         AuditLog[]
}

model TouristProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  country   String?
  whatsapp  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  bookings  Booking[]
}

model Provider {
  id                  String         @id @default(uuid())
  userId              String?        @unique
  businessName         String
  ownerName            String
  phone                String
  whatsapp             String?
  email                String?
  serviceCategory      ServiceType
  location             String
  address              String?
  status               ProviderStatus @default(PENDING_REVIEW)
  priceRangeMin        Int?
  priceRangeMax        Int?
  capacity             Int?
  availabilityNotes    String?
  defaultCommissionRate Decimal?      @db.Decimal(5, 2)
  rejectionReason      String?
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  user                 User?          @relation(fields: [userId], references: [id])
  services             ProviderService[]
  files                FileAsset[]
  bookingItems         BookingItem[]
  payouts              Payout[]
}

model ProviderService {
  id              String      @id @default(uuid())
  providerId      String
  serviceType     ServiceType
  title           String
  description     String?
  location        String?
  basePrice       Int
  currency        String      @default("PKR")
  capacity        Int?
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  provider        Provider    @relation(fields: [providerId], references: [id])
  availability    ProviderAvailability[]
  bookingItems    BookingItem[]
}

model ProviderAvailability {
  id                String          @id @default(uuid())
  providerServiceId String
  date              DateTime
  availableCapacity Int?
  isAvailable       Boolean         @default(true)
  note              String?
  createdAt         DateTime        @default(now())

  providerService   ProviderService @relation(fields: [providerServiceId], references: [id])

  @@unique([providerServiceId, date])
}

model Destination {
  id               String    @id @default(uuid())
  name             String
  slug             String    @unique
  shortDescription String?
  description      String?
  imageUrl         String?
  isActive         Boolean   @default(true)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  packages         Package[]
}

model Package {
  id                 String       @id @default(uuid())
  destinationId       String
  title              String
  slug               String       @unique
  type               PackageType
  tier               PackageTier
  description        String?
  durationDays       Int
  durationNights     Int
  startingPrice      Int
  currency           String       @default("PKR")
  coverImageUrl      String?
  cancellationPolicy String?
  isActive           Boolean      @default(true)
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  destination        Destination  @relation(fields: [destinationId], references: [id])
  items              PackageItem[]
  addons             PackageAddon[]
  bookings           Booking[]
}

model PackageItem {
  id          String      @id @default(uuid())
  packageId   String
  serviceType ServiceType
  title       String
  description String?
  quantity    Int?
  isRequired  Boolean     @default(true)
  createdAt   DateTime    @default(now())

  package     Package     @relation(fields: [packageId], references: [id])
}

model PackageAddon {
  id          String      @id @default(uuid())
  packageId   String
  serviceType ServiceType
  title       String
  description String?
  price       Int
  currency    String      @default("PKR")
  isActive    Boolean     @default(true)

  package     Package     @relation(fields: [packageId], references: [id])
}

model Booking {
  id                     String        @id @default(uuid())
  touristProfileId        String?
  packageId              String?
  status                 BookingStatus @default(REQUEST_SUBMITTED)
  fullName               String
  phone                  String
  whatsapp               String?
  email                  String?
  country                String?
  preferredLanguage      Language      @default(EN)
  travelStartDate        DateTime
  travelEndDate          DateTime
  travelersCount         Int
  travelerType           PackageType
  tier                   PackageTier
  pickupCity             String?
  specialRequests        String?
  preferredPaymentMethod String?
  callNotes              String?
  callConfirmedAt        DateTime?
  callConfirmedById      String?
  totalAmount            Int?
  amountPaid             Int           @default(0)
  currency               String        @default("PKR")
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt

  touristProfile         TouristProfile? @relation(fields: [touristProfileId], references: [id])
  package                Package?        @relation(fields: [packageId], references: [id])
  bookingItems           BookingItem[]
  payments               Payment[]
  commissions            Commission[]
  supportTickets         SupportTicket[]
}

model BookingItem {
  id                String           @id @default(uuid())
  bookingId          String
  providerId         String
  providerServiceId  String?
  serviceType        ServiceType
  status             AssignmentStatus @default(PENDING_PROVIDER)
  price              Int
  commissionRate     Decimal          @db.Decimal(5, 2)
  commissionAmount   Int
  providerNotes      String?
  acceptedAt         DateTime?
  rejectedAt         DateTime?
  rejectionReason    String?
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt

  booking            Booking          @relation(fields: [bookingId], references: [id])
  provider           Provider         @relation(fields: [providerId], references: [id])
  providerService    ProviderService? @relation(fields: [providerServiceId], references: [id])
}

model Payment {
  id              String        @id @default(uuid())
  bookingId        String
  amount           Int
  currency         String        @default("PKR")
  method           String
  status           PaymentStatus @default(PENDING)
  referenceNumber  String?
  proofFileId      String?
  verifiedById     String?
  verifiedAt       DateTime?
  rejectionReason  String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  booking          Booking       @relation(fields: [bookingId], references: [id])
}

model Commission {
  id             String   @id @default(uuid())
  bookingId       String
  bookingItemId   String?
  serviceType     ServiceType
  grossAmount     Int
  commissionRate  Decimal  @db.Decimal(5, 2)
  commissionAmount Int
  createdAt       DateTime @default(now())

  booking         Booking  @relation(fields: [bookingId], references: [id])
}

model Payout {
  id          String   @id @default(uuid())
  providerId  String
  amount      Int
  currency    String   @default("PKR")
  status      String   @default("PENDING")
  note        String?
  paidAt      DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  provider    Provider @relation(fields: [providerId], references: [id])
}

model FileAsset {
  id          String   @id @default(uuid())
  providerId  String?
  url         String
  storageKey  String
  fileName    String
  mimeType    String
  sizeBytes   Int?
  purpose     String
  createdAt   DateTime @default(now())

  provider    Provider? @relation(fields: [providerId], references: [id])
}

model Notification {
  id          String   @id @default(uuid())
  userId      String?
  channel     String
  title       String
  message     String
  status      String   @default("PENDING")
  metadata    Json?
  sentAt      DateTime?
  createdAt   DateTime @default(now())
}

model SupportTicket {
  id          String   @id @default(uuid())
  bookingId   String?
  subject     String
  message     String
  status      String   @default("OPEN")
  priority    String   @default("NORMAL")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  booking     Booking? @relation(fields: [bookingId], references: [id])
}

model Review {
  id          String   @id @default(uuid())
  bookingId   String
  rating      Int
  comment     String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  action      String
  entityType  String
  entityId    String?
  metadata    Json?
  createdAt   DateTime @default(now())

  user        User?    @relation(fields: [userId], references: [id])
}
```

## 5. Important Indexes

Add indexes for:

- `Package.slug`
- `Destination.slug`
- `Booking.status`
- `Booking.phone`
- `Booking.travelStartDate`
- `Provider.status`
- `Provider.serviceCategory`
- `Provider.location`
- `ProviderAvailability.date`
- `Payment.status`
- `BookingItem.status`

## 6. MVP Database Priority

Build these first:

1. `User`
2. `TouristProfile`
3. `Provider`
4. `ProviderService`
5. `Destination`
6. `Package`
7. `PackageItem`
8. `Booking`
9. `BookingItem`
10. `Payment`
11. `Commission`
12. `FileAsset`
13. `Notification`

Add support, reviews, reports, and advanced payouts after the core booking flow works.

## 7. Data Flow Rules

- Tourist website never writes directly to database.
- Admin dashboard never writes directly to database.
- Provider dashboard never writes directly to database.
- All writes go through NestJS API.
- Prisma handles database access.
- Supabase stores PostgreSQL data.
- Cloudflare R2 or Supabase Storage stores files.

## 8. Seed Data For MVP

Destinations:

- Swat
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

Provider categories:

- Hotel
- Transport
- Guide
- Hiking guide
- Restaurant
- Photographer
- Activity provider

## 9. Current Prototype Form Fields To Preserve

The current website is still static and does not persist this data. These are the fields already represented in the prototype and should be included when the admin/API/database phase begins.

### Tourist account / signup

| UI field | Suggested database field | Notes |
| --- | --- | --- |
| First name | `firstName` | Keep separate from last name for greetings and admin search. |
| Last name | `lastName` | Required. |
| Email address | `email` | Unique account identifier; verify before activation. |
| Country | `country` | Store ISO country code as well as display name. |
| Phone country code | `phoneCountryCode` | Store separately from the local phone number. |
| Phone number | `phone` | Normalize to E.164 in the API; do not store formatting spaces. |
| CNIC | `cnic` | Pakistan only; store encrypted or protected, with a masked admin display. |
| Passport number | `passportNumber` | International travelers; store encrypted or protected. |
| Passport expiry | `passportExpiry` | Validate that it is still valid for the trip. |
| Home address | `address` | Consider splitting into address, city, and country later. |
| Date of birth | `dateOfBirth` | Sensitive field; collect only if required by policy or provider booking. |
| Preferred language | `preferredLanguage` | Maps to `Language` enum: EN, UR, ZH. |
| Password | `passwordHash` | Never store the raw password. |
| Terms checkbox | `termsAcceptedAt` | Store acceptance timestamp and terms version, not only true/false. |

The identity rule in the current UI is: Pakistan shows CNIC; every other selected country shows passport number and expiry. For production, keep `identityType` (`CNIC` or `PASSPORT`) explicit instead of inferring it forever from country, because a Pakistani citizen may travel from another country and an international guest may have a different passport-issuing country.

### Other current website fields

- Package: destination, title, slug, type, tier, duration, route, starting price, image, services, itinerary, inclusions, exclusions, cancellation policy, and active status.
- Custom trip request: destination ideas, days, traveler type, budget range, preferred start date, stay level, transport preference, interests, full name, phone, email, and special requests.
- Booking request: selected package, traveler name, email, phone, start date, return date, traveler count, destination, stay tier, pickup city, payment preference, and special requests.
- Provider registration: business name, owner name, phone/WhatsApp, email, service category, city/location, address, price range, capacity, and review consent.

### Recommended fields before the dynamic/admin phase

- `emailVerifiedAt` and `phoneVerifiedAt` for account security.
- `emergencyContactName` and `emergencyContactPhone` for active trips.
- `nationality` and `passportIssuingCountry` as separate fields from phone country.
- `termsVersion` and `privacyVersion` for auditable consent.
- `deletedAt` for soft deletion and privacy requests.
- `createdBy`, `updatedBy`, and status history for admin changes.

These prototype fields are intentionally documented here so the later admin dashboard, API contracts, and Prisma/Supabase schema can be generated from one agreed field inventory.

## 10. Live Support and Service Scan Model

The current website includes a frontend-only support widget with chat, quick actions, phone, and WhatsApp entry points. When backend work starts, preserve these concepts:

- `SupportConversation`: id, userId, bookingId, status, priority, assignedAgentId, lastMessageAt, createdAt, closedAt.
- `SupportMessage`: conversationId, senderType, senderId, body, attachmentFileId, sentAt, readAt.
- `ServiceVoucher`: bookingId, voucherCode, qrPayload, status, expiresAt, createdAt.
- `ServiceHandoff`: voucherId, bookingItemId, providerId, serviceType, scannedAt, scannedByUserId, location, notes.
- `ServiceStatusEvent`: bookingItemId, status, actorType, actorId, note, occurredAt.

The QR payload should contain only a short signed voucher reference, never CNIC, passport, phone, or other sensitive data. Provider scanning should be authorized by provider account and should create an auditable handoff event. The tourist dashboard can then receive status changes through a realtime channel and show hotel check-in, transport pickup, guide arrival, meal completion, and issue resolution without trusting client-side status changes.
