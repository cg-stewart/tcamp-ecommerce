"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Make the gradient more pronounced and visible */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-luxury-gold via-luxury-lavender to-white" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-6"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-luxury-charcoal">
            Empowering Communities Through{" "}
            {/* Make the text directly visible with a solid color instead of transparent */}
            <span className="text-luxury-gold">Fashion, Education, and Impact</span>
          </h1>
          <p className="text-lg font-semibold text-luxury-charcoal/80 md:text-xl">
            Join our workshops, create custom designs, and support our mission to create positive change in communities.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-luxury-charcoal text-luxury-lavender hover:text-luxury-gold transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95 shadow-md hover:shadow-lg border-2 border-luxury-gold"
            >
              <Link href="/workshops">Explore Workshops</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-luxury-gold text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95 shadow-md hover:shadow-lg"
            >
              <Link href="/custom-design">Custom Designs</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

