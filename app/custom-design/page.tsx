import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CustomDesignPage() {
  return (
    <div className="container py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold mb-4">Create Your Dream Design</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Bring your unique vision to life with our custom design service. Our expert designers will work closely with
            you to create the perfect piece that reflects your style.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                1
              </div>
              <div>
                <h3 className="font-semibold">Book a Consultation</h3>
                <p className="text-muted-foreground">Schedule a one-on-one session with our designers</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                2
              </div>
              <div>
                <h3 className="font-semibold">Share Your Vision</h3>
                <p className="text-muted-foreground">Discuss your ideas, preferences, and inspirations</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                3
              </div>
              <div>
                <h3 className="font-semibold">Refine the Design</h3>
                <p className="text-muted-foreground">Review sketches and make adjustments</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                4
              </div>
              <div>
                <h3 className="font-semibold">Create Your Piece</h3>
                <p className="text-muted-foreground">We craft your custom design with care and precision</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Start Your Custom Design Journey</CardTitle>
              <CardDescription>Fill out this form to book your consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone</label>
                <Input id="phone" placeholder="Your phone number" />
              </div>
              <div className="space-y-2">
                <label htmlFor="design-idea">Tell us about your design idea</label>
                <Textarea id="design-idea" placeholder="Describe your vision..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book Your Consultation</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Custom Design Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Image
            src="/placeholder.svg?height=300&width=400&text=Custom+Design+1"
            alt="Custom Design 1"
            width={400}
            height={300}
            className="rounded-lg"
          />
          <Image
            src="/placeholder.svg?height=300&width=400&text=Custom+Design+2"
            alt="Custom Design 2"
            width={400}
            height={300}
            className="rounded-lg"
          />
          <Image
            src="/placeholder.svg?height=300&width=400&text=Custom+Design+3"
            alt="Custom Design 3"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

