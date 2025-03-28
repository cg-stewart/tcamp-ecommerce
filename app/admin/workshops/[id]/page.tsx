import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  return {
    title: "Workshop Details - Admin Dashboard",
  };
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { useUploadThing } from "@/lib/utils/uploadthing";
import "@uploadthing/react/styles.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, Edit, Calendar, Clock, MapPin, UserCheck, UploadCloud, 
  MessageSquare, FileText, Video, Image as ImageIcon, Users, MoreHorizontal, 
  Plus, Mail, RefreshCw, Send, Download, Trash, Info, Volume2, Loader2
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { useWorkshopRegistrations } from "@/lib/hooks/use-admin";
import { fetcher } from "@/lib/swr-fetchers";

export default function WorkshopDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const workshopId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [messageInput, setMessageInput] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"document" | "image" | "video" | "audio">("document");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadManualUrl, setUploadManualUrl] = useState("");
  const [isManualUrlEntry, setIsManualUrlEntry] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Fetch workshop data
  const { 
    data: workshop, 
    error: workshopError, 
    isLoading: workshopLoading,
    mutate: mutateWorkshop
  } = useSWR<{
    success: boolean;
    data: any;
  }>(
    `/api/admin/workshops/${workshopId}`,
    fetcher
  );

  // Fetch workshop registrations
  const {
    registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
    mutate: mutateRegistrations
  } = useWorkshopRegistrations(workshopId);

  // Fetch workshop resources
  const {
    data: resources,
    error: resourcesError,
    isLoading: resourcesLoading,
    mutate: mutateResources
  } = useSWR<{
    success: boolean;
    data: any[];
  }>(
    `/api/admin/workshops/${workshopId}/resources`,
    fetcher
  );

  // Fetch workshop messages
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
    mutate: mutateMessages
  } = useSWR<{
    success: boolean;
    data: any[];
  }>(
    `/api/admin/workshops/${workshopId}/messages`,
    fetcher
  );

  if (workshopLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (workshopError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error Loading Workshop</h2>
        <p className="text-red-500 mb-6">
          There was a problem loading the workshop details.
        </p>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => mutateWorkshop()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  const workshopData = workshop?.data;

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const response = await fetch(`/api/admin/workshops/${workshopId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageInput }),
      });

      if (response.ok) {
        setMessageInput("");
        mutateMessages();
        toast({
          title: "Message Sent",
          description: "Your message has been sent to all workshop participants",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Initialize UploadThing
  const { startUpload, isUploading: isFileUploading } = useUploadThing("workshopResourceUploader", {
    onClientUploadComplete: async (res) => {
      // After successful upload, add the resource to the workshop
      if (res && res.length > 0) {
        const fileUrl = res[0].ufsUrl;
        const fileType = getFileTypeFromUrl(fileUrl);
        
        try {
          const response = await fetch(`/api/admin/workshops/${workshopId}/resources`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: uploadTitle,
              description: uploadDescription,
              url: fileUrl,
              type: fileType || uploadType,
            }),
          });
          
          if (response.ok) {
            setUploadDialogOpen(false);
            setUploadTitle("");
            setUploadDescription("");
            setSelectedFile(null);
            mutateResources();
            toast({
              title: "Resource Uploaded",
              description: "The resource has been uploaded successfully",
            });
          } else {
            throw new Error("Failed to save resource metadata");
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to save resource information",
            variant: "destructive",
          });
        }
      }
    },
    onUploadError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });
  
  // Helper function to determine file type from URL
  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
    if (["pdf"].includes(extension)) return "document";
    if (["mp4", "webm", "mov"].includes(extension)) return "video";
    if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
    
    return "document";
  };
  
  // Handle file upload
  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for the resource",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile) {
      // Use UploadThing to upload the file
      await startUpload([selectedFile]);
    } else {
      // Manual URL entry without file upload
      try {
        const response = await fetch(`/api/admin/workshops/${workshopId}/resources`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: uploadTitle,
            description: uploadDescription,
            url: uploadManualUrl,
            type: uploadType,
          }),
        });

        if (response.ok) {
          setUploadDialogOpen(false);
          setUploadTitle("");
          setUploadDescription("");
          setSelectedFile(null);
          setUploadManualUrl("");
          mutateResources();
          toast({
            title: "Resource Uploaded",
            description: "The resource has been uploaded successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to upload resource",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload resource",
          variant: "destructive",
        });
      }
    }
  };

  // Handle sending emails to participants
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailSubject || !emailBody) {
      toast({
        title: "Missing Information",
        description: "Please provide a subject and message body",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/workshops/${workshopId}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          subject: emailSubject,
          body: emailBody
        }),
      });

      if (response.ok) {
        setEmailDialogOpen(false);
        setEmailSubject("");
        setEmailBody("");
        toast({
          title: "Email Sent",
          description: "Email has been sent to all workshop participants",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/workshops">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{workshopData?.title}</h1>
          <Badge className="ml-2">
            {workshopData?.isFeatured ? "Featured" : "Standard"}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href={`/admin/workshops/edit/${workshopId}`}>
              <Edit className="h-4 w-4 mr-2" /> Edit Workshop
            </Link>
          </Button>
        </div>
      </div>

      {/* Workshop navigation tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{workshopData?.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{workshopData?.time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{workshopData?.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium">{workshopData?.capacity} participants</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p>{workshopData?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Registered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {registrationsLoading 
                    ? <Skeleton className="h-8 w-12 inline-block" />
                    : registrations?.students?.length || 0
                  }
                  <span className="text-sm text-gray-500 ml-2">
                    / {workshopData?.capacity}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("participants")}>
                  View Participants
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {resourcesLoading 
                    ? <Skeleton className="h-8 w-12 inline-block" />
                    : resources?.data?.length || 0
                  }
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("resources")}>
                  Manage Resources
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setEmailDialogOpen(true)}>
                  <Mail className="h-4 w-4 mr-2" /> Email Participants
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                  setUploadDialogOpen(true);
                  setUploadType("document");
                }}>
                  <UploadCloud className="h-4 w-4 mr-2" /> Upload Resource
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Participants</CardTitle>
              <CardDescription>
                Manage participants registered for this workshop
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registrationsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : registrationsError ? (
                <div className="text-center py-4">
                  <p className="text-red-500">Failed to load participants</p>
                  <Button onClick={() => mutateRegistrations()} className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations?.students?.map((student) => (
                          <TableRow key={student.userId}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.phone || '-'}</TableCell>
                            <TableCell>{student.participants}</TableCell>
                            <TableCell>
                              <Badge variant={student.paymentStatus === 'paid' ? 'default' : student.paymentStatus === 'pending' ? 'outline' : 'destructive'}>
                                {student.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {registrations?.students?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No participants registered yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Waitlist */}
                  {registrations?.waitlist?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Waitlist</h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {registrations?.waitlist?.map((student) => (
                              <TableRow key={student.userId}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.phone || '-'}</TableCell>
                                <TableCell>{student.participants}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Move to Enrolled
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("overview")}>
                Back to Overview
              </Button>
              <Button onClick={() => setEmailDialogOpen(true)}>
                <Mail className="h-4 w-4 mr-2" /> Email All Participants
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workshop Resources</CardTitle>
                <CardDescription>Upload and manage resources for participants</CardDescription>
              </div>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Resource
              </Button>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : resourcesError ? (
                <div className="text-center py-6">
                  <p className="text-red-500 mb-2">Failed to load resources</p>
                  <Button onClick={() => mutateResources()}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                  </Button>
                </div>
              ) : resources?.data?.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Resources Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload documents, videos, or images for your workshop participants
                  </p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add First Resource
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources?.data?.map((resource: any) => (
                    <div key={resource.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        {resource.type === 'document' && <FileText className="h-8 w-8 text-blue-500 mr-3" />}
                        {resource.type === 'video' && <Video className="h-8 w-8 text-red-500 mr-3" />}
                        {resource.type === 'image' && <ImageIcon className="h-8 w-8 text-green-500 mr-3" />}
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-gray-500">{resource.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" /> Download
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle>Workshop Communication</CardTitle>
              <CardDescription>
                Send messages to all workshop participants
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-grow pr-4 mb-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-3/4 ml-auto" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : messagesError ? (
                  <div className="text-center py-6">
                    <p className="text-red-500 mb-2">Failed to load messages</p>
                    <Button onClick={() => mutateMessages()}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                    </Button>
                  </div>
                ) : messages?.data?.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Messages Yet</h3>
                    <p className="text-muted-foreground">
                      Send your first message to workshop participants
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages?.data?.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.userName === "Admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.userName === "Admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>
                                {message.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">
                              {message.userName} · {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Resource Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadResource}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="upload-title">Title</Label>
                <Input
                  id="upload-title"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Resource title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-description">Description</Label>
                <Textarea
                  id="upload-description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Short description of this resource (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="manual-url" 
                    checked={isManualUrlEntry} 
                    onCheckedChange={(checked: boolean) => setIsManualUrlEntry(checked === true)}
                  />
                  <Label htmlFor="manual-url">Enter URL manually</Label>
                </div>
              </div>
              
              {isManualUrlEntry ? (
                <div className="space-y-2">
                  <Label htmlFor="upload-type">Resource Type</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={uploadType === "document" ? "default" : "outline"}
                      onClick={() => setUploadType("document")}
                    >
                      <FileText className="h-4 w-4 mr-2" /> Document
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={uploadType === "image" ? "default" : "outline"}
                      onClick={() => setUploadType("image")}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" /> Image
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={uploadType === "video" ? "default" : "outline"}
                      onClick={() => setUploadType("video")}
                    >
                      <Video className="h-4 w-4 mr-2" /> Video
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={uploadType === "audio" ? "default" : "outline"}
                      onClick={() => setUploadType("audio")}
                    >
                      <Volume2 className="h-4 w-4 mr-2" /> Audio
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="upload-url">Resource URL</Label>
                    <Input
                      id="upload-url"
                      value={uploadManualUrl}
                      onChange={(e) => setUploadManualUrl(e.target.value)}
                      placeholder="https://example.com/resource.pdf"
                      required={isManualUrlEntry}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <FileText className="h-8 w-8 text-blue-500 mr-2" />
                          <span className="font-medium">{selectedFile.name}</span>
                        </div>
                        <p className="text-sm text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          Select different file
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="h-10 w-10 text-gray-400 mx-auto" />
                        <p className="text-sm font-medium">Drag and drop or click to select</p>
                        <p className="text-xs text-gray-500">Supports images, PDFs, videos, and audio files</p>
                        <Input
                          id="upload-file"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('upload-file')?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!uploadTitle || (isManualUrlEntry ? !uploadManualUrl : !selectedFile) || isFileUploading}
              >
                {isFileUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>Upload Resource</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Participants Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Email Workshop Participants</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendEmail}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Message</Label>
                <Textarea
                  id="email-body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Email content..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Email</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
