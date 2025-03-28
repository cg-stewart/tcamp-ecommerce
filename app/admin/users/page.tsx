"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Search,
  MoreHorizontal,
  Calendar,
  User,
  CalendarIcon,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllUsers, updateUser } from "@/app/actions/user-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const { has } = await auth();
  const isAdmin = await has({ role: 'org:admin' });

  if (!isAdmin) {
    redirect('/');
  }

  return {
    title: "User Management - Admin Dashboard",
  };
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await getAllUsers();
        if (result.success && result.data) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleViewUser = (user: {
    id: string;
    name: string;
    email: string;
    status: string;
    role?: string;
  }) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleToggleStatus = async (user: { id: string; status: string }) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("status", newStatus);

      const result = await updateUser(user.id, formData);

      if (!result.success) {
        throw new Error(result.message || "Failed to update user");
      }

      // Update local data
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );

      toast({
        description: `User is now ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Workshops</TableHead>
                  <TableHead>Custom Designs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-luxury-gold" />
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:underline"
                          >
                            {user.email}
                          </a>
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          <a
                            href={`tel:${user.phone}`}
                            className="hover:underline"
                          >
                            {user.phone}
                          </a>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-luxury-gold" />
                        {user.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.workshopsAttended}</TableCell>
                    <TableCell>{user.customDesigns}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => handleViewUser(user)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                          >
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
                            {user.status === "Active"
                              ? "Deactivate"
                              : "Activate"}{" "}
                            User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact User
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
            <p className="text-muted-foreground mb-4">No users found.</p>
          </CardContent>
        </Card>
      )}

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Member since {selectedUser?.joinDate}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Name</h3>
              <p>{selectedUser?.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Email</h3>
                <p>
                  <a
                    href={`mailto:${selectedUser?.email}`}
                    className="text-luxury-gold hover:underline"
                  >
                    {selectedUser?.email}
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Phone</h3>
                <p>
                  <a
                    href={`tel:${selectedUser?.phone}`}
                    className="text-luxury-gold hover:underline"
                  >
                    {selectedUser?.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Status</h3>
                <p>
                  <Badge
                    className={
                      selectedUser?.status === "Active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                  >
                    {selectedUser?.status}
                  </Badge>
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Workshops Attended</h3>
                <p className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-luxury-gold" />
                  {selectedUser?.workshopsAttended}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Custom Designs</h3>
                <p className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1 text-luxury-gold" />
                  {selectedUser?.customDesigns}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
              onClick={() => {
                setIsViewDialogOpen(false);
                handleToggleStatus(selectedUser);
              }}
            >
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"}{" "}
              User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
