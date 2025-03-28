"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { subscribeToNewsletter } from "@/app/actions/newsletter-actions"

export default function NewsletterSection() {
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
    <section className="py-16 bg-luxury-lavender">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-luxury-charcoal">Stay Updated</h2>
          <p className="mt-4 text-luxury-charcoal/70">
            Subscribe to our newsletter for updates on new workshops, custom design inspiration, and community events.
          </p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-luxury-gold bg-luxury-lavender px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-luxury-charcoal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="bg-luxury-charcoal text-luxury-lavender hover:text-luxury-gold transition-colors duration-300 transform hover:scale-105 focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}

