import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard/sidebar"
import AdminMobileNavbar from "@/components/dashboard/admin-mobile-navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar isAdmin={true} />
      <main className="flex-1 bg-luxury-lavender overflow-auto h-screen ml-0 md:ml-[16rem] transition-all">
        <div className="p-8 pb-20 md:pb-8 h-full">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </div>
      </main>
      <AdminMobileNavbar />
    </SidebarProvider>
  );
}

