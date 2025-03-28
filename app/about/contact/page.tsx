"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="mb-8">
            Whether you have questions about our workshops, custom designs, or non-profit initiatives, our team is here
            to help. Fill out the form and we'll get back to you as soon as possible.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold mr-4 flex-shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:info@tcamp.org" className="text-luxury-gold hover:underline">
                    info@tcamp.org
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold mr-4 flex-shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+15551234567" className="text-luxury-gold hover:underline">
                    (555) 123-4567
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold mr-4 flex-shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Visit Us</h3>
                <p className="text-muted-foreground">
                  123 Fashion Avenue
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>We'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={handleSelectChange}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshops">Workshops</SelectItem>
                      <SelectItem value="custom-design">Custom Design</SelectItem>
                      <SelectItem value="non-profit">Non-Profit</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095989785!2d-73.99038742426815!3d40.74844097138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30eac9f%3A0xaca05ca48ab0c3fa!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1701234567890!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

