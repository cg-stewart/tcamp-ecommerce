"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Download, ExternalLink, Filter, X, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useUserWorkshops } from "@/lib/hooks/use-dashboard"

const upcomingWorkshops = [
  {
    id: "1",
    title: "Sewing Basics for Beginners",
    date: "June 15-20, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "TCamp Studio A",
    image: "/placeholder.svg?height=100&width=200&text=Sewing+Basics",
    status: "Confirmed",
    participants: 1,
    materials: true,
  },
  {
    id: "2",
    title: "Pattern Making Workshop",
    date: "July 5-10, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "TCamp Studio B",
    image: "/placeholder.svg?height=100&width=200&text=Pattern+Making",
    status: "Pending Payment",
    participants: 2,
    materials: false,
  },
]

const pastWorkshops = [
  {
    id: "3",
    title: "Introduction to Embroidery",
    date: "April 10-15, 2024",
    instructor: "Maria Garcia",
    certificate: true,
  },
  {
    id: "4",
    title: "Sustainable Fabric Selection",
    date: "March 5-10, 2024",
    instructor: "James Wilson",
    certificate: true,
  },
  {
    id: "5",
    title: "Color Theory for Fashion",
    date: "February 15-20, 2024",
    instructor: "Sophia Chen",
    certificate: false,
  },
]

const availableWorkshops = [
  {
    id: "6",
    title: "Advanced Tailoring Techniques",
    date: "August 1-10, 2024",
    time: "1:00 PM - 4:00 PM",
    location: "TCamp Studio A",
    image: "/placeholder.svg?height=100&width=200&text=Advanced+Tailoring",
    price: "$349",
    spotsLeft: 3,
    category: "Advanced",
    isFree: false,
  },
  {
    id: "7",
    title: "Sustainable Fashion Workshop",
    date: "August 15-20, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "TCamp Studio B",
    image: "/placeholder.svg?height=100&width=200&text=Sustainable+Fashion",
    price: "$279",
    spotsLeft: 10,
    category: "All Levels",
    isFree: false,
  },
  {
    id: "8",
    title: "Textile Printing & Dyeing",
    date: "September 5-10, 2024",
    time: "1:00 PM - 5:00 PM",
    location: "TCamp Studio C",
    image: "/placeholder.svg?height=100&width=200&text=Textile+Printing",
    price: "$299",
    spotsLeft: 6,
    category: "Intermediate",
    isFree: false,
  },
  {
    id: "9",
    title: "Fashion Illustration",
    date: "September 20-25, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "TCamp Studio A",
    image: "/placeholder.svg?height=100&width=200&text=Fashion+Illustration",
    price: "$229",
    spotsLeft: 12,
    category: "Beginner",
    isFree: false,
  },
  {
    id: "10",
    title: "Introduction to Sewing",
    date: "October 5-10, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "TCamp Studio B",
    image: "/placeholder.svg?height=100&width=200&text=Intro+Sewing",
    price: "Free",
    spotsLeft: 15,
    category: "Beginner",
    isFree: true,
  },
  {
    id: "11",
    title: "Community Upcycling Workshop",
    date: "October 15-20, 2024",
    time: "1:00 PM - 4:00 PM",
    location: "TCamp Studio C",
    image: "/placeholder.svg?height=100&width=200&text=Upcycling",
    price: "Free",
    spotsLeft: 8,
    category: "All Levels",
    isFree: true,
  },
]

// Available categories for filtering
const categories = ["Beginner", "Intermediate", "Advanced", "All Levels"]

export default function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([])
    setPriceFilter("all")
  }

  // Apply filters to workshops
  const filteredWorkshops = availableWorkshops.filter((workshop) => {
    // Apply search filter
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply category filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(workshop.category)

    // Apply price filter
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && workshop.isFree) ||
      (priceFilter === "paid" && !workshop.isFree)

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Count active filters
  const activeFilterCount = (selectedCategories.length > 0 ? 1 : 0) + (priceFilter !== "all" ? 1 : 0)

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Workshops</h1>
      </div>

      <Tabs defaultValue="my-workshops" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-workshops">My Workshops</TabsTrigger>
          <TabsTrigger value="available-workshops">Available Workshops</TabsTrigger>
        </TabsList>

        <TabsContent value="my-workshops" className="space-y-8 w-full">
          <div className="space-y-6 w-full">
            <h2 className="text-2xl font-bold">Upcoming Workshops</h2>
            {upcomingWorkshops.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 w-full">
                {upcomingWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="overflow-hidden w-full">
                    <div className="flex border-b p-4">
                      <div className="w-24 h-24 relative flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={workshop.image || "/placeholder.svg"}
                          alt={workshop.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex flex-col justify-center">
                        <h3 className="font-bold">{workshop.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full inline-block w-fit mt-1 ${
                            workshop.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {workshop.status}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-luxury-gold" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-luxury-gold" />
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-luxury-gold" />
                        <span>{workshop.location}</span>
                      </div>
                      <div className="pt-2 flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">Participants: {workshop.participants}</span>
                          {workshop.materials && (
                            <span className="ml-4 text-sm text-green-600">Materials Included</span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming workshops.</p>
                  <Button asChild>
                    <Link href="/workshops">Browse Workshops</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6 w-full">
            <h2 className="text-2xl font-bold">Past Workshops</h2>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Workshop History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastWorkshops.map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell className="font-medium">{workshop.title}</TableCell>
                        <TableCell>{workshop.date}</TableCell>
                        <TableCell>{workshop.instructor}</TableCell>
                        <TableCell>
                          {workshop.certificate ? (
                            <span className="text-green-600">Available</span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {workshop.certificate && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Certificate
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Materials
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available-workshops" className="space-y-8 w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
            <div className="flex-1">
              <Input
                placeholder="Search workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-luxury-gold text-white">{activeFilterCount}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Workshops</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Level</DropdownMenuLabel>
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

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Price</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={priceFilter === "free"}
                    onCheckedChange={() => setPriceFilter(priceFilter === "free" ? "all" : "free")}
                  >
                    Free
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priceFilter === "paid"}
                    onCheckedChange={() => setPriceFilter(priceFilter === "paid" ? "all" : "paid")}
                  >
                    Paid
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-center justify-center text-red-500 cursor-pointer"
                  onClick={clearFilters}
                >
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="outline" className="flex items-center gap-1 bg-luxury-lavender/50">
                  {category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(category)} />
                </Badge>
              ))}
              {priceFilter !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1 bg-luxury-lavender/50">
                  {priceFilter === "free" ? "Free" : "Paid"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceFilter("all")} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={workshop.image || "/placeholder.svg"}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-luxury-gold text-luxury-lavender px-3 py-1 rounded-full text-xs font-medium">
                    {workshop.category}
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-luxury-gold" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-luxury-gold" />
                    <span>{workshop.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-luxury-gold" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="font-medium text-luxury-gold">{workshop.price}</p>
                      <p className="text-xs text-muted-foreground">{workshop.spotsLeft} spots left</p>
                    </div>
                    <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">Register</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )

          {filteredWorkshops.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No workshops match your search criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  clearFilters()
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

