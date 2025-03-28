"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Calendar,
  CreditCard,
  Home,
  Settings,
  Users,
  FileText,
  LayoutDashboard,
  Pencil,
  Mail,
  HeartHandshake,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface DashboardSidebarProps {
  isAdmin?: boolean
}

export default function DashboardSidebar({ isAdmin = false }: DashboardSidebarProps) {
  const pathname = usePathname()

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Workshops",
      href: "/dashboard/workshops",
      icon: Calendar,
      isActive: pathname === "/dashboard/workshops",
    },
    {
      title: "Custom Designs",
      href: "/dashboard/custom-designs",
      icon: Pencil,
      isActive: pathname === "/dashboard/custom-designs",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
      isActive: pathname === "/dashboard/billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      isActive: pathname === "/dashboard/settings",
    },
  ]

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      title: "Workshops",
      href: "/admin/workshops",
      icon: Calendar,
      isActive: pathname === "/admin/workshops",
    },
    {
      title: "Volunteers",
      href: "/admin/volunteers",
      icon: HeartHandshake,
      isActive: pathname.startsWith("/admin/volunteers"),
    },
    {
      title: "Custom Designs",
      href: "/admin/custom-designs",
      icon: Pencil,
      isActive: pathname === "/admin/custom-designs",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname === "/admin/users",
    },
    {
      title: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      isActive: pathname === "/admin/newsletter",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
      isActive: pathname === "/admin/analytics",
    },
    // Content and Settings routes removed as they're not needed
  ]

  const navItems = isAdmin ? adminNavItems : userNavItems

  return (
    <Sidebar className="bg-luxury-charcoal text-luxury-lavender border-r border-luxury-gold/20">
      <SidebarHeader className="border-b border-luxury-gold/20">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 px-2">
          <span className="font-bold text-xl text-luxury-gold">TCamp</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                className={
                  item.isActive
                    ? "bg-luxury-gold/20 text-luxury-gold"
                    : "text-luxury-lavender hover:bg-luxury-gold/10 hover:text-luxury-gold"
                }
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-luxury-gold/20">
        <div className="p-4">
          <p className="text-xs text-luxury-gold">&copy; {new Date().getFullYear()} TCamp</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

