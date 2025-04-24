"use client";

import type React from "react";

import Link from "next/link";
import { Instagram } from "lucide-react";

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
];

// Social media links
const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
];

export default function Footer() {
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
              Empowering communities through education, fashion, and social
              impact.
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
              <h3 className="text-sm font-semibold text-luxury-gold">
                {section.title}
              </h3>
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
        </div>

        {/* Bottom Section with Copyright */}
        <div className="mt-12 border-t border-luxury-lavender/10 pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-sm text-luxury-lavender/50">
            &copy; {new Date().getFullYear()} TCamp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
