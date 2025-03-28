export interface Workshop {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registrations: number
  price: string
  spotsLeft: number
  category: string
  isFeatured: boolean
  image: string
}

export interface WorkshopRegistration {
  id: string
  workshopId: string
  userId: string
  participants: number
  status: string
  specialRequirements?: string
  paymentStatus: string
  createdAt: Date
  updatedAt: Date
}

export interface CustomDesign {
  id: string
  userId: string
  title: string
  description: string
  requirements: {
    style: string
    dimensions: string
    colors: string[]
    additionalNotes?: string
  }
  budget?: number
  timeline?: string
  status: string
  designerId?: string
  attachments?: string[]
  feedback?: Array<{
    message: string
    rating?: number
    timestamp: string
  }>
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
  profileImage?: string
  phoneNumber?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  preferences: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
