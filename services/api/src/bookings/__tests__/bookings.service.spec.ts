import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BookingsService } from "../bookings.service";
import { BookingStatus, Language } from "../../common/enums";

function createMockPrisma() {
  return {
    package: { findFirst: jest.fn() },
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    booking: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    bookingTeamAssignment: { create: jest.fn() },
    $transaction: jest.fn((fn: (tx: any) => Promise<any>) => fn({
      user: { create: jest.fn().mockResolvedValue({ id: "user-1", fullName: "Test", email: "test@test.com", role: "TOURIST" }),
              update: jest.fn().mockResolvedValue({}) },
      booking: { create: jest.fn().mockResolvedValue({
        id: "booking-1",
        reference: "SS-ABC12345",
        touristId: "user-1",
        packageId: null,
        destination: "Kalam",
        travelStart: new Date("2026-10-10"),
        travelEnd: new Date("2026-10-12"),
        travelersCount: 2,
        status: "CALL_PENDING",
        package: null,
        tourist: { fullName: "Test User", email: "test@test.com" },
      }) },
    })),
  };
}

function createMockAudit() {
  return { record: jest.fn(), recordBookingEvent: jest.fn() };
}

describe("BookingsService", () => {
  let service: BookingsService;
  let prisma: ReturnType<typeof createMockPrisma>;
  let audit: ReturnType<typeof createMockAudit>;

  beforeEach(() => {
    prisma = createMockPrisma();
    audit = createMockAudit();
    service = new BookingsService(prisma as any, audit as any);
  });

  describe("create", () => {
    const validInput = {
      fullName: "Adnan Khan",
      email: "adnan@example.com",
      phone: "+923001234567",
      preferredLanguage: Language.EN,
      destination: "Kalam",
      travelStart: "2026-10-10",
      travelEnd: "2026-10-12",
      travelersCount: 2,
      pickupCity: "Islamabad",
      consent: true,
    };

    it("should create a booking with CALL_PENDING status", async () => {
      const result = await service.create(validInput);
      expect(result).toHaveProperty("bookingId");
      expect(result).toHaveProperty("reference");
      expect(result).toHaveProperty("status", "CALL_PENDING");
    });

    it("should generate a reference starting with SS-", async () => {
      const result = await service.create(validInput);
      expect(result.reference).toMatch(/^SS-[A-F0-9]{8}$/);
    });

    it("should record a BOOKING_REQUEST_SUBMITTED audit event", async () => {
      await service.create(validInput);
      expect(audit.record).toHaveBeenCalledWith(
        "BOOKING_REQUEST_SUBMITTED",
        "Booking",
        "booking-1",
        undefined,
        expect.objectContaining({ reference: expect.stringMatching(/^SS-/) }),
      );
    });

    it("should throw when consent is missing", async () => {
      await expect(
        service.create({ ...validInput, consent: false }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw when travel end date is before start date", async () => {
      await expect(
        service.create({
          ...validInput,
          travelStart: "2026-10-15",
          travelEnd: "2026-10-10",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw when travel end equals start date", async () => {
      await expect(
        service.create({
          ...validInput,
          travelStart: "2026-10-10",
          travelEnd: "2026-10-10",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw when package slug is invalid", async () => {
      prisma.package.findFirst.mockResolvedValue(null);
      await expect(
        service.create({ ...validInput, packageSlug: "nonexistent-package" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should accept optional fields", async () => {
      const result = await service.create({
        ...validInput,
        whatsapp: "+923001234567",
        country: "Pakistan",
        travelerType: "Couple",
        tier: "Standard",
        preferredPaymentMethod: "BANK_TRANSFER",
        specialRequests: "Need vegetarian meals",
      });
      expect(result).toHaveProperty("bookingId");
    });

    it("should use package destination when packageSlug is provided", async () => {
      prisma.package.findFirst.mockResolvedValue({
        id: "pkg-1",
        name: "Test Package",
        slug: "test-package",
        destination: { name: "Malam Jabba", slug: "malam-jabba" },
      });
      const result = await service.create({
        ...validInput,
        packageSlug: "test-package",
      });
      expect(result).toHaveProperty("bookingId");
    });
  });
});
