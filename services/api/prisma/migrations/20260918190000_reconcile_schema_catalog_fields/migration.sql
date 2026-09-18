-- Reconcile schema fields that were added to schema.prisma but never migrated.
-- AlterTable
ALTER TABLE "Booking"
  ADD COLUMN     "country" TEXT,
  ADD COLUMN     "preferredPaymentMethod" TEXT,
  ADD COLUMN     "tier" TEXT,
  ADD COLUMN     "travelerType" TEXT,
  ADD COLUMN     "whatsapp" TEXT,
  ALTER COLUMN "pickupCity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Package"
  ADD COLUMN     "route" TEXT,
  ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'Standard';