import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  return {
    title: "Newsletter Management - Admin Dashboard",
  };
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { Mail, Search, MoreHorizontal, Calendar, Download, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAllNewsletterSubscribers as getAllSubscribers, updateSubscriberPreferences as updateSubscriberStatus } from "@/app/actions/newsletter-actions"

export default function AdminNewsletterPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  const [subscribers, setSubscribers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        const result = await getAllSubscribers()
        if (result.success && result.data) {
          setSubscribers(result.data)
        }
      } catch (error) {
        console.error("Failed to load subscribers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscribers()
  }, [])

  const handleStatusChange = (subscriber: any) => {
    setSelectedSubscriber(subscriber)
    setNewStatus(subscriber.status)
    setIsStatusDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('status', newStatus)

      const result = await updateSubscriberStatus(selectedSubscriber.id, formData)

      if (!result.success) {
        throw new Error(result.message || 'Failed to update status')
      }

      // Update local data
      setSubscribers(subscribers.map((sub) => 
        sub.id === selectedSubscriber.id ? { ...sub, status: newStatus } : sub
      ))

      toast({
        title: "Status Updated",
        description: "The subscriber status has been updated successfully.",
      })

      setIsStatusDialogOpen(false)

      // Update local state
      setSubscribers(subscribers.map(sub => 
        sub.id === selectedSubscriber?.id ? { ...sub, status: newStatus } : sub
      ))
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
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>
      case "Unsubscribed":
        return <Badge className="bg-gray-500">Unsubscribed</Badge>
      case "Bounced":
        return <Badge className="bg-red-500">Bounced</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredSubscribers = subscribers?.filter(
    (subscriber) =>
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.source.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <Button
          className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
          onClick={() => {
            toast({
              title: "Export Started",
              description: "Your subscriber list is being exported.",
            })
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Subscribers
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscribers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading subscribers...</div>
      ) : filteredSubscribers && filteredSubscribers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscription Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-luxury-gold" />
                        <a href={`mailto:${subscriber.email}`} className="hover:underline">
                          {subscriber.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-luxury-gold" />
                        {subscriber.subscriptionDate}
                      </div>
                    </TableCell>
                    <TableCell>{subscriber.source}</TableCell>
                    <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleStatusChange(subscriber)}>
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
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Subscriber
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
            <p className="text-muted-foreground mb-4">No subscribers found.</p>
          </CardContent>
        </Card>
      )}

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Subscriber Status</DialogTitle>
            <DialogDescription>Change the status of this subscriber.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="Bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
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

