import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { AdminGuard } from "./components/AdminGuard";
import { AdminLoginPage } from "./pages/AdminLoginPage";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const BookingsPage = lazy(() => import("./pages/BookingsPage").then((module) => ({ default: module.BookingsPage })));
const BookingDetailPage = lazy(() => import("./pages/BookingDetailPage").then((module) => ({ default: module.BookingDetailPage })));
const CallQueuePage = lazy(() => import("./pages/CallQueuePage").then((module) => ({ default: module.CallQueuePage })));
const TripChangeRequestsPage = lazy(() => import("./pages/TripChangeRequestsPage").then((module) => ({ default: module.TripChangeRequestsPage })));
const VouchersPage = lazy(() => import("./pages/VouchersPage").then((module) => ({ default: module.VouchersPage })));
const PackagesPage = lazy(() => import("./pages/PackagesPage").then((module) => ({ default: module.PackagesPage })));
const DestinationsPage = lazy(() => import("./pages/DestinationsPage").then((module) => ({ default: module.DestinationsPage })));
const ProvidersPage = lazy(() => import("./pages/ProvidersPage").then((module) => ({ default: module.ProvidersPage })));
const ProviderSuggestionsPage = lazy(() => import("./pages/ProviderSuggestionsPage").then((module) => ({ default: module.ProviderSuggestionsPage })));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage").then((module) => ({ default: module.PaymentsPage })));
const CommissionsPage = lazy(() => import("./pages/CommissionsPage").then((module) => ({ default: module.CommissionsPage })));
const PayoutsPage = lazy(() => import("./pages/PayoutsPage").then((module) => ({ default: module.PayoutsPage })));
const SupportPage = lazy(() => import("./pages/SupportPage").then((module) => ({ default: module.SupportPage })));
const ContentPage = lazy(() => import("./pages/ContentPage").then((module) => ({ default: module.ContentPage })));
const MediaPage = lazy(() => import("./pages/MediaPage").then((module) => ({ default: module.MediaPage })));
const LanguagesPage = lazy(() => import("./pages/LanguagesPage").then((module) => ({ default: module.LanguagesPage })));
const TeamPage = lazy(() => import("./pages/TeamPage").then((module) => ({ default: module.TeamPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const AuditLogsPage = lazy(() => import("./pages/AuditLogsPage").then((module) => ({ default: module.AuditLogsPage })));
const CustomersPage = lazy(() => import("./pages/CustomersPage").then((module) => ({ default: module.CustomersPage })));
const TripsPage = lazy(() => import("./pages/TripsPage").then((module) => ({ default: module.TripsPage })));
const PromotionsPage = lazy(() => import("./pages/PromotionsPage").then((module) => ({ default: module.PromotionsPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((module) => ({ default: module.ReviewsPage })));
const LegalPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.LegalPage })));
const ContactInboxPage = lazy(() => import("./pages/ContactInboxPage").then((module) => ({ default: module.ContactInboxPage })));

export function App() {
 return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-snow"><div className="rounded-lg border border-border bg-white px-5 py-4 text-sm font-semibold text-pine">Loading admin workspace...</div></div>}><Routes><Route path="/login" element={<AdminLoginPage/>}/><Route element={<AdminGuard/>}><Route element={<AdminLayout/>}><Route index element={<DashboardPage/>}/><Route path="bookings" element={<BookingsPage/>}/><Route path="bookings/:id" element={<BookingDetailPage/>}/><Route path="bookings/:id/provider-suggestions" element={<ProviderSuggestionsPage/>}/><Route path="bookings/:id/change-requests" element={<TripChangeRequestsPage/>}/><Route path="bookings/:id/vouchers" element={<VouchersPage/>}/><Route path="customers" element={<CustomersPage/>}/><Route path="customers/:customerKey" element={<CustomersPage/>}/><Route path="trips" element={<TripsPage/>}/><Route path="call-queue" element={<CallQueuePage/>}/><Route path="change-requests" element={<TripChangeRequestsPage/>}/><Route path="vouchers" element={<VouchersPage/>}/><Route path="packages" element={<PackagesPage/>}/><Route path="destinations" element={<DestinationsPage/>}/><Route path="providers" element={<ProvidersPage/>}/><Route path="providers/approvals" element={<ProvidersPage/>}/><Route path="provider-suggestions" element={<ProviderSuggestionsPage/>}/><Route path="payments" element={<PaymentsPage/>}/><Route path="commissions" element={<CommissionsPage/>}/><Route path="payouts" element={<PayoutsPage/>}/><Route path="support" element={<SupportPage/>}/><Route path="content" element={<ContentPage/>}/><Route path="promotions" element={<PromotionsPage/>}/><Route path="reviews" element={<ReviewsPage/>}/><Route path="legal" element={<LegalPage/>}/><Route path="contact-inbox" element={<ContactInboxPage/>}/><Route path="media" element={<MediaPage/>}/><Route path="languages" element={<LanguagesPage/>}/><Route path="team" element={<TeamPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="audit-logs" element={<AuditLogsPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Route></Routes></Suspense>;
}
