"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, User, Pencil } from "lucide-react"

// Updated navItems with login instead of account
const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/workshops", icon: Calendar, label: "Workshops" },
  { href: "/custom-design", icon: Pencil, label: "Custom Design" },
  { href: "/login", icon: User, label: "Account" }, // Changed from /account to /login
]

export default function MobileNavbar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          // Check if path starts with the href for better active state matching
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href)) ||
            (item.href === "/login" && pathname?.startsWith("/dashboard"))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-3 ${isActive ? "text-luxury-gold" : "text-muted-foreground"}`}
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

