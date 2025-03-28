"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  return {
    title: "Custom Designs - Admin Dashboard",
  };
}
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Search, MoreHorizontal, Calendar, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAllCustomDesigns, updateCustomDesignStatus } from "@/app/actions/custom-design-actions"

export default function AdminCustomDesignsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDesign, setSelectedDesign] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [designs, setDesigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const result = await getAllCustomDesigns()
        if (result.success && result.data) {
          setDesigns(result.data)
        }
      } catch (error) {
        console.error("Failed to load designs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDesigns()
  }, [])

  const handleViewDesign = (design: { id: string; title: string; description: string; status: string }) => {
    setSelectedDesign(design)
    setIsViewDialogOpen(true)
  }

  const handleStatusChange = (design: any) => {
    setSelectedDesign(design)
    setNewStatus(design.status)
    setIsStatusDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('status', newStatus)
      formData.append('feedback', '')
      formData.append('rating', '')

      const result = await updateCustomDesignStatus(selectedDesign.id, formData)

      if (!result.success) {
        throw new Error(result.message || 'Failed to update status')
      }

      // Update local data
      setDesigns(designs.map((design) => 
        design.id === selectedDesign.id ? { ...design, status: newStatus } : design
      ))

      toast({
        title: "Status Updated",
        description: "The design request status has been updated successfully.",
      })

      setIsStatusDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <Badge className="bg-blue-500">New</Badge>
      case "In Consultation":
        return <Badge className="bg-purple-500">In Consultation</Badge>
      case "Design Phase":
        return <Badge className="bg-yellow-500">Design Phase</Badge>
      case "Production":
        return <Badge className="bg-orange-500">Production</Badge>
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredDesigns = designs?.filter(
    (design) =>
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.designIdea.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Custom Design Requests</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search design requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading design requests...</div>
      ) : filteredDesigns && filteredDesigns.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Design Idea</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDesigns.map((design) => (
                  <TableRow key={design.id}>
                    <TableCell className="font-medium">{design.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-luxury-gold" />
                          <a href={`mailto:${design.email}`} className="hover:underline">
                            {design.email}
                          </a>
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          <a href={`tel:${design.phone}`} className="hover:underline">
                            {design.phone}
                          </a>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{design.designIdea}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-luxury-gold" />
                        {design.submissionDate}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(design.status)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDesign(design)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(design)}>
                            <svg
                              className="h-4 w-4 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Client
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
            <p className="text-muted-foreground mb-4">No design requests found.</p>
          </CardContent>
        </Card>
      )}

      {/* View Design Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Design Request Details</DialogTitle>
            <DialogDescription>Submitted on {selectedDesign?.submissionDate}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Client</h3>
              <p>{selectedDesign?.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Email</h3>
                <p>
                  <a href={`mailto:${selectedDesign?.email}`} className="text-luxury-gold hover:underline">
                    {selectedDesign?.email}
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Phone</h3>
                <p>
                  <a href={`tel:${selectedDesign?.phone}`} className="text-luxury-gold hover:underline">
                    {selectedDesign?.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Design Idea</h3>
              <p className="whitespace-pre-wrap">{selectedDesign?.designIdea}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Current Status</h3>
              <p>{getStatusBadge(selectedDesign?.status)}</p>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
              onClick={() => {
                setIsViewDialogOpen(false)
                handleStatusChange(selectedDesign)
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>Change the status of this design request.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Consultation">In Consultation</SelectItem>
                <SelectItem value="Design Phase">Design Phase</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
              onClick={handleUpdateStatus}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

