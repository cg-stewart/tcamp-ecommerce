"use client"

import HeroSection from "@/components/home/hero-section"
import WorkshopsSection from "@/components/home/workshops-section"
import CustomDesignSection from "@/components/home/custom-design-section"
import ImpactSection from "@/components/home/impact-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WorkshopsSection />
      <CustomDesignSection />
      <ImpactSection />
    </div>
  )
}

