import type { Booking, Payment, Provider, ProviderSuggestion, SupportTicket, TeamMember } from "../types/admin";

export const bookings: Booking[] = [
  { id: "b-2048", reference: "SS-2048", touristName: "Ayesha Khan", phone: "+92 300 1234567", email: "ayesha@example.com", country: "Pakistan", preferredLanguage: "Urdu", packageName: "Couple Standard - Kalam", destination: "Kalam", travelStartDate: "2026-10-12", travelEndDate: "2026-10-14", travelers: 2, pickupCity: "Mingora", specialRequests: "Quiet room, vegetarian dinner, and no late-night road travel.", status: "Tourist confirmed", paymentStatus: "Proof submitted", assignedSupportMember: "Sana Iqbal", totalAmount: 48000, amountPaid: 15000, paymentMethod: "Bank transfer", createdAt: "2026-10-08 14:10", priority: "Normal", lastContactAttempt: "Confirmed 8 Oct, 4:30 PM", callNotes: "Pickup point shared. Reconfirm hotel room and meal timing one day before departure." },
  { id: "b-2051", reference: "SS-2051", touristName: "Hamza Ali", phone: "+92 333 7865421", email: "hamza@example.com", country: "Pakistan", preferredLanguage: "Urdu", packageName: "Family Basic - Swat", destination: "Swat", travelStartDate: "2026-10-18", travelEndDate: "2026-10-19", travelers: 5, pickupCity: "Islamabad", specialRequests: "Two children and one senior traveler.", status: "Call pending", paymentStatus: "Pending proof", assignedSupportMember: "Ahmed Shah", totalAmount: 32000, amountPaid: 0, paymentMethod: "EasyPaisa", createdAt: "2026-10-09 09:25", priority: "High", lastContactAttempt: "No attempt yet", callNotes: "" },
  { id: "b-2053", reference: "SS-2053", touristName: "Li Wei", phone: "+86 138 0013 8000", email: "li.wei@example.com", country: "China", preferredLanguage: "Chinese", packageName: "Private Premium - Malam Jabba", destination: "Malam Jabba", travelStartDate: "2026-10-20", travelEndDate: "2026-10-22", travelers: 3, pickupCity: "Islamabad", specialRequests: "English-speaking guide and airport pickup.", status: "Call pending", paymentStatus: "Pending proof", assignedSupportMember: "Sana Iqbal", totalAmount: 74000, amountPaid: 0, paymentMethod: "Bank transfer", createdAt: "2026-10-09 11:40", priority: "Urgent", lastContactAttempt: "WhatsApp sent 9 Oct, 12:05 PM", callNotes: "Traveler requested a callback after 3:00 PM Pakistan time." },
  { id: "b-2042", reference: "SS-2042", touristName: "Omar Raza", phone: "+92 301 4455667", email: "omar@example.com", country: "Pakistan", preferredLanguage: "English", packageName: "Couple Standard - Kalam", destination: "Kalam", travelStartDate: "2026-10-10", travelEndDate: "2026-10-12", travelers: 2, pickupCity: "Peshawar", specialRequests: "Early pickup preferred.", status: "Active", paymentStatus: "Verified", assignedSupportMember: "Asim Khan", totalAmount: 52000, amountPaid: 52000, paymentMethod: "Bank transfer", createdAt: "2026-10-04 16:20", priority: "Normal", lastContactAttempt: "Confirmed 5 Oct, 10:15 AM", callNotes: "All providers confirmed. Driver contact shared with tourist." },
  { id: "b-2055", reference: "SS-2055", touristName: "Sara Ahmed", phone: "+92 321 9087654", email: "sara@example.com", country: "Pakistan", preferredLanguage: "English", packageName: "Family Basic - Swat", destination: "Bahrain", travelStartDate: "2026-10-25", travelEndDate: "2026-10-27", travelers: 4, pickupCity: "Rawalpindi", specialRequests: "Need adjoining rooms if available.", status: "Provider selection", paymentStatus: "Verified", assignedSupportMember: "Ahmed Shah", totalAmount: 56000, amountPaid: 20000, paymentMethod: "JazzCash", createdAt: "2026-10-09 15:30", priority: "Normal", lastContactAttempt: "Confirmed 9 Oct, 5:10 PM", callNotes: "Traveler accepted the revised three-day itinerary." },
];

export const providers: Provider[] = [
  { id: "p-101", name: "Pine View Hotel Kalam", ownerName: "Javed Khan", serviceType: "Hotel", location: "Kalam", phone: "+92 946 000101", documentsStatus: "Complete", photosStatus: "Needs review", commissionRate: 10, capacity: "18 rooms", submittedAt: "2026-10-08", status: "Pending review" },
  { id: "p-102", name: "Swat River Transport", ownerName: "Faisal Ahmad", serviceType: "Transport", location: "Mingora", phone: "+92 946 000102", documentsStatus: "Needs review", photosStatus: "Complete", commissionRate: 8, capacity: "6 vehicles", submittedAt: "2026-10-09", status: "Pending review" },
  { id: "p-103", name: "Bahrain Family Restaurant", ownerName: "Noman Ali", serviceType: "Restaurant", location: "Bahrain", phone: "+92 946 000103", documentsStatus: "Missing", photosStatus: "Complete", commissionRate: 7, capacity: "45 guests", submittedAt: "2026-10-09", status: "Pending review" },
];

export const payments: Payment[] = [
  { id: "pay-301", bookingReference: "SS-2048", touristName: "Ayesha Khan", amount: 15000, method: "Bank transfer", referenceNumber: "FT-882410", proofFileName: "bank-transfer-receipt.jpg", submittedAt: "2026-10-08 17:05", status: "Proof submitted", note: "Awaiting finance review." },
  { id: "pay-302", bookingReference: "SS-2055", touristName: "Sara Ahmed", amount: 20000, method: "JazzCash", referenceNumber: "JC-420815", proofFileName: "jazzcash-receipt.png", submittedAt: "2026-10-09 17:24", status: "Verified", verifiedBy: "Adnan", verifiedAt: "2026-10-09 17:40", note: "Reference matched." },
  { id: "pay-303", bookingReference: "SS-2042", touristName: "Omar Raza", amount: 52000, method: "Bank transfer", referenceNumber: "FT-881902", proofFileName: "full-payment-proof.pdf", submittedAt: "2026-10-05 12:14", status: "Verified", verifiedBy: "Asim", verifiedAt: "2026-10-05 12:28", note: "Full payment received." },
];

export const supportTickets: SupportTicket[] = [
  { id: "SUP-81", bookingReference: "SS-2042", touristName: "Omar Raza", issueType: "Pickup timing", summary: "Driver arrival needs to move 30 minutes earlier.", priority: "High", status: "In progress", assignedTeamMember: "Asim Khan", updatedAt: "10 minutes ago" },
  { id: "SUP-82", bookingReference: "SS-2048", touristName: "Ayesha Khan", issueType: "Meal preference", summary: "Confirm vegetarian dinner with hotel before arrival.", priority: "Normal", status: "Open", assignedTeamMember: "Sana Iqbal", updatedAt: "35 minutes ago" },
  { id: "SUP-83", bookingReference: "SS-2048", touristName: "Ayesha Khan", issueType: "Trip change: Add activity", summary: "Traveler asked to discuss adding a guided activity and requested a callback before any booking update.", priority: "Normal", status: "Open", assignedTeamMember: "Sana Iqbal", updatedAt: "48 minutes ago" },
  { id: "SUP-77", bookingReference: "SS-2040", touristName: "Usman Tariq", issueType: "Hotel invoice", summary: "Tourist requested a corrected invoice name.", priority: "Normal", status: "Resolved", assignedTeamMember: "Ahmed Shah", updatedAt: "Yesterday" },
];

export const providerSuggestions: ProviderSuggestion[] = [
  { id: "s-h1", name: "Pine View Hotel Kalam", serviceType: "Hotel", location: "Kalam", capacity: "1 double room", price: 18000, commissionRate: 10, availability: "Available for selected dates", matchScore: 92 },
  { id: "s-h2", name: "Kalam Riverside Inn", serviceType: "Hotel", location: "Kalam", capacity: "2 standard rooms", price: 16500, commissionRate: 9, availability: "Room hold needed", matchScore: 86 },
  { id: "s-t1", name: "Swat River Transport", serviceType: "Transport", location: "Mingora", capacity: "4 passengers", price: 14500, commissionRate: 8, availability: "Driver available", matchScore: 94 },
  { id: "s-t2", name: "Upper Swat Drives", serviceType: "Transport", location: "Saidu Sharif", capacity: "6 passengers", price: 16000, commissionRate: 8, availability: "Confirmation required", matchScore: 82 },
  { id: "s-g1", name: "Ushu Valley Hiking Support", serviceType: "Guide", location: "Kalam", capacity: "Up to 6 travelers", price: 5500, commissionRate: 10, availability: "Available on Day 2", matchScore: 90 },
  { id: "s-r1", name: "Kalam Family Kitchen", serviceType: "Restaurant", location: "Kalam", capacity: "Table for 6", price: 6000, commissionRate: 7, availability: "Meal plan available", matchScore: 87 },
  { id: "s-a1", name: "Malam Jabba Activity Desk", serviceType: "Activity", location: "Malam Jabba", capacity: "Up to 8 travelers", price: 7500, commissionRate: 10, availability: "Weather dependent", matchScore: 79 },
];

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Sana Iqbal", role: "Support", activeQueue: 2 },
  { id: "tm-2", name: "Ahmed Shah", role: "Operations", activeQueue: 2 },
  { id: "tm-3", name: "Asim Khan", role: "Operations", activeQueue: 1 },
];

export const formatPkr = (amount: number) => `PKR ${amount.toLocaleString("en-PK")}`;
