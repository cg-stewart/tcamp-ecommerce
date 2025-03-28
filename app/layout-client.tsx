"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import MobileNavbar from "@/components/layout/mobile-navbar"
import Footer from "@/components/layout/footer"
import ScrollToTop from "@/components/layout/scroll-to-top"
import { usePathname } from "next/navigation"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminOrDashboardRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-luxury-charcoal hover:bg-luxury-gold text-luxury-lavender hover:text-luxury-charcoal transition-colors",
          card: "bg-luxury-lavender",
          headerTitle: "text-luxury-gold",
          headerSubtitle: "text-luxury-charcoal",
          formFieldLabel: "text-luxury-charcoal",
          footerActionLink: "text-luxury-gold hover:text-luxury-charcoal"
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
          <ScrollToTop />
          {!isAdminOrDashboardRoute && <Navbar />}
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          {!isAdminOrDashboardRoute && <Footer />}
          {!isAdminOrDashboardRoute && <MobileNavbar />}
        </body>
      </html>
    </ClerkProvider>
  )
}

