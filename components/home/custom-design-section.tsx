"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Pencil, Scissors, Palette } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const customDesignServices = [
  {
    id: 1,
    title: "Personalized Clothing Design",
    description: "Work with our designers to create unique garments tailored to your style and preferences.",
    icon: Pencil,
  },
  {
    id: 2,
    title: "Pattern Customization",
    description: "Modify existing patterns or create entirely new ones for a perfect fit and unique look.",
    icon: Scissors,
  },
  {
    id: 3,
    title: "Fabric Selection & Consultation",
    description: "Expert guidance on selecting the perfect fabrics and materials for your custom designs.",
    icon: Palette,
  },
]

export default function CustomDesignSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-luxury-charcoal">Custom Design Services</h2>
            <p className="text-luxury-charcoal/70 mt-2">Bring your unique vision to life with our expert designers</p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="mt-4 md:mt-0 text-luxury-gold hover:text-luxury-green hover:bg-luxury-lavender"
          >
            <Link href="/custom-design" className="group">
              Start Your Design <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {customDesignServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-luxury-lavender hover:border-luxury-gold transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-luxury-gold" />
                  </div>
                  <CardTitle className="text-luxury-charcoal">{service.title}</CardTitle>
                  <CardDescription className="text-luxury-charcoal/70">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-lg overflow-hidden"
        >
          <div className="aspect-[21/9] relative">
            <Image
              src="/placeholder.svg?height=600&width=1400&text=Custom+Design+Showcase"
              alt="Custom Design Showcase"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal/80 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-md">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Create Your Dream Design</h3>
                <p className="text-white/80 mb-6">
                  Our expert designers will work with you to bring your vision to life, from concept to creation.
                </p>
                <Button asChild size="lg" className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
                  <Link href="/custom-design">Book a Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

