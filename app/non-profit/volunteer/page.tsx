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
import { Users, Calendar, FileText } from "lucide-react"
import { submitVolunteerApplication } from "@/app/actions/volunteer-actions"

export default function VolunteerPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    interests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert form data to FormData
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      // Submit using server action
      const result = await submitVolunteerApplication(null, form)

      toast({
        title: "Volunteer Application Submitted",
        description: "Thank you for your interest in volunteering with us!",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        interests: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Volunteer With Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join our team of dedicated volunteers and help us make a difference in our community.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Why Volunteer?</h2>
          <p className="mb-6">
            Volunteering with TCamp is a rewarding experience that allows you to contribute your skills and time to
            meaningful projects while making a positive impact in our community.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold">Share Your Skills</h3>
                <p className="text-muted-foreground">
                  Whether you're a skilled seamstress, a marketing expert, or just passionate about our cause, we have
                  opportunities for you to contribute.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold">Flexible Opportunities</h3>
                <p className="text-muted-foreground">
                  From one-time events to ongoing programs, we offer a variety of volunteer opportunities to fit your
                  schedule and interests.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold">Make a Difference</h3>
                <p className="text-muted-foreground">
                  Your contribution directly supports our mission to empower communities through education, sustainable
                  fashion, and social impact.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Application</CardTitle>
              <CardDescription>Fill out this form to join our volunteer team</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={handleSelectChange}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="HI">Hawaii</SelectItem>
                        <SelectItem value="ID">Idaho</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="IN">Indiana</SelectItem>
                        <SelectItem value="IA">Iowa</SelectItem>
                        <SelectItem value="KS">Kansas</SelectItem>
                        <SelectItem value="KY">Kentucky</SelectItem>
                        <SelectItem value="LA">Louisiana</SelectItem>
                        <SelectItem value="ME">Maine</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                        <SelectItem value="MN">Minnesota</SelectItem>
                        <SelectItem value="MS">Mississippi</SelectItem>
                        <SelectItem value="MO">Missouri</SelectItem>
                        <SelectItem value="MT">Montana</SelectItem>
                        <SelectItem value="NE">Nebraska</SelectItem>
                        <SelectItem value="NV">Nevada</SelectItem>
                        <SelectItem value="NH">New Hampshire</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="NM">New Mexico</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="ND">North Dakota</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="OK">Oklahoma</SelectItem>
                        <SelectItem value="OR">Oregon</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="RI">Rhode Island</SelectItem>
                        <SelectItem value="SC">South Carolina</SelectItem>
                        <SelectItem value="SD">South Dakota</SelectItem>
                        <SelectItem value="TN">Tennessee</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="UT">Utah</SelectItem>
                        <SelectItem value="VT">Vermont</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        <SelectItem value="WV">West Virginia</SelectItem>
                        <SelectItem value="WI">Wisconsin</SelectItem>
                        <SelectItem value="WY">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest (Optional)</Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    placeholder="Tell us about your skills and interests"
                    value={formData.interests}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <div className="bg-luxury-lavender/30 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Volunteer Opportunities</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-luxury-gold mr-2" />
              <h3 className="text-xl font-semibold text-luxury-gold">Workshop Assistants</h3>
            </div>
            <p className="text-muted-foreground">
              Help our instructors run workshops, assist participants, and ensure a smooth learning experience.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-luxury-gold mr-2" />
              <h3 className="text-xl font-semibold text-luxury-gold">Event Coordinators</h3>
            </div>
            <p className="text-muted-foreground">
              Support our community events, from planning and setup to execution and cleanup.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 text-luxury-gold mr-2" />
              <h3 className="text-xl font-semibold text-luxury-gold">Administrative Support</h3>
            </div>
            <p className="text-muted-foreground">
              Help with office tasks, data entry, communications, and other behind-the-scenes work.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

