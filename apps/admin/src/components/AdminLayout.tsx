import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="min-h-screen bg-snow"><AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/><div className="lg:pl-[270px]"><AdminHeader onMenuClick={() => setSidebarOpen(true)}/><main className="p-4 md:p-6"><Outlet/></main></div></div>;
}
