"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardMobileNavbar from "@/components/dashboard/mobile-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen] = useState(true);

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <DashboardSidebar />
      <main className="flex-1 bg-luxury-lavender overflow-auto h-screen ml-0 md:ml-[16rem] transition-all">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 pb-20 md:pb-6 h-full"
        >
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </motion.div>
      </main>
      <DashboardMobileNavbar />
    </SidebarProvider>
  );
}
