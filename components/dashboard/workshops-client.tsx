"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Download, ExternalLink, Filter, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Workshop {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price?: string;
  spotsLeft?: number;
  category?: string;
  isFree?: boolean;
  status?: string;
  participants?: number;
  materials?: boolean;
  instructor?: string;
  certificate?: boolean;
}

interface WorkshopsClientProps {
  userWorkshops: Workshop[];
  pastWorkshops: Workshop[];
  availableWorkshops: Workshop[];
}

// Available categories for filtering
const categories = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export function WorkshopsClient({ userWorkshops, pastWorkshops, availableWorkshops }: WorkshopsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceFilter("all");
  };

  // Apply filters to workshops
  const filteredWorkshops = availableWorkshops.filter((workshop) => {
    // Apply search filter
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workshop.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    // Apply category filter
    const matchesCategory =
      selectedCategories.length === 0 || (workshop.category && selectedCategories.includes(workshop.category));

    // Apply price filter
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && workshop.isFree) ||
      (priceFilter === "paid" && !workshop.isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Count active filters
  const activeFilterCount = (selectedCategories.length > 0 ? 1 : 0) + (priceFilter !== "all" ? 1 : 0);

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Workshops</h1>
      </div>

      <Tabs defaultValue="my-workshops" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-workshops">My Workshops</TabsTrigger>
          <TabsTrigger value="available">Available Workshops</TabsTrigger>
        </TabsList>

        <TabsContent value="my-workshops" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming Workshops */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Workshops</CardTitle>
                <CardDescription>Your registered workshops</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userWorkshops.length > 0 ? (
                  userWorkshops.map((workshop) => (
                    <div key={workshop.id} className="flex items-start space-x-4">
                      <Image
                        src={workshop.image}
                        alt={workshop.title}
                        width={100}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div className="space-y-1">
                        <h3 className="font-semibold">{workshop.title}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {workshop.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {workshop.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {workshop.location}
                          </div>
                        </div>
                        <Badge variant={workshop.status === "Confirmed" ? "default" : "secondary"}>
                          {workshop.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <h3 className="font-semibold">No Upcoming Workshops</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Browse our available workshops and join one that interests you.
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="#available">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Browse Workshops
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Workshops */}
            <Card>
              <CardHeader>
                <CardTitle>Past Workshops</CardTitle>
                <CardDescription>Your workshop history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Certificate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastWorkshops.length > 0 ? pastWorkshops.map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workshop.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {workshop.instructor}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{workshop.date}</TableCell>
                        <TableCell>
                          {workshop.certificate ? (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Certificate
                            </Button>
                          ) : (
                            <Badge variant="outline">Not Available</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              You haven't completed any workshops yet.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {categories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Price</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setPriceFilter("all")}>
                        All Prices
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriceFilter("free")}>
                        Free Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriceFilter("paid")}>
                        Paid Only
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {filteredWorkshops.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredWorkshops.map((workshop) => (
                  <Card key={workshop.id}>
                    <CardContent className="p-0">
                      <Image
                        src={workshop.image}
                        alt={workshop.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{workshop.title}</h3>
                          <div className="text-sm text-muted-foreground space-y-1 mt-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {workshop.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {workshop.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {workshop.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant={workshop.isFree ? "secondary" : "default"}>
                              {workshop.price}
                            </Badge>
                            {workshop.category && (
                              <Badge variant="outline" className="ml-2">
                                {workshop.category}
                              </Badge>
                            )}
                          </div>
                          <Button asChild>
                            <Link href={`/workshops/${workshop.id}`}>
                              View Details
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                        {workshop.spotsLeft !== undefined && workshop.spotsLeft <= 5 && (
                          <p className="text-sm text-red-500">
                            Only {workshop.spotsLeft} spots left!
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto text-muted-foreground">
                  <Calendar className="w-full h-full" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No Workshops Found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchQuery || selectedCategories.length > 0 || priceFilter !== "all"
                      ? "Try adjusting your filters to see more workshops."
                      : "Check back soon for new workshop announcements!"}
                  </p>
                </div>
                {(searchQuery || selectedCategories.length > 0 || priceFilter !== "all") && (
                  <Button onClick={clearFilters} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
