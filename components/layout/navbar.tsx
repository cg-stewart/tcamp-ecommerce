"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const mainNavItems = [
  {
    title: "Workshops",
    href: "/workshops",
    description: "Browse our sewing and design workshops.",
  },
  {
    title: "Custom Design",
    href: "/custom-design",
    description: "Create your own unique clothing with our design service.",
  },
  {
    title: "Non-Profit",
    href: "/non-profit",
    description: "Learn about our mission and community impact initiatives.",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-luxury-lavender">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-luxury-gold">TCamp</span>
          </Link>
        </div>

        {/* Centered Navigation */}
        <div className="flex flex-1 justify-center">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="text-luxury-charcoal hover:text-luxury-gold">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {/* Removed the conditional logic for item.pages */}
                    <div className="grid w-[400px] gap-3 p-4">
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          // Note: Replaced hover:bg-luxury-lavender with hover:bg-accent
                          //       Replaced hover:text-luxury-gold with hover:text-accent-foreground (standard Shadcn pairing)
                          //       Updated focus states similarly.
                          //       Removed text-luxury-charcoal as hover/focus states handle text color.
                        >
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {/* Used text-muted-foreground for description for standard styling */}
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side buttons (Mobile Menu) */}
        <div className="ml-4 flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 text-luxury-charcoal hover:bg-luxury-lavender/50 hover:text-luxury-gold"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-luxury-lavender">
              <SheetHeader>
                <SheetTitle className="text-luxury-gold">Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl font-bold text-luxury-gold">
                    TCamp
                  </span>
                </Link>
                <div className="grid gap-3">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="text-sm font-medium text-luxury-charcoal hover:text-luxury-gold"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
