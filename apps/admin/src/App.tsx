import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { BookingDetailPage } from "./pages/BookingDetailPage";
import { BookingsPage } from "./pages/BookingsPage";
import { CallQueuePage } from "./pages/CallQueuePage";
import { DashboardPage } from "./pages/DashboardPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { ProviderApprovalsPage } from "./pages/ProviderApprovalsPage";
import { ProviderSuggestionsPage } from "./pages/ProviderSuggestionsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SupportPage } from "./pages/SupportPage";

export function App() {
  return <Routes><Route element={<AdminLayout/>}><Route index element={<DashboardPage/>}/><Route path="bookings" element={<BookingsPage/>}/><Route path="bookings/:id" element={<BookingDetailPage/>}/><Route path="bookings/:id/provider-suggestions" element={<ProviderSuggestionsPage/>}/><Route path="call-queue" element={<CallQueuePage/>}/><Route path="providers/approvals" element={<ProviderApprovalsPage/>}/><Route path="payments" element={<PaymentsPage/>}/><Route path="support" element={<SupportPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>;
}
