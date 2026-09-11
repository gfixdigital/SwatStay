import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const BookingsPage = lazy(() => import("./pages/BookingsPage").then((module) => ({ default: module.BookingsPage })));
const BookingDetailPage = lazy(() => import("./pages/BookingDetailPage").then((module) => ({ default: module.BookingDetailPage })));
const CallQueuePage = lazy(() => import("./pages/CallQueuePage").then((module) => ({ default: module.CallQueuePage })));
const PackagesPage = lazy(() => import("./pages/PackagesPage").then((module) => ({ default: module.PackagesPage })));
const DestinationsPage = lazy(() => import("./pages/DestinationsPage").then((module) => ({ default: module.DestinationsPage })));
const ProvidersPage = lazy(() => import("./pages/ProvidersPage").then((module) => ({ default: module.ProvidersPage })));
const ProviderApprovalsPage = lazy(() => import("./pages/ProviderApprovalsPage").then((module) => ({ default: module.ProviderApprovalsPage })));
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

export function App() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-snow"><div className="rounded-lg border border-border bg-white px-5 py-4 text-sm font-semibold text-pine">Loading admin workspace...</div></div>}><Routes><Route element={<AdminLayout/>}><Route index element={<DashboardPage/>}/><Route path="bookings" element={<BookingsPage/>}/><Route path="bookings/:id" element={<BookingDetailPage/>}/><Route path="bookings/:id/provider-suggestions" element={<ProviderSuggestionsPage/>}/><Route path="call-queue" element={<CallQueuePage/>}/><Route path="packages" element={<PackagesPage/>}/><Route path="destinations" element={<DestinationsPage/>}/><Route path="providers" element={<ProvidersPage/>}/><Route path="providers/approvals" element={<ProviderApprovalsPage/>}/><Route path="provider-suggestions" element={<ProviderSuggestionsPage/>}/><Route path="payments" element={<PaymentsPage/>}/><Route path="commissions" element={<CommissionsPage/>}/><Route path="payouts" element={<PayoutsPage/>}/><Route path="support" element={<SupportPage/>}/><Route path="content" element={<ContentPage/>}/><Route path="media" element={<MediaPage/>}/><Route path="languages" element={<LanguagesPage/>}/><Route path="team" element={<TeamPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="audit-logs" element={<AuditLogsPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></Suspense>;
}
