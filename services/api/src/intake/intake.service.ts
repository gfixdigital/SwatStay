import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { ContactDto } from "./dto/contact.dto";
import { CustomTripDto } from "./dto/custom-trip.dto";
import { ProviderRegistrationDto } from "./dto/provider-registration.dto";

@Injectable()
export class IntakeService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async contact(input: ContactDto) {
    if (!input.consent) throw new BadRequestException("Terms and Privacy consent is required");
    const record = await this.prisma.contactSubmission.create({ data: { name: input.name, email: input.email, phone: input.phone, subject: input.subject, message: input.message, consent: input.consent } });
    await this.audit.record("CONTACT_SUBMITTED", "ContactSubmission", record.id, undefined, { source: "website" });
    return { reference: record.id, status: record.status };
  }

  async customTrip(input: CustomTripDto, userId?: string) {
    if (!input.consent) throw new BadRequestException("Terms and Privacy consent is required");
    const record = await this.prisma.customTripRequest.create({ data: { userId, name: input.name, email: input.email, phone: input.phone, destination: input.destination, travelStart: input.travelStart ? new Date(input.travelStart) : undefined, travelEnd: input.travelEnd ? new Date(input.travelEnd) : undefined, travelers: input.travelers, pickupCity: input.pickupCity, accommodation: input.accommodation, interests: input.interests, budget: input.budget, notes: input.notes, consent: input.consent } });
    await this.audit.record("CUSTOM_TRIP_SUBMITTED", "CustomTripRequest", record.id, userId, { source: "website" });
    return { reference: record.id, status: record.status };
  }

  async providerRegistration(input: ProviderRegistrationDto, userId?: string) {
    if (!input.consent) throw new BadRequestException("Terms and Privacy consent is required");
    const record = await this.prisma.providerRegistration.create({ data: { userId, businessName: input.businessName, ownerName: input.ownerName, email: input.email, phone: input.phone, serviceCategory: input.serviceCategory, location: input.location, address: input.address, capacity: input.capacity, description: input.description, consent: input.consent } });
    await this.audit.record("PROVIDER_REGISTRATION_SUBMITTED", "ProviderRegistration", record.id, userId, { source: "website" });
    return { reference: record.id, status: record.status };
  }
}
