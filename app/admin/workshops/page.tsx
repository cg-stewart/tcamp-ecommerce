import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  return {
    title: "Workshop Management - Admin Dashboard",
  };
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Clock, MapPin, MoreHorizontal, Plus, Search, Trash, Edit, Mail, Phone, Download } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAdminWorkshops, useWorkshopRegistrations } from "@/lib/hooks/use-admin"
import { Workshop, WorkshopRegistration } from "@/lib/db/schemas/types" // Import proper type definitions

export default function AdminWorkshopsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isRegistrationsDialogOpen, setIsRegistrationsDialogOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const { workshops, isLoading, mutate } = useAdminWorkshops()
  type WorkshopResponse = { success: boolean; data: Workshop[]; message?: string }
  const { registrations } = useWorkshopRegistrations(selectedWorkshop?.id)

  const handleCreateWorkshop = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Validate date range
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Date range required",
        description: "Please select both start and end dates for the workshop",
        variant: "destructive",
      })
      return
    }
    
    const formData = new FormData(event.currentTarget)

    const newWorkshop = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string, // Formatted date for display
      dateStart: formData.get("dateStart") as string, // ISO date for backend processing
      dateEnd: formData.get("dateEnd") as string, // ISO date for backend processing
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      price: (formData.get("price") as string) || null,
      isFeatured: formData.get("featured") === "on",
      category: formData.get("category") as string,
      image: "/placeholder.svg?height=300&width=400&text=Workshop",
    }

    // In a real app, this would be an API call
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local data
      // Cast the response to match the expected API return type
      mutate({
        success: true,
        data: [...(workshops || []), {
          ...newWorkshop,
          createdAt: new Date(),
          updatedAt: new Date(),
          spotsLeft: newWorkshop.capacity,
          isRegistrationOpen: true,
          materials: [],
          resources: [],
          registrations: 0,
          // Add missing properties required by Workshop type
          messages: []
        } as unknown as Workshop],
        message: "Workshop created successfully"
      } as WorkshopResponse, false)

      toast({
        title: "Workshop Created",
        description: "The workshop has been successfully created.",
      })

      // Reset the date range and close the modal
      setDateRange(undefined)
      setIsCreateDialogOpen(false)

      // Refresh data from server
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workshop. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWorkshop = async (id: string) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local data
      mutate(
        {
          success: true,
          data: workshops?.filter((workshop) => workshop.id !== id) || [],
          message: "Workshop deleted successfully"
        } as WorkshopResponse,
        false,
      )

      toast({
        title: "Workshop Deleted",
        description: "The workshop has been successfully deleted.",
      })

      // Refresh data from server
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workshop. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditWorkshop = (workshop: any) => {
    router.push(`/admin/workshops/edit/${workshop.id}`)
  }

  const handleViewRegistrations = (workshop: any) => {
    setSelectedWorkshop(workshop)
    setIsRegistrationsDialogOpen(true)
  }

  const filteredWorkshops = workshops?.filter(
    (workshop) =>
      workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workshop Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
              <Plus className="mr-2 h-4 w-4" /> Create Workshop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white border border-luxury-charcoal">
            <form onSubmit={handleCreateWorkshop}>
              <DialogHeader>
                <DialogTitle>Create New Workshop</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new workshop. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Workshop Title</Label>
                    <Input id="title" name="title" placeholder="Enter workshop title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="e.g. Beginner, Advanced" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Enter workshop description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date Range</Label>
                    <DateRangePicker 
                      dateRange={dateRange} 
                      onDateRangeChange={setDateRange}
                      placeholder="Select workshop dates"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" placeholder="e.g. 10:00 AM - 1:00 PM" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="Enter workshop location" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      placeholder="Maximum participants"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input id="price" name="price" placeholder="e.g. $199" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="featured" name="featured" />
                  <Label htmlFor="featured">Feature this workshop on homepage</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
                  Create Workshop
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workshops..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Workshops</TabsTrigger>
          <TabsTrigger value="past">Past Workshops</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Loading workshops...</div>
          ) : filteredWorkshops && filteredWorkshops.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Registrations</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkshops.map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell className="font-medium">
                          {workshop.title}
                          {workshop.isFeatured && (
                            <span className="ml-2 text-xs bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-luxury-gold" />
                              {workshop.date}
                            </span>
                            <span className="flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {workshop.time}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-luxury-gold" />
                            {workshop.location}
                          </div>
                        </TableCell>
                        <TableCell>{workshop.capacity}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewRegistrations(workshop)}>
{/* Fix ReactNode error by ensuring we have text content */}
                            {typeof workshop.registrations === 'object' ? '0' : String(workshop.registrations || '0')} / {workshop.capacity}
                          </Button>
                        </TableCell>
                        <TableCell>{workshop.price || "Free"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditWorkshop(workshop)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Workshop
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewRegistrations(workshop)}>
                                <Search className="h-4 w-4 mr-2" />
                                View Registrations
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteWorkshop(workshop.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Workshop
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No workshops found.</p>
                <Button
                  className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Create Your First Workshop
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Past workshops will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Draft workshops will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Registrations Dialog */}
      <Dialog open={isRegistrationsDialogOpen} onOpenChange={setIsRegistrationsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-white border border-luxury-charcoal">
          <DialogHeader>
            <DialogTitle>Workshop Registrations</DialogTitle>
            <DialogDescription>
              {selectedWorkshop?.title} - {selectedWorkshop?.date}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Registered Participants</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {registrations && Array.isArray(registrations.students) && registrations.students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.students.map((registration: any) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-luxury-gold" />
                          <a href={`mailto:${registration.email}`} className="hover:underline">
                            {registration.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-luxury-gold" />
                          <a href={`tel:${registration.phone}`} className="hover:underline">
                            {registration.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>{registration.registrationDate}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            registration.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : registration.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {registration.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel Registration</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">No registrations found for this workshop.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

