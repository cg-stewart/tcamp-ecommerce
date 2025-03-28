import type React from "react"
import type { Metadata } from "next"
import { RootLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "TCamp - Workshops, Store & Custom Design",
  description: "Learn sewing, shop handcrafted clothing, and create custom designs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}



import './globals.css'