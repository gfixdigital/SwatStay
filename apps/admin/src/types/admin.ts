export type BookingStatus = "Call pending" | "Tourist confirmed" | "Provider selection" | "Active" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending proof" | "Proof submitted" | "Verified" | "Rejected";
export type ProviderApprovalStatus = "Pending review" | "Approved" | "Rejected";
export type TicketStatus = "Open" | "In progress" | "Resolved";
export type Priority = "Urgent" | "High" | "Normal";
export type ServiceType = "Hotel" | "Transport" | "Guide" | "Restaurant" | "Activity";

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
  serviceType: ServiceType;
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
  submittedAt: string;
  status: PaymentStatus;
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
  role: string;
  activeQueue: number;
};
