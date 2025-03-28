"use client";

import { useState, useCallback, useEffect } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  return {
    title: "Volunteer Management - Admin Dashboard",
  };
}
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { updateVolunteerStatus, contactVolunteer, bulkContactVolunteers, getAllVolunteers } from "@/app/actions/volunteer-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, RefreshCw } from "lucide-react";

// Remove AG-Grid CSS imports - these will be imported globally

// Define volunteer type
type Volunteer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  interests: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVolunteers, setSelectedVolunteers] = useState<Volunteer[]>([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        const result = await getAllVolunteers();
        if (result.success && result.data) {
          setVolunteers(result.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load volunteers",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVolunteers();
  }, []);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(null);
  const [formState, setFormState] = useState({
    status: "new",
    contactMethod: "email",
    subject: "",
    message: ""
  });

  // Status color mapping
  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-green-100 text-green-800", 
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-gray-100 text-gray-800"
  };

  // AG Grid column definitions
  const columnDefs: any = [
    {
      headerName: "",
      field: "id",
      width: 70,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    { 
      headerName: "Name", 
      field: "name",
      valueGetter: (params: any) => `${params.data.firstName} ${params.data.lastName}`,
      flex: 1 
    },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Phone", field: "phone", flex: 1 },
    { headerName: "City", field: "city", flex: 1 },
    { headerName: "State", field: "state", width: 100 },
    { 
      headerName: "Status", 
      field: "status", 
      width: 150,
      cellRenderer: (params: any) => {
        const color = statusColors[params.value as string] || "bg-gray-100 text-gray-800";
        return `<div class="flex justify-center">
                  <span class="${color} px-2 py-1 rounded-full text-xs font-medium">
                    ${params.value}
                  </span>
                </div>`;
      }
    },
    { 
      headerName: "Actions", 
      field: "actions",
      width: 180,
      cellRenderer: (params: any) => {
        return `<div class="flex space-x-2">
                  <button data-action="status" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Status
                  </button>
                  <button data-action="email" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">
                    Email
                  </button>
                  <button data-action="text" class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs">
                    Text
                  </button>
                </div>`;
      },
      cellRendererParams: {
        clicked: function(params: any) {
          const action = params.event.target.dataset.action;
          const volunteer = params.data;
          
          if (action === 'status') {
            setCurrentVolunteer(volunteer);
            setFormState(prev => ({ ...prev, status: volunteer.status }));
            setStatusDialogOpen(true);
          } else if (action === 'email') {
            setCurrentVolunteer(volunteer);
            setFormState(prev => ({ ...prev, contactMethod: 'email', subject: '', message: '' }));
            setContactDialogOpen(true);
          } else if (action === 'text') {
            setCurrentVolunteer(volunteer);
            setFormState(prev => ({ ...prev, contactMethod: 'sms', subject: '', message: '' }));
            setContactDialogOpen(true);
          }
        }
      }
    }
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  // Manual refresh data function
  const refreshData = useCallback(async () => {
    try {
      const result = await getAllVolunteers();
      if (result.success && result.data) {
        setVolunteers(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh volunteers",
        variant: "destructive"
      });
    }
  }, []);

  // Handle selection change
  const onSelectionChanged = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedVolunteers(selectedRows);
  }, []);

  // Handle cell click for actions
  const onCellClicked = useCallback((params: any) => {
    // Handle clicks on action buttons
    if (params.column.getColId() === 'actions' && params.event.target.dataset.action) {
      params.column.getColDef().cellRendererParams.clicked(params);
    }
  }, []);

  // Update volunteer status
  const handleStatusUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentVolunteer) return;
    
    try {
      const formData = new FormData();
      formData.append("status", formState.status);
      
      const result = await updateVolunteerStatus(currentVolunteer.id, formData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        setStatusDialogOpen(false);
        // Revalidate data after mutation
        refreshData();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  // Contact a volunteer
  const handleContactVolunteer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentVolunteer) return;
    
    try {
      const formData = new FormData();
      formData.append("contactMethod", formState.contactMethod);
      formData.append("subject", formState.subject);
      formData.append("message", formState.message);
      
      const result = await contactVolunteer(currentVolunteer.id, formData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        setContactDialogOpen(false);
        // Revalidate data after mutation
        refreshData();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to contact volunteer",
        variant: "destructive"
      });
    }
  };

  // Send bulk messages
  const handleBulkContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (selectedVolunteers.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one volunteer",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("contactMethod", formState.contactMethod);
      formData.append("subject", formState.subject);
      formData.append("message", formState.message);
      formData.append("volunteerIds", JSON.stringify(selectedVolunteers.map(v => v.id)));
      
      const result = await bulkContactVolunteers(formData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        setBulkDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk messages",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Volunteer Management</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Button 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={selectedVolunteers.length === 0}
            onClick={() => setBulkDialogOpen(true)}
          >
            Bulk Message ({selectedVolunteers.length})
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Volunteers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : volunteers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 mb-4">No volunteers found</p>
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          ) : (
            <div 
              className="ag-theme-alpine w-full h-[600px]"
              style={{ width: '100%', height: '600px' }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={volunteers}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
                onCellClicked={onCellClicked}
                pagination={true}
                paginationPageSize={10}
                domLayout="normal"
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleStatusUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Volunteer Status</Label>
                <Select 
                  value={formState.status} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Status</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Contact Volunteer Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Contact {currentVolunteer ? `${currentVolunteer.firstName} ${currentVolunteer.lastName}` : 'Volunteer'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleContactVolunteer}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contactMethod">Contact Method</Label>
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant={formState.contactMethod === "email" ? "default" : "outline"}
                    className={formState.contactMethod === "email" ? "bg-blue-600" : ""}
                    onClick={() => setFormState(prev => ({ ...prev, contactMethod: "email" }))}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    type="button"
                    variant={formState.contactMethod === "sms" ? "default" : "outline"}
                    className={formState.contactMethod === "sms" ? "bg-purple-600" : ""}
                    onClick={() => setFormState(prev => ({ ...prev, contactMethod: "sms" }))}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                </div>
              </div>
              
              {formState.contactMethod === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject"
                    value={formState.subject}
                    onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={`Enter your message to ${currentVolunteer ? currentVolunteer.firstName : 'the volunteer'}`}
                  rows={5}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Contact Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Send Bulk Message ({selectedVolunteers.length} volunteers)
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleBulkContact}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contactMethod">Contact Method</Label>
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant={formState.contactMethod === "email" ? "default" : "outline"}
                    className={formState.contactMethod === "email" ? "bg-blue-600" : ""}
                    onClick={() => setFormState(prev => ({ ...prev, contactMethod: "email" }))}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    type="button"
                    variant={formState.contactMethod === "sms" ? "default" : "outline"}
                    className={formState.contactMethod === "sms" ? "bg-purple-600" : ""}
                    onClick={() => setFormState(prev => ({ ...prev, contactMethod: "sms" }))}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                </div>
              </div>
              
              {formState.contactMethod === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject"
                    value={formState.subject}
                    onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={`Enter your message to all selected volunteers`}
                  rows={5}
                  required
                />
              </div>
              
              <div className="p-3 bg-amber-50 text-amber-800 rounded-md">
                <p className="text-sm font-medium">
                  This message will be sent to {selectedVolunteers.length} volunteers.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Send to All ({selectedVolunteers.length})</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
