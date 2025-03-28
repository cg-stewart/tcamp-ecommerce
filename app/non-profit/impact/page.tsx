import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample impact data
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
  {
    title: "Waste Reduction",
    value: "5 Tons",
    description: "Of textile waste diverted from landfills annually",
  },
]

const successStories = [
  {
    name: "Youth Employment Program",
    description:
      "Our youth employment program has provided job training and placement for over 100 young adults from underserved communities, with 85% of participants securing long-term employment in the fashion industry.",
    image: "/placeholder.svg?height=300&width=400&text=Youth+Program",
  },
  {
    name: "Sustainable Fashion Initiative",
    description:
      "Through our sustainable fashion initiative, we've partnered with 25 local designers to create eco-friendly collections, reducing water usage by 40% and eliminating harmful chemicals from the production process.",
    image: "/placeholder.svg?height=300&width=400&text=Sustainable+Fashion",
  },
  {
    name: "Community Workshop Series",
    description:
      "Our free community workshop series has reached over 1,000 participants across 15 neighborhoods, teaching valuable skills in sewing, upcycling, and sustainable design practices.",
    image: "/placeholder.svg?height=300&width=400&text=Community+Workshops",
  },
]

export default function ImpactPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Impact</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Measuring our contribution to communities, education, and sustainable fashion.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 mb-16">
        {impactStats.map((stat, index) => (
          <Card
            key={index}
            className="text-center border-2 border-luxury-lavender hover:border-luxury-gold transition-colors"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold text-luxury-gold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-1">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Success Stories</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {successStories.map((story, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image src={story.image || "/placeholder.svg"} alt={story.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{story.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{story.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-luxury-lavender/30 p-8 rounded-lg mb-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Environmental Impact</h2>
            <p className="mb-4">
              Sustainability is at the core of everything we do. Through our programs and initiatives, we've made
              significant strides in reducing the environmental footprint of fashion in our community.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-luxury-gold mr-2"></div>
                <span>Reduced water consumption by 40% in our production processes</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-luxury-gold mr-2"></div>
                <span>Diverted 5 tons of textile waste from landfills annually</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-luxury-gold mr-2"></div>
                <span>Eliminated harmful chemicals from all our design processes</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-luxury-gold mr-2"></div>
                <span>Implemented a zero-waste policy in all our workshops</span>
              </li>
            </ul>
          </div>
          <div className="relative aspect-video">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Environmental+Impact"
              alt="Environmental Impact"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Annual Impact Reports</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          We believe in transparency and accountability. Our annual impact reports provide detailed information about
          our programs, initiatives, and the difference we're making in our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
          >
            <Link href="#">2023 Impact Report</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-luxury-charcoal text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300"
          >
            <Link href="#">2022 Impact Report</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-luxury-charcoal text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300"
          >
            <Link href="#">2021 Impact Report</Link>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Help Us Increase Our Impact</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          With your support, we can expand our programs and reach even more communities.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
        >
          <Link href="/non-profit/donate">Support Our Mission</Link>
        </Button>
      </div>
    </div>
  )
}

