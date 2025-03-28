import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorkshopCardProps {
  id: string
  title: string
  description: string
  image: string
  date: string
  time: string
  price: string
  spotsLeft: number
  category: string
}

export function WorkshopCard({
  id,
  title,
  description,
  image,
  date,
  time,
  price,
  spotsLeft,
  category,
}: WorkshopCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <Badge className="absolute top-2 right-2 bg-luxury-gold text-luxury-lavender">{category}</Badge>
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-luxury-gold" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-luxury-gold" />
          <span>{time}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-luxury-gold" />
          <span>{spotsLeft} spots left</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <span className="font-bold text-luxury-gold">{price}</span>
        <Button asChild className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
          <Link href={`/workshops/${id}`}>Register</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

