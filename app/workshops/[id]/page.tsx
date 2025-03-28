"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getWorkshopById, registerForWorkshop } from "@/app/actions/workshop-actions"
import { useToast } from "@/components/ui/use-toast"

export default function WorkshopDetailPage({ params }: { params: { id: string } }) {
  const [workshop, setWorkshop] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: "1",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadWorkshop = async () => {
      try {
        const result = await getWorkshopById(params.id)
        if (result.success && result.data) {
          setWorkshop(result.data)
        }
      } catch (error) {
        console.error("Failed to load workshop:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkshop()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert form data to FormData
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value)
      })

      const result = await registerForWorkshop(params.id, form)

      if (!result.success) {
        throw new Error(result.message || 'Registration failed')
      }

      toast({
        title: "Registration Successful",
        description: "You have successfully registered for this workshop.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        participants: "1",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>Loading workshop details...</p>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container py-10">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Workshop Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The workshop you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/workshops">Browse Workshops</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{workshop.title}</h1>
            <p className="mt-2 text-muted-foreground">{workshop.description}</p>
          </div>

          <div className="aspect-video overflow-hidden rounded-lg">
            <Image
              src={workshop.image || "/placeholder.svg"}
              alt={workshop.title}
              width={800}
              height={500}
              className="object-cover"
            />
          </div>

          <Tabs defaultValue="details" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-medium">About This Workshop</h3>
                <p className="mt-2">{workshop.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">What to Bring</h3>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Comfortable clothes that can get messy</li>
                  <li>Water bottle</li>
                  <li>Notebook and pen for taking notes</li>
                  <li>Your creativity and enthusiasm!</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Instructor</h3>
                <div className="mt-2 flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=Instructor"
                      alt="Instructor"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">
                      Sarah is a professional designer with over 10 years of teaching experience. She specializes in
                      sustainable fashion and has worked with major brands across the country.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="mt-4">
              <div className="space-y-4">
                <div className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Day 1-3
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium">Introduction & Fundamentals</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn the basics and get comfortable with the tools and techniques.
                  </p>
                </div>
                <div className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Day 4-6
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium">Intermediate Techniques</h3>
                  <p className="text-sm text-muted-foreground">
                    Build on the fundamentals and start working on more complex projects.
                  </p>
                </div>
                <div className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Day 7-10
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium">Advanced Skills & Final Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Master advanced techniques and complete your final project.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                <div className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Emily R.</h3>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "text-primary" : "text-muted"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm">
                    "This workshop exceeded my expectations! The instructor was knowledgeable and patient, and I learned
                    so much in such a short time."
                  </p>
                </div>
                <div className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Michael T.</h3>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "text-primary" : "text-muted"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm">
                    "Great workshop with hands-on experience. I appreciated the small class size and individual
                    attention."
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Workshop Details</CardTitle>
              <CardDescription>Register for this workshop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{workshop.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{workshop.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{workshop.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{workshop.spotsLeft} spots left</span>
              </div>
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Registration Progress</span>
                  <span className="text-sm font-medium">
                    {workshop.registrations}/{workshop.capacity}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(workshop.registrations / workshop.capacity) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-2xl font-bold">{workshop.price || "Free"}</div>

              <div className="pt-4 border-t">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Participants</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Register Now"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

