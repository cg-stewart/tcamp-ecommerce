"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Pencil, Settings } from "lucide-react"

// Dashboard-specific navigation items
const dashboardNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/workshops", icon: Calendar, label: "Workshops" },
  { href: "/dashboard/custom-designs", icon: Pencil, label: "Designs" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export default function DashboardMobileNavbar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-luxury-charcoal border-t border-luxury-gold/20 z-40">
      <div className="flex justify-around">
        {dashboardNavItems.map((item) => {
          // Check if path starts with the href for better active state matching
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-3 ${isActive ? "text-luxury-gold" : "text-luxury-lavender"}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

