import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { getUserWorkshopsForCurrentUser, getAllWorkshops } from "@/app/actions/workshop-actions";
import { WorkshopsClient } from "@/components/dashboard/workshops-client";

interface WorkshopRegistration {
  id: string;
  userId: string;
  workshopId: string;
  name: string;
  email: string;
  phone?: string;
  participants: number;
  specialRequirements?: string;
  paymentStatus: string;
  registeredAt: Date;
  updatedAt?: Date;
}

interface WorkshopData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  capacity: number;
  price: string;
  category: string;
  isFeatured: boolean;
  spotsLeft: number;
  isRegistrationOpen: boolean;
  materials: any[];
  resources: any[];
  messages: any[];
  registrations: WorkshopRegistration[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserWorkshop {
  workshop: WorkshopData;
  registration?: WorkshopRegistration;
}

interface ProcessedWorkshop {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: string;
  participants: number;
  materials: boolean;
  instructor?: string;
}

interface AvailableWorkshop {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: string;
  spotsLeft: number;
  category: string;
  isFree: boolean;
}

export default async function WorkshopsPage() {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please sign in to view your workshops.</div>;
  }

  // Fetch user's workshops
  const response = await getUserWorkshopsForCurrentUser();
  let upcomingWorkshops: ProcessedWorkshop[] = [];
  let pastWorkshops: ProcessedWorkshop[] = [];

  // Process user's workshops if available
  if (response.success && response.data) {
    const now = new Date();
    const initialValue = { upcomingWorkshops: [] as ProcessedWorkshop[], pastWorkshops: [] as ProcessedWorkshop[] };
    const result = response.data.reduce<typeof initialValue>(
    (acc, item) => {
      const workshopDate = new Date(item.workshop.date);
      const workshop: ProcessedWorkshop = {
        id: item.workshop.id,
        title: item.workshop.title,
        date: format(workshopDate, "MMMM d-d, yyyy"),
        time: item.workshop.time || "TBD",
        location: item.workshop.location || "TBD",
        image: item.workshop.image || `/placeholder.svg?height=100&width=200&text=${encodeURIComponent(item.workshop.title)}`,
        status: "Registered",
        participants: 1,
        materials: Array.isArray(item.workshop.materials) && item.workshop.materials.length > 0,
        instructor: "TBD",
      };
      
      // Update workshop fields if registration exists
      if (item.registration) {
        workshop.participants = item.registration.participants;
        workshop.status = item.registration.paymentStatus;
      }

      if (workshopDate > now) {
        acc.upcomingWorkshops.push(workshop);
      } else {
        acc.pastWorkshops.push(workshop);
      }

      return acc;
    },
    initialValue
  );
    upcomingWorkshops = result.upcomingWorkshops;
    pastWorkshops = result.pastWorkshops;
  }

  // Get all available workshops
  const workshopsResponse = await getAllWorkshops();
  let availableWorkshops: AvailableWorkshop[] = [];

  // Convert workshop data to AvailableWorkshop format if available
  if (workshopsResponse.success && workshopsResponse.data) {
    availableWorkshops = workshopsResponse.data.map(workshop => ({
      id: workshop.id,
      title: workshop.title,
      date: format(new Date(workshop.date), "MMMM d-d, yyyy"),
      time: workshop.time || "TBD",
      location: workshop.location || "TBD",
      image: workshop.image || `/placeholder.svg?height=100&width=200&text=${encodeURIComponent(workshop.title)}`,
      price: workshop.price || "Free",
      spotsLeft: workshop.capacity - (Array.isArray(workshop.registrations) ? workshop.registrations.length : 0),
      category: workshop.category || "All Levels",
      isFree: workshop.price === "0" || workshop.price === "Free",
    }));
  }

  return (
    <WorkshopsClient
      userWorkshops={upcomingWorkshops}
      pastWorkshops={pastWorkshops}
      availableWorkshops={availableWorkshops}
    />
  );
}

