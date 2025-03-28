import { getUserWorkshopsForCurrentUser } from "@/app/actions/workshop-actions";
import { getUserCustomDesigns } from "@/app/actions/custom-design-actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { format } from "date-fns";

export default async function DashboardPage() {
  // Check authentication
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  // Fetch user's workshops and custom designs
  const [workshopsResponse, designsResponse] = await Promise.all([
    getUserWorkshopsForCurrentUser(),
    getUserCustomDesigns(),
  ]);

  // Prepare stats data
  const stats = [
    {
      title: "Workshop Registrations",
      value: String(workshopsResponse.success && workshopsResponse.data ? workshopsResponse.data.length : 0),
      icon: "Calendar",
      color: "bg-luxury-green text-luxury-lavender",
    },
    {
      title: "Custom Designs",
      value: String(designsResponse.success && designsResponse.data ? designsResponse.data.length : 0),
      icon: "Pencil",
      color: "bg-luxury-gold text-luxury-charcoal",
    },
    {
      title: "Account Status",
      value: "Active",
      icon: "Users",
      color: "bg-luxury-charcoal text-luxury-lavender",
    },
  ];

  // Format workshops data
  const upcomingWorkshops = (workshopsResponse.success && workshopsResponse.data)
    ? workshopsResponse.data
        .filter((item) => new Date(item.workshop.date) > new Date())
        .sort((a, b) => new Date(a.workshop.date).getTime() - new Date(b.workshop.date).getTime())
        .slice(0, 5)
        .map((item) => ({
          id: item.workshop.id,
          title: item.workshop.title,
          date: format(new Date(item.workshop.date), "MMMM d, yyyy"),
          image: item.workshop.image || `/placeholder.svg?height=100&width=200&text=${encodeURIComponent(item.workshop.title)}`,
        }))
    : [];

  // Format custom designs data
  const customDesigns = (designsResponse.success && designsResponse.data)
    ? designsResponse.data
        .slice(0, 5)
        .map((design) => ({
          id: design.id,
          name: design.title,
          date: format(new Date(design.createdAt), "MMMM d, yyyy"),
          status: design.status,
          image: `/placeholder.svg?height=50&width=50&text=${encodeURIComponent("Design")}`,
        }))
    : [];

  return <DashboardClient 
    stats={stats} 
    upcomingWorkshops={upcomingWorkshops} 
    customDesigns={customDesigns}
    firstName={user?.firstName || ""}
  />;
}
