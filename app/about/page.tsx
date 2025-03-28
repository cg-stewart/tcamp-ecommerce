import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About TCamp</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering individuals to create their own style while promoting sustainable practices in the fashion
          industry.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="mb-4">
            TCamp was born out of a passion for sustainable fashion and a desire to empower individuals with the skills
            to create their own unique style. Founded in 2020 by a group of fashion industry veterans and environmental
            advocates, we started as a small sewing workshop in a local community center.
          </p>
          <p>
            Today, we've grown into a comprehensive platform offering online and in-person workshops, a curated
            collection of sustainable clothing, and custom design services. Our journey has been driven by the belief
            that fashion can be both beautiful and responsible.
          </p>
        </div>
        <div className="relative aspect-video">
          <Image
            src="/placeholder.svg?height=400&width=600&text=Our+Story"
            alt="TCamp Story"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          At the heart of TCamp are four core values that guide everything we do:
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Sustainability",
              description: "We prioritize eco-friendly materials and practices in all our operations.",
            },
            {
              title: "Empowerment",
              description:
                "We equip individuals with the skills and knowledge to express their creativity through fashion.",
            },
            { title: "Quality", description: "We believe in craftsmanship and creating garments that last." },
            { title: "Community", description: "We foster a supportive community of fashion enthusiasts and makers." },
          ].map((value, index) => (
            <div key={index} className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Impact</h2>
        <div className="grid gap-6 md:grid-cols-3 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <p>Workshop Participants</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <p>Sustainable Garments Sold</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50%</div>
            <p>Reduction in Textile Waste</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Whether you're a beginner looking to learn sewing basics or an experienced designer aiming to create
          sustainable fashion, TCamp has something for you. Join us in our mission to transform the fashion industry.
        </p>
        <Button size="lg">Explore Our Workshops</Button>
      </div>
    </div>
  )
}

