"use client"

import { useState } from "react"
import { useUserCustomDesigns } from "@/lib/hooks/use-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Using SWR to fetch data instead of static mock data

export default function CustomDesignsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designIdea: "",
  })
  const { toast } = useToast()
  
  // Fetch custom designs with SWR
  const { designs, isLoading, isError, mutate } = useUserCustomDesigns()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Submit the new design request to the API
      const response = await fetch('/api/dashboard/custom-designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit design request')
      }
      
      // Show success message
      toast({
        title: "Design Request Submitted!",
        description: "Your custom design request has been received. We'll contact you soon to discuss your ideas.",
        variant: "default",
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        designIdea: "",
      })
      
      // Revalidate data
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit design request",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Custom Designs</h1>
      </div>

      <Tabs defaultValue="my-designs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-designs">My Designs</TabsTrigger>
          <TabsTrigger value="new-design">Create New Design</TabsTrigger>
        </TabsList>

        <TabsContent value="my-designs" className="space-y-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Design Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Designer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Loading designs...
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-red-500">
                          Error loading designs. Please try again.
                        </TableCell>
                      </TableRow>
                    ) : designs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No custom designs found. Create your first design to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      designs.map((design) => (
                        <TableRow key={design.id}>
                          <TableCell className="font-medium">{design.name}</TableCell>
                          <TableCell>{new Date(design.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{design.designer}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                design.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : design.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : design.status === "Approved"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {design.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {design.status === "Completed" && (
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Design Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold">
                  ✏️
                </div>
                <div>
                  <h3 className="font-medium">Consultation</h3>
                  <p className="text-sm text-muted-foreground">Initial meeting to discuss your design ideas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold">
                  🎨
                </div>
                <div>
                  <h3 className="font-medium">Concept Sketches</h3>
                  <p className="text-sm text-muted-foreground">Preliminary designs based on your requirements</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold">
                  🔄
                </div>
                <div>
                  <h3 className="font-medium">Revisions</h3>
                  <p className="text-sm text-muted-foreground">Refinements based on your feedback</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="font-medium">Final Design</h3>
                  <p className="text-sm text-muted-foreground">Completed design ready for production</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-design" className="space-y-6 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Start Your Custom Design Journey</CardTitle>
              <CardDescription>Fill out this form to book your consultation</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="design-idea">Tell us about your design idea</Label>
                  <Textarea
                    id="design-idea"
                    name="designIdea"
                    placeholder="Describe your vision..."
                    value={formData.designIdea}
                    onChange={handleChange}
                    required
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-luxury-gold hover:bg-luxury-gold text-luxury-lavender hover:text-luxury-charcoal transition-colors"
                >
                  Submit Design Request
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Custom Design Showcase</CardTitle>
                <CardDescription>Get inspired by our previous custom designs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Image
                    src="/placeholder.svg?height=150&width=150&text=Design+1"
                    alt="Custom Design 1"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <Image
                    src="/placeholder.svg?height=150&width=150&text=Design+2"
                    alt="Custom Design 2"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <Image
                    src="/placeholder.svg?height=150&width=150&text=Design+3"
                    alt="Custom Design 3"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <Image
                    src="/placeholder.svg?height=150&width=150&text=Design+4"
                    alt="Custom Design 4"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover aspect-square"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

