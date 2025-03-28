"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

// Update the mainNavItems array to remove the redundant "Our Story" entry
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
    pages: [
      { title: "Our Mission", href: "/non-profit/mission", description: "Learn about our vision and core values." },
      {
        title: "Our Impact",
        href: "/non-profit/impact",
        description: "See how we're making a difference in communities.",
      },
      { title: "Donate", href: "/non-profit/donate", description: "Support our initiatives and programs." },
      { title: "Volunteer", href: "/non-profit/volunteer", description: "Join our team and help make a difference." },
    ],
  },
  {
    title: "About Us",
    href: "/about",
    description: "Learn about our mission and impact.",
    pages: [{ title: "Contact Us", href: "/about/contact", description: "Get in touch with our team." }],
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-luxury-lavender/95 backdrop-blur supports-[backdrop-filter]:bg-luxury-lavender/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex-shrink-0 mr-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-luxury-gold">TCamp</span>
          </Link>
        </div>

        {/* Centered Navigation */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="text-luxury-charcoal hover:text-luxury-gold">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      {item.pages ? (
                        <>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-luxury-lavender hover:text-luxury-gold focus:bg-luxury-lavender focus:text-luxury-gold"
                            >
                              <div className="text-sm font-medium leading-none text-luxury-charcoal">
                                {item.title} Overview
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-luxury-charcoal/70">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <div className="grid grid-cols-1 gap-2 pt-2">
                            {item.pages.map((page) => (
                              <NavigationMenuLink key={page.href} asChild>
                                <Link
                                  href={page.href}
                                  className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-luxury-lavender hover:text-luxury-gold focus:bg-luxury-lavender focus:text-luxury-gold"
                                >
                                  <div className="text-sm font-medium leading-none text-luxury-charcoal">
                                    {page.title}
                                  </div>
                                  <p className="line-clamp-1 text-xs leading-snug text-luxury-charcoal/70 mt-1">
                                    {page.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-luxury-lavender hover:text-luxury-gold focus:bg-luxury-lavender focus:text-luxury-gold"
                          >
                            <div className="text-sm font-medium leading-none text-luxury-charcoal">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-luxury-charcoal/70">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 ml-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="border-2 border-luxury-gold text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold/80 transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95"
              >
                Log In
              </Button>
            </Link>
            <div className="hidden md:inline-block">
              <Link href="/sign-up">
                <Button className="bg-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal text-luxury-lavender transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95 border-2 border-luxury-gold">
                  Sign Up
                </Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="mr-2">
              <Button
                variant="outline"
                className="border-2 border-luxury-gold text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold/80 transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "border-2 border-luxury-gold hover:border-luxury-charcoal transition-colors"
                }
              }}
            />
          </SignedIn>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-luxury-charcoal hover:text-luxury-gold hover:bg-luxury-lavender/50 bg-white/80"
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
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-xl text-luxury-gold">TCamp</span>
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
                <div className="grid gap-2">
                  <SignedOut>
                    <div onClick={() => setIsOpen(false)}>
                      <Link href="/sign-in">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-luxury-gold text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold/80 transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95"
                        >
                          Log In
                        </Button>
                      </Link>
                    </div>
                    <div onClick={() => setIsOpen(false)}>
                      <Link href="/sign-up">
                        <Button className="w-full bg-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal text-luxury-lavender transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95 border-2 border-luxury-gold">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-luxury-gold text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold/80 transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

