"use client"

import { useEffect, useState } from "react"
import { WorkshopCard } from "@/components/workshop-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ArrowRight, CalendarIcon, Clock, UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAllWorkshops } from "@/app/actions/workshop-actions"

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([])
  const [featuredWorkshops, setFeaturedWorkshops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const result = await getAllWorkshops()
        if (result.success && result.data) {
          setWorkshops(result.data)
          setFeaturedWorkshops(result.data.filter((workshop) => workshop.isFeatured))
        }
      } catch (error) {
        console.error("Failed to load workshops:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkshops()
  }, [])

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Discover Our Workshops</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Learn, create, and master new skills with our expert-led workshops
        </p>
        <div className="flex max-w-md mx-auto">
          <Input
            className="rounded-r-none"
            placeholder="Search workshops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="rounded-l-none">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Featured Workshops */}
      {featuredWorkshops.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Workshops</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {featuredWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="group relative overflow-hidden rounded-lg border shadow-md hover:shadow-lg transition-all"
              >
                <div className="aspect-video relative">
                  <Image
                    src={workshop.image || "/placeholder.svg"}
                    alt={workshop.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-luxury-gold text-luxury-lavender px-3 py-1 rounded-full text-sm font-medium">
                    {workshop.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{workshop.title}</h3>
                  <p className="text-muted-foreground mb-4">{workshop.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-luxury-gold" />
                      <span className="text-sm">{workshop.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-luxury-gold" />
                      <span className="text-sm">{workshop.time}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2 text-luxury-gold" />
                      <span className="text-sm">{workshop.spotsLeft} spots left</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-luxury-gold">{workshop.price}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
                    <Link href={`/workshops/${workshop.id}`}>
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">All Workshops</h2>
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4 h-[350px] animate-pulse">
              <div className="w-full h-40 bg-luxury-lavender/30 rounded-md mb-4" />
              <div className="w-3/4 h-6 bg-luxury-lavender/30 rounded mb-2" />
              <div className="w-full h-4 bg-luxury-lavender/30 rounded mb-4" />
              <div className="flex justify-between items-center">
                <div className="w-16 h-5 bg-luxury-lavender/30 rounded" />
                <div className="w-24 h-8 bg-luxury-lavender/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredWorkshops.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkshops.map((workshop) => (
            <WorkshopCard key={workshop.id} {...workshop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No workshops found matching your search criteria.</p>
          <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted-foreground mb-6">
          We're always adding new workshops. Let us know what you'd like to learn!
        </p>
        <Button size="lg" className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
          Request a Workshop
        </Button>
      </div>
    </div>
  )
}

