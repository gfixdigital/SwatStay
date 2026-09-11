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
};

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

export type AdminPackage = { id: string; title: string; slug: string; destination: string; packageType: string; tier: string; days: number; nights: number; price: number; currency: string; services: string[]; itinerary: string[]; status: "Active" | "Inactive"; seoTitle: string; seoDescription: string; };
export type DestinationAdmin = { id: string; name: string; slug: string; shortDescription: string; fullDescription: string; bestFor: string; travelTime: string; popularServices: string[]; status: "Active" | "Inactive"; seoTitle: string; seoDescription: string; };
export type CommissionRecord = { id: string; bookingReference: string; serviceType: ServiceType; provider: string; grossAmount: number; commissionRate: number; commissionAmount: number; status: "Pending" | "Recorded" | "Cleared"; date: string; };
export type PayoutRecord = { id: string; provider: string; amount: number; pendingBalance: number; paidAmount: number; method: string; status: "Pending" | "Processing" | "Paid"; note: string; };
export type AuditLog = { id: string; adminName: string; action: string; entityType: string; entityId: string; time: string; ip: string; };
export type MediaAsset = { id: string; name: string; type: string; url: string; size: string; usedBy: string; };
export type ContentSection = { id: string; title: string; area: string; preview: string; status: "Published" | "Draft"; };
