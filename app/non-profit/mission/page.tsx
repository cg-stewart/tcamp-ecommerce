import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MissionPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering communities through education, sustainable fashion, and social impact initiatives.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="mb-4">
            At TCamp, we envision a world where fashion is a force for positive change. We believe that by combining
            education, sustainable practices, and community engagement, we can create a more equitable and
            environmentally responsible fashion industry.
          </p>
          <p>
            Our mission is to empower individuals with the skills, knowledge, and resources they need to express their
            creativity through fashion while making conscious choices that benefit both people and the planet.
          </p>
        </div>
        <div className="relative aspect-video">
          <Image
            src="/placeholder.svg?height=400&width=600&text=Our+Vision"
            alt="Our Vision"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="bg-luxury-lavender/30 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Core Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-luxury-gold">Education</h3>
            <p>
              We believe in the power of knowledge sharing and skill development as tools for personal and community
              growth. Our workshops and training programs are designed to be accessible, engaging, and empowering.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-luxury-gold">Sustainability</h3>
            <p>
              We are committed to promoting and practicing sustainable fashion principles. From material selection to
              production methods, we prioritize choices that minimize environmental impact and promote circular economy.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-luxury-gold">Community</h3>
            <p>
              We believe in the strength of community and the importance of creating spaces where people feel welcome,
              supported, and inspired. Our programs are designed to foster connection and collaboration.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
        <div className="max-w-3xl mx-auto">
          <p className="mb-6">
            We take a holistic approach to our mission, operating at the intersection of education, fashion, and social
            impact:
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold">Skill-Building Workshops</h3>
                <p className="text-muted-foreground">
                  We offer a range of workshops that teach practical skills in sewing, pattern-making, sustainable
                  design, and more. These workshops are designed for all skill levels and are taught by experienced
                  professionals.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold">Custom Design Services</h3>
                <p className="text-muted-foreground">
                  Our custom design services provide opportunities for emerging designers to gain practical experience
                  while offering clients unique, sustainably-made garments that reflect their personal style.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-lavender font-bold text-xl mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold">Community Programs</h3>
                <p className="text-muted-foreground">
                  We partner with local organizations to bring our educational programs to underserved communities,
                  providing access to creative skills and potential career pathways in the fashion industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          There are many ways to support our work and become part of our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
          >
            <Link href="/workshops">Join a Workshop</Link>
          </Button>
          <Button
            asChild
            className="bg-luxury-charcoal hover:text-luxury-gold text-luxury-lavender transition-colors duration-300"
          >
            <Link href="/non-profit/donate">Support Our Work</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-luxury-charcoal text-luxury-charcoal hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300"
          >
            <Link href="/non-profit/volunteer">Volunteer With Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

