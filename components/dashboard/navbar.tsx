import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Bell, Settings } from "lucide-react"

export default function DashboardNavbar() {
  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          TCamp Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

