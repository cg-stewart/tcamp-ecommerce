"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardClientProps {
  stats: {
    title: string;
    value: string;
    icon: string;
    color: string;
  }[];
  upcomingWorkshops: {
    id: string;
    title: string;
    date: string;
    image: string;
  }[];
  customDesigns: {
    id: string;
    name: string;
    date: string;
    status: string;
    image: string;
  }[];
  firstName: string;
}

export function DashboardClient({ stats, upcomingWorkshops, customDesigns, firstName }: DashboardClientProps) {
  const iconMap = {
    Calendar,
    Pencil,
    Users,
  };

  return (
    <div className="space-y-6 bg-luxury-lavender w-full">
      <h1 className="text-3xl font-bold text-luxury-charcoal">
        {firstName ? `Welcome, ${firstName}!` : 'Dashboard'}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-2 border-luxury-charcoal hover:border-luxury-gold transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-luxury-charcoal">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-luxury-gold">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-luxury-lavender">
            <CardHeader>
              <CardTitle className="text-luxury-charcoal">
                Upcoming Workshops
              </CardTitle>
              <CardDescription className="text-luxury-charcoal/70">
                Your registered workshops for the next 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingWorkshops.length > 0 ? (
                upcomingWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="flex items-center space-x-4 mb-4"
                  >
                    <Image
                      src={workshop.image}
                      alt={workshop.title}
                      width={100}
                      height={50}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-luxury-charcoal">
                        {workshop.title}
                      </h3>
                      <p className="text-sm text-luxury-charcoal/60">
                        {workshop.date}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-luxury-charcoal/70">No upcoming workshops.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
              >
                <Link href="/dashboard/workshops">View All Workshops</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-luxury-lavender">
            <CardHeader>
              <CardTitle className="text-luxury-charcoal">
                Custom Designs
              </CardTitle>
              <CardDescription className="text-luxury-charcoal/70">
                Your design projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customDesigns.length > 0 ? (
                customDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="flex items-center space-x-4 mb-4"
                  >
                    <Image
                      src={design.image}
                      alt={design.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-luxury-charcoal">
                        {design.name}
                      </h3>
                      <p className="text-sm text-luxury-charcoal/60">
                        {design.date}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          design.status === "In Progress"
                            ? "bg-luxury-gold/20 text-luxury-gold"
                            : "bg-luxury-green/20 text-luxury-green"
                        }`}
                      >
                        {design.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-luxury-charcoal/70">No custom designs yet.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-lavender"
              >
                <Link href="/dashboard/custom-designs">View All Designs</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
