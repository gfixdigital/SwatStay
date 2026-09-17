export type BookingStatus = "Call pending" | "Tourist confirmed" | "Provider selection" | "Active" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending proof" | "Proof submitted" | "Verified" | "Rejected";
export type ProviderApprovalStatus = "Pending review" | "Approved" | "Rejected";
export type TicketStatus = "Open" | "In progress" | "Resolved";
export type Priority = "Urgent" | "High" | "Normal";
export type ServiceType = "Hotel" | "Transport" | "Guide" | "Restaurant" | "Activity";
export type ProviderCategory = "Hotel" | "Transport" | "Tour guide" | "Hiking guide" | "Restaurant" | "Photographer" | "Activity provider";
export type AdminTeamRole = "Admin" | "Operations" | "Support" | "Finance" | "QA";

export type Booking = {
  id: string;
  reference: string;
  touristName: string;
  phone: string;
  email: string;
  country: string;
  preferredLanguage: "English" | "Urdu" | "Chinese";
  packageName: string;
  destination: string;
  travelStartDate: string;
  travelEndDate: string;
  travelers: number;
  pickupCity: string;
  specialRequests: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  assignedSupportMember: string;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: string;
  createdAt: string;
  priority: Priority;
  lastContactAttempt: string;
  callNotes: string;
  providerArrangements?: ProviderArrangement[];
  assignmentHistory?: BookingAssignmentLog[];
};

export type ProviderArrangement = {
  serviceType: ServiceType;
  providerId: string;
  providerName: string;
  status: "Selected" | "Confirmed" | "Needs follow-up";
  coordinatorNote?: string;
};

export type BookingAssignmentLog = {
  id: string;
  previousMember: string;
  assignedMember: string;
  reason: string;
  assignedBy: string;
  assignedAt: string;
};

export type Provider = {
  id: string;
  name: string;
  ownerName: string;
  serviceType: ProviderCategory;
  location: string;
  phone: string;
  documentsStatus: "Complete" | "Needs review" | "Missing";
  photosStatus: "Complete" | "Needs review" | "Missing";
  commissionRate: number;
  capacity: string;
  submittedAt: string;
  status: ProviderApprovalStatus;
};

export type Payment = {
  id: string;
  bookingReference: string;
  touristName: string;
  amount: number;
  method: string;
  referenceNumber: string;
  proofFileName?: string;
  submittedAt: string;
  status: PaymentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  note?: string;
};

export type SupportTicket = {
  id: string;
  bookingReference: string;
  touristName: string;
  issueType: string;
  summary: string;
  priority: Priority;
  status: TicketStatus;
  assignedTeamMember: string;
  updatedAt: string;
  tags?: string[];
  messages?: SupportMessage[];
};

export type SupportMessage = { id: string; author: string; audience: "Traveler" | "Internal"; body: string; time: string; };

export type ProviderSuggestion = {
  id: string;
  name: string;
  serviceType: ServiceType;
  location: string;
  capacity: string;
  price: number;
  commissionRate: number;
  availability: string;
  matchScore: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: AdminTeamRole;
  activeQueue: number;
};

export type AdminPackage = { id: string; title: string; slug: string; description: string; destination: string; packageType: string; tier: string; days: number; nights: number; price: number; currency: string; services: string[]; itinerary: string[]; addOns: string[]; cancellationSummary: string; coverImage: string; galleryImages: string[]; status: "Active" | "Inactive"; seoTitle: string; seoDescription: string; };
export type DestinationAdmin = { id: string; name: string; slug: string; shortDescription: string; fullDescription: string; bestFor: string; travelTime: string; popularServices: string[]; coverImage: string; galleryImages: string[]; status: "Active" | "Inactive"; seoTitle: string; seoDescription: string; };
export type CommissionRecord = { id: string; bookingReference: string; serviceType: ServiceType; provider: string; grossAmount: number; commissionRate: number; commissionAmount: number; status: "Pending" | "Recorded" | "Cleared"; date: string; };
export type PayoutRecord = { id: string; provider: string; amount: number; pendingBalance: number; paidAmount: number; method: string; status: "Pending" | "Processing" | "Paid"; note: string; };
export type AuditLog = { id: string; adminName: string; action: string; entityType: string; entityId: string; time: string; ip: string; };
export type MediaAsset = { id: string; name: string; type: string; url: string; size: string; usedBy: string; };
export type ContentField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "email" | "tel";
  value: string;
  required?: boolean;
  helpText?: string;
};
export type ContentSection = {
  id: string;
  title: string;
  area: "Homepage" | "Packages" | "Destinations" | "Forms" | "Help" | "Legal" | "Global";
  description: string;
  fields: ContentField[];
  status: "Published" | "Draft";
  updatedAt: string;
  updatedBy: string;
  version: number;
};
export type TripChangeType = "Change travel date" | "Change pickup city" | "Add traveler" | "Upgrade package" | "Add activity" | "Cancel trip" | "Other";
export type TripChangeStatus = "New" | "Callback scheduled" | "Under review" | "Approved" | "Rejected" | "Applied";
export type TripChangeLog = { id: string; actor: string; action: string; note: string; time: string; };
export type TripChangeRequest = {
  id: string;
  bookingId: string;
  bookingReference: string;
  touristName: string;
  phone: string;
  changeType: TripChangeType;
  message: string;
  currentValue: string;
  requestedValue: string;
  preferredCallbackAt: string;
  status: TripChangeStatus;
  priority: Priority;
  assignedTo: string;
  createdAt: string;
  resolutionNote: string;
  logs: TripChangeLog[];
};

export type VoucherStatus = "Draft" | "Active" | "Partially used" | "Completed" | "Expired" | "Revoked";
export type VoucherServiceStatus = "Ready" | "Completed" | "Issue reported" | "Cancelled";
export type VoucherDeliveryStatus = "Not prepared" | "Preview prepared" | "Preview opened";
export type VoucherService = {
  id: string;
  serviceType: ServiceType;
  providerId: string;
  providerName: string;
  scheduledFor: string;
  location: string;
  status: VoucherServiceStatus;
  completedAt?: string;
};
export type VoucherDelivery = {
  id: string;
  audience: "Traveler" | "Provider";
  recipient: string;
  channel: "Dashboard" | "Email" | "WhatsApp" | "Provider panel";
  status: VoucherDeliveryStatus;
  preparedAt?: string;
};
export type VoucherEvent = {
  id: string;
  type: "Created" | "Activated" | "Delivery prepared" | "Viewed" | "Scan accepted" | "Scan rejected" | "Revoked";
  actor: string;
  detail: string;
  occurredAt: string;
};
export type ServiceVoucher = {
  id: string;
  code: string;
  bookingId: string;
  bookingReference: string;
  touristName: string;
  touristPhone: string;
  packageName: string;
  travelStartDate: string;
  travelEndDate: string;
  status: VoucherStatus;
  createdAt: string;
  createdBy: string;
  expiresAt: string;
  services: VoucherService[];
  deliveries: VoucherDelivery[];
  events: VoucherEvent[];
};
