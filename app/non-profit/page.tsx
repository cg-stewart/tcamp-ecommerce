import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Users, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

// Sample data for the non-profit page
const impactStats = [
  {
    title: "Students Supported",
    value: "500+",
    description: "Through scholarships and free workshops",
  },
  {
    title: "Community Events",
    value: "50+",
    description: "Organized in underserved neighborhoods",
  },
  {
    title: "Sustainable Products",
    value: "100%",
    description: "Of our clothing line uses eco-friendly materials",
  },
  {
    title: "Funds Raised",
    value: "$250K+",
    description: "Invested back into community programs",
  },
]

const initiatives = [
  {
    title: "Education Access",
    description: "Providing scholarships and free workshops to underserved communities.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Sustainable Fashion",
    description: "Creating eco-friendly clothing and reducing textile waste.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Community Development",
    description: "Supporting local artists and entrepreneurs through mentorship and resources.",
    image: "/placeholder.svg?height=300&width=400",
  },
]

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & Executive Director",
    bio: "Sarah founded TCamp with a vision to combine education, fashion, and social impact.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Michael Rodriguez",
    role: "Creative Director",
    bio: "Michael oversees all creative aspects of our workshops and product designs.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Aisha Patel",
    role: "Community Outreach Manager",
    bio: "Aisha builds partnerships with local organizations to expand our impact.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "David Kim",
    role: "Sustainability Lead",
    bio: "David ensures our products and operations meet the highest environmental standards.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

const partners = [
  "/placeholder.svg?height=100&width=200&text=Partner+1",
  "/placeholder.svg?height=100&width=200&text=Partner+2",
  "/placeholder.svg?height=100&width=200&text=Partner+3",
  "/placeholder.svg?height=100&width=200&text=Partner+4",
  "/placeholder.svg?height=100&width=200&text=Partner+5",
  "/placeholder.svg?height=100&width=200&text=Partner+6",
]

export default function NonProfitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Non-profit hero"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Creating Positive Change Through{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-gold-600">
                Community Empowerment
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Our non-profit initiatives focus on education access, sustainable fashion, and community development to
              create lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/non-profit/donate">Donate Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/non-profit/volunteer">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
              <p className="mt-4 text-muted-foreground">
                TCamp is dedicated to empowering communities through education, sustainable fashion, and social impact
                initiatives. We believe in creating opportunities for underserved populations while promoting
                environmental responsibility.
              </p>
              <p className="mt-4 text-muted-foreground">
                Our approach combines hands-on workshops, eco-friendly product development, and community engagement to
                create a holistic model for positive change. Every purchase from our store directly supports our
                non-profit programs.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/non-profit/mission" className="group">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=400&width=600" alt="Our mission" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Impact</h2>
            <p className="mt-4 text-secondary-foreground/80">
              We're committed to creating measurable change in our communities. Here's what we've accomplished so far.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-secondary-foreground/10">
                <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                <p className="font-medium mt-2">{stat.title}</p>
                <p className="text-sm text-secondary-foreground/80 mt-1">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Initiatives</h2>
            <p className="mt-4 text-muted-foreground">
              We focus on three key areas to create lasting positive change in our communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={initiative.image || "/placeholder.svg"}
                    alt={initiative.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{initiative.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{initiative.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/non-profit/initiatives/${initiative.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Team</h2>
            <p className="mt-4 text-muted-foreground">Meet the dedicated individuals who make our mission possible.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* Donate Section */}

      {/* Get Involved Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Get Involved</h2>
            <p className="mt-4 text-muted-foreground">
              There are many ways to support our mission beyond donations. Join us in creating positive change.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Volunteer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your skills and time to help with workshops, events, and community outreach.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/non-profit/volunteer">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Fundraise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start your own fundraising campaign to support our programs and initiatives.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/non-profit/fundraise">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Shop With Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every purchase from our store directly supports our non-profit programs.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/store">Visit Store</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

