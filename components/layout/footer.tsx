"use client"

import type React from "react"

"use client"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { subscribeToNewsletter } from "@/app/actions/newsletter-actions"

// Simplified footer links data structure
const footerLinks = [
  {
    title: "Workshops",
    links: [
      { name: "All Workshops", href: "/workshops" },
      { name: "Featured Workshops", href: "/workshops#featured" },
    ],
  },
  {
    title: "Custom Design",
    links: [
      { name: "Request Design", href: "/custom-design" },
      { name: "Design Showcase", href: "/custom-design#showcase" },
    ],
  },
  {
    title: "Non-Profit",
    links: [
      { name: "Our Mission", href: "/non-profit/mission" },
      { name: "Impact", href: "/non-profit/impact" },
      { name: "Donate", href: "/non-profit/donate" },
    ],
  },
]

// Social media links
const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await subscribeToNewsletter(null, formData)

      if (result.success) {
        toast({
          title: "Success!",
          description: "You have been subscribed to our newsletter.",
        })
        setEmail("")
      } else {
        throw new Error(result.message || "Failed to subscribe")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem subscribing to the newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-luxury-charcoal text-luxury-lavender">
      <div className="container mx-auto px-4 sm:px-6 pb-20 pt-12 sm:pb-16 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 md:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-luxury-gold">TCamp</span>
            </Link>
            <p className="mt-4 text-sm text-luxury-lavender/70">
              Empowering communities through education, fashion, and social impact.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-luxury-lavender/50 hover:text-luxury-gold transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="md:col-span-1">
              <h3 className="text-sm font-semibold text-luxury-gold">{section.title}</h3>
              <ul role="list" className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-luxury-lavender/70 hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold/50 pb-0.5 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="text-sm font-semibold text-luxury-gold">Subscribe to our newsletter</h3>
            <p className="mt-2 text-sm text-luxury-lavender/70">Stay updated with our latest workshops and events.</p>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full rounded-md bg-luxury-charcoal/50 border border-luxury-lavender/20 px-3 py-2 text-sm text-luxury-lavender placeholder:text-luxury-lavender/50 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full border border-luxury-gold bg-transparent text-luxury-lavender hover:bg-luxury-gold hover:text-white transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <div className="mt-12 border-t border-luxury-lavender/10 pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-sm text-luxury-lavender/50">
            &copy; {new Date().getFullYear()} TCamp. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link
              href="/contact"
              className="text-sm text-luxury-lavender/70 hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold/50 pb-0.5 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

