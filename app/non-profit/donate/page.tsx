"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function DonatePage() {
  const { toast } = useToast()
  const [donationAmount, setDonationAmount] = useState("50")
  const [customAmount, setCustomAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Donation Successful",
        description: "Thank you for your generous support!",
      })

      // Reset form
      setDonationAmount("50")
      setCustomAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Support Our Mission</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your donation helps us expand our programs and create positive change in our communities.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Your Impact</h2>
          <p className="mb-6">
            Every donation, no matter the size, makes a difference in our ability to provide educational opportunities,
            promote sustainable fashion practices, and support our community initiatives.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                $25
              </div>
              <div>
                <h3 className="font-semibold">Provides materials for one student</h3>
                <p className="text-muted-foreground">
                  Supplies a student with all the necessary materials for a complete workshop series.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                $50
              </div>
              <div>
                <h3 className="font-semibold">Sponsors a workshop session</h3>
                <p className="text-muted-foreground">
                  Covers the cost of running a workshop session for up to 10 participants.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                $100
              </div>
              <div>
                <h3 className="font-semibold">Funds a scholarship</h3>
                <p className="text-muted-foreground">
                  Provides a full scholarship for one student to attend our comprehensive workshop series.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                $250
              </div>
              <div>
                <h3 className="font-semibold">Supports community outreach</h3>
                <p className="text-muted-foreground">
                  Helps us bring our programs to underserved communities and expand our reach.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>Your contribution is tax-deductible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="one-time">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="one-time">One-Time</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="one-time">
                  <form onSubmit={handleDonationSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label>Select Amount</Label>
                      <RadioGroup
                        value={donationAmount}
                        onValueChange={setDonationAmount}
                        className="grid grid-cols-4 gap-2"
                      >
                        <div>
                          <RadioGroupItem value="25" id="amount-25" className="sr-only" />
                          <Label
                            htmlFor="amount-25"
                            className={`flex h-10 items-center justify-center rounded-md border border-luxury-charcoal/20 px-3 py-2 text-sm cursor-pointer hover:bg-luxury-lavender/50 ${
                              donationAmount === "25" ? "bg-luxury-gold text-luxury-lavender" : ""
                            }`}
                          >
                            $25
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="50" id="amount-50" className="sr-only" />
                          <Label
                            htmlFor="amount-50"
                            className={`flex h-10 items-center justify-center rounded-md border border-luxury-charcoal/20 px-3 py-2 text-sm cursor-pointer hover:bg-luxury-lavender/50 ${
                              donationAmount === "50" ? "bg-luxury-gold text-luxury-lavender" : ""
                            }`}
                          >
                            $50
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="100" id="amount-100" className="sr-only" />
                          <Label
                            htmlFor="amount-100"
                            className={`flex h-10 items-center justify-center rounded-md border border-luxury-charcoal/20 px-3 py-2 text-sm cursor-pointer hover:bg-luxury-lavender/50 ${
                              donationAmount === "100" ? "bg-luxury-gold text-luxury-lavender" : ""
                            }`}
                          >
                            $100
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="custom" id="amount-custom" className="sr-only" />
                          <Label
                            htmlFor="amount-custom"
                            className={`flex h-10 items-center justify-center rounded-md border border-luxury-charcoal/20 px-3 py-2 text-sm cursor-pointer hover:bg-luxury-lavender/50 ${
                              donationAmount === "custom" ? "bg-luxury-gold text-luxury-lavender" : ""
                            }`}
                          >
                            Custom
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {donationAmount === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-amount">Custom Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input
                            id="custom-amount"
                            type="number"
                            min="1"
                            step="1"
                            className="pl-7"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Share why you're supporting our mission" />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Donate Now"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="monthly">
                  <div className="pt-4 text-center">
                    <p className="mb-4">
                      Become a sustaining supporter by making a monthly donation. Your recurring gift helps us plan for
                      the future and sustain our programs.
                    </p>
                    <Button
                      className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
                      onClick={() => {
                        toast({
                          title: "Monthly Donation",
                          description: "Monthly donation option will be available soon!",
                        })
                      }}
                    >
                      Set Up Monthly Donation
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 items-start">
              <p className="text-sm text-muted-foreground">
                TCamp is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the extent
                allowed by law.
              </p>
              <div className="flex items-center space-x-2">
                <Image src="/placeholder.svg?height=30&width=50&text=Visa" alt="Visa" width={50} height={30} />
                <Image src="/placeholder.svg?height=30&width=50&text=MC" alt="Mastercard" width={50} height={30} />
                <Image
                  src="/placeholder.svg?height=30&width=50&text=Amex"
                  alt="American Express"
                  width={50}
                  height={30}
                />
                <Image src="/placeholder.svg?height=30&width=50&text=PayPal" alt="PayPal" width={50} height={30} />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="bg-luxury-lavender/30 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Other Ways to Support</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your time and skills to help with workshops, events, and administrative tasks.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
              >
                <a href="/non-profit/volunteer">Learn More</a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Corporate Partnerships</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Partner with us through sponsorships, in-kind donations, or employee volunteer programs.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
              >
                <a href="/non-profit/partnerships">Learn More</a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Material Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Donate fabrics, sewing machines, and other supplies to support our workshops and programs.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
              >
                <a href="/non-profit/material-donations">Learn More</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Questions About Donating?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          If you have any questions about making a donation or would like to discuss other ways to support our mission,
          please contact us.
        </p>
        <Button
          asChild
          variant="outline"
          className="border-luxury-charcoal text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300"
        >
          <a href="mailto:donate@tcamp.org">Contact Our Development Team</a>
        </Button>
      </div>
    </div>
  )
}

