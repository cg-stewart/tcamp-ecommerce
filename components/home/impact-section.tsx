"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const impactStats = [
  {
    title: "Students Supported",
    value: "500+",
    description: "Through scholarships and free workshops",
  },
  {
    title: "Community Events",
    value: "50+",
    description: "Organized in underserved neighborhoods",
  },
  {
    title: "Sustainable Products",
    value: "100%",
    description: "Of our clothing line uses eco-friendly materials",
  },
]

export default function ImpactSection() {
  return (
    <section className="py-16 bg-luxury-charcoal text-luxury-lavender">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight">Our Impact</h2>
          <p className="mt-4 text-luxury-lavender/80">
            We're committed to creating positive change in communities through education, sustainable fashion, and
            direct support.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg bg-luxury-charcoal/30 border border-luxury-gold"
            >
              <h3 className="text-4xl font-bold text-luxury-gold">{stat.value}</h3>
              <p className="font-medium mt-2 text-luxury-lavender">{stat.title}</p>
              <p className="text-sm text-luxury-lavender/70 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-luxury-lavender text-luxury-lavender hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95"
          >
            <Link href="/non-profit">Learn About Our Mission</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

