import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  return {
    title: "Edit Workshop - Admin Dashboard",
  };
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { getWorkshopById, updateWorkshop } from "@/app/actions/workshop-actions"

export default function EditWorkshopPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [workshop, setWorkshop] = useState<any>(null)
  const { id } = params

  useEffect(() => {
    const loadWorkshop = async () => {
      setIsLoading(true)
      const result = await getWorkshopById(id)
      if (result.success && result.data) {
        setWorkshop(result.data)
        setFormData({
          title: result.data.title,
          description: result.data.description,
          date: result.data.date,
          time: result.data.time,
          location: result.data.location,
          capacity: result.data.capacity.toString(),
          price: result.data.price.toString(),
          category: result.data.category,
          isFeatured: result.data.isFeatured,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }
    loadWorkshop()
  }, [id, toast])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    price: "",
    category: "",
    isFeatured: false,
  })

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        date: workshop.date,
        time: workshop.time,
        location: workshop.location,
        capacity: workshop.capacity.toString(),
        price: workshop.price || "",
        category: workshop.category,
        isFeatured: workshop.isFeatured,
      })
    }
  }, [workshop])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isFeatured: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updatedWorkshop = {
        ...workshop,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        capacity: Number.parseInt(formData.capacity),
        price: formData.price || null,
        category: formData.category,
        isFeatured: formData.isFeatured,
      }

      await updateWorkshop(id, updatedWorkshop)

      toast({
        title: "Workshop Updated",
        description: "The workshop has been successfully updated.",
      })

      router.push("/admin/workshops")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workshop. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading workshop details...</div>
  }

  if (!workshop) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Workshop not found.</p>
        <Button onClick={() => router.push("/admin/workshops")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workshops
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/admin/workshops")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Workshop</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workshop Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Workshop Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (optional)</Label>
                <Input id="price" name="price" value={formData.price} onChange={handleChange} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="featured" checked={formData.isFeatured} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="featured">Feature this workshop on homepage</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/workshops")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

