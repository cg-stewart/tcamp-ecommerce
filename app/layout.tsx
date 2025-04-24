import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "TCamp - Workshops, Store & Custom Design",
  description:
    "Learn sewing, shop handcrafted clothing, and create custom designs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="flex-1 bg-luxury-lavender overflow-auto h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
