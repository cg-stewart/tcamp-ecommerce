"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useSWR from "swr"
import { Workshop } from "@/lib/types"

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function WorkshopsSection() {
  const { data, error, isLoading } = useSWR('/api/workshops?featured=true', fetcher)
  
  // Extract workshops from the response data
  const workshops: Workshop[] = data?.data || []

  return (
    <section className="py-16 bg-luxury-lavender/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-luxury-charcoal">Summer Workshops</h2>
            <p className="text-luxury-charcoal/70 mt-2">Register for our hands-on learning experiences</p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="mt-4 md:mt-0 text-luxury-gold hover:text-luxury-green hover:bg-luxury-lavender"
          >
            <Link href="/workshops" className="group">
              View All Workshops <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-2 border-luxury-lavender">
                <div className="aspect-video bg-luxury-lavender/50 animate-pulse" />
                <CardHeader>
                  <div className="w-1/3 h-4 bg-luxury-lavender/50 animate-pulse mb-2" />
                  <div className="w-2/3 h-6 bg-luxury-lavender/50 animate-pulse mb-2" />
                  <div className="w-full h-4 bg-luxury-lavender/50 animate-pulse" />
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div>
                    <div className="w-16 h-5 bg-luxury-lavender/50 animate-pulse mb-1" />
                    <div className="w-24 h-4 bg-luxury-lavender/50 animate-pulse" />
                  </div>
                  <div className="w-28 h-9 bg-luxury-lavender/50 animate-pulse rounded" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border-2 border-luxury-lavender hover:border-luxury-gold transition-colors">
                  <div className="aspect-video relative">
                    <Image
                      src={workshop.image || "/placeholder.svg"}
                      alt={workshop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center text-sm text-luxury-green mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      {workshop.date}
                    </div>
                    <CardTitle className="text-luxury-charcoal">{workshop.title}</CardTitle>
                    <CardDescription className="text-luxury-charcoal/70">{workshop.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div>
                      <p className="font-medium text-luxury-gold">{workshop.price}</p>
                      <p className="text-sm text-luxury-charcoal/60">{workshop.spotsLeft} spots left</p>
                    </div>
                    <Button asChild className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender">
                      <Link href={`/workshops/${workshop.id}`}>Register Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

