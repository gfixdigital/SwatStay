// apps/web/data/dashboardStates.ts
//
// Static, frontend-only trip data used to preview every traveler dashboard
// state: no active trip, a single active trip, multiple upcoming trips, a
// completed trip, and a cancelled trip. Field names loosely track the
// booking fields in ApiContract.md / DatabaseSchema.md so a later fetch()
// can replace these constants without changing DashboardView.tsx.

export type ServiceStatus = "Ready" | "Pending" | "Checked in";

export type DashboardServiceIconKey = "hotel" | "transport" | "guide" | "meals";

export type DashboardServiceItem = {
  id: string;
  title: string;
  provider: string;
  detail: string;
  status: ServiceStatus;
  iconKey: DashboardServiceIconKey;
};

export type DashboardTripStatus = "ACTIVE" | "PAYMENT_PENDING" | "COMPLETED" | "CANCELLED";

export type DashboardTrip = {
  id: string;
  bookingCode: string;
  tierLabel: string;
  title: string;
  route: string;
  status: DashboardTripStatus;
  travelDatesLabel: string;
  travelersLabel: string;
  pickupLabel: string;
  voucherId: string;
  services: DashboardServiceItem[];
  cancelledReason?: string;
};

export const mockActiveTrip: DashboardTrip = {
  id: "trip-active-1",
  bookingCode: "SS-2048",
  tierLabel: "COUPLE STANDARD",
  title: "Kalam, 3 days",
  route: "Mingora → Kalam → Ushu Forest",
  status: "ACTIVE",
  travelDatesLabel: "12–14 Oct",
  travelersLabel: "2 people",
  pickupLabel: "Mingora · 08:00",
  voucherId: "SWT-2048-KLM",
  services: [
    { id: "hotel", title: "Hotel check-in", provider: "Kalam View Guesthouse", detail: "Arrival desk · 14:00", status: "Ready", iconKey: "hotel" },
    { id: "transport", title: "Private transport", provider: "Swat Valley 4x4", detail: "Mingora pickup · 08:00", status: "Ready", iconKey: "transport" },
    { id: "guide", title: "Ushu Forest guide", provider: "Naveed Khan · Local guide", detail: "Day 2 · 09:30", status: "Pending", iconKey: "guide" },
    { id: "meals", title: "Breakfast and dinner", provider: "Kalam View Guesthouse", detail: "Included in stay", status: "Ready", iconKey: "meals" },
  ],
};

export const mockUpcomingTrips: DashboardTrip[] = [
  mockActiveTrip,
  {
    id: "trip-pending-1",
    bookingCode: "SS-2091",
    tierLabel: "FAMILY BASIC",
    title: "Malam Jabba, 2 days",
    route: "Mingora → Malam Jabba",
    status: "PAYMENT_PENDING",
    travelDatesLabel: "20–21 Nov",
    travelersLabel: "4 people",
    pickupLabel: "Mingora · 07:30",
    voucherId: "SWT-2091-MJB",
    services: [],
  },
];

export const mockCompletedTrip: DashboardTrip = {
  id: "trip-completed-1",
  bookingCode: "SS-1899",
  tierLabel: "PRIVATE PREMIUM",
  title: "Bahrain, 2 days",
  route: "Mingora → Bahrain",
  status: "COMPLETED",
  travelDatesLabel: "3–4 Sep",
  travelersLabel: "2 people",
  pickupLabel: "Mingora · 08:00",
  voucherId: "SWT-1899-BHR",
  services: [
    { id: "hotel", title: "Hotel stay", provider: "Riverside Bahrain Inn", detail: "Completed", status: "Ready", iconKey: "hotel" },
    { id: "transport", title: "Private transport", provider: "Swat Valley 4x4", detail: "Completed", status: "Ready", iconKey: "transport" },
    { id: "meals", title: "Breakfast and dinner", provider: "Riverside Bahrain Inn", detail: "Completed", status: "Ready", iconKey: "meals" },
  ],
};

export const mockCancelledTrip: DashboardTrip = {
  id: "trip-cancelled-1",
  bookingCode: "SS-1765",
  tierLabel: "FAMILY BASIC",
  title: "Madyan, 2 days",
  route: "Mingora → Madyan",
  status: "CANCELLED",
  travelDatesLabel: "5–6 Aug",
  travelersLabel: "3 people",
  pickupLabel: "Mingora · 08:00",
  voucherId: "SWT-1765-MDY",
  cancelledReason: "Cancelled by traveler ahead of the travel date.",
  services: [],
};
