import useSWR from 'swr';
import { Workshop, User, WorkshopRegistration, CustomDesign } from '@/lib/db/schemas/types';
import { volunteers } from '@/lib/db/schemas/volunteer.schema';
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
};

/**
 * Generic hook for fetching any admin data with SWR
 */
export function useAdminData<T>(url: string, options?: any) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: T[];
    message?: string;
  }>(url, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    ...options,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to load data",
        variant: "destructive"
      });
      if (options?.onError) options.onError(err);
    }
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
    message: data?.message
  };
};

export function useAdminWorkshops() {
  const { data, isLoading, isError, mutate } = useAdminData<Workshop>('/api/admin/workshops');

  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  
  const selectWorkshop = useCallback(async (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  }, []);

  return {
    workshops: data,
    isLoading,
    isError,
    mutate,
    selectedWorkshop,
    selectWorkshop,
  };
}

export function useAdminUsers() {
  const { data, isLoading, isError, mutate } = useAdminData<User>('/api/admin/users');
  
  return {
    users: data,
    isLoading,
    isError,
    mutate,
  };
}

// Type definition for volunteer
type Volunteer = typeof volunteers.$inferSelect;

export function useAdminVolunteers() {
  const { data, isLoading, isError, mutate } = useAdminData<Volunteer>('/api/admin/volunteers');
  
  return {
    volunteers: data,
    isLoading,
    isError,
    mutate,
  };
}

// Type definition for newsletter subscriber
type NewsletterSubscriber = {
  id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
};

export function useAdminNewsletter() {
  const { data, isLoading, isError, mutate } = useAdminData<NewsletterSubscriber>('/api/admin/newsletter');
  
  return {
    subscribers: data,
    isLoading,
    isError,
    mutate,
  };
}

/**
 * Hook for fetching workshop registrations
 */
export function useWorkshopRegistrations(workshopId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: {
      students: WorkshopRegistration[];
      waitlist: WorkshopRegistration[];
      history: WorkshopRegistration[];
    };
  }>(
    workshopId ? `/api/admin/workshops/${workshopId}/registrations` : null,
    fetcher
  );

  return {
    registrations: data?.data ?? { students: [], waitlist: [], history: [] },
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching custom designs
 */
export function useAdminCustomDesigns() {
  const { data, isLoading, isError, mutate } = useAdminData<CustomDesign>('/api/admin/custom-designs');
  
  return {
    designs: data,
    isLoading,
    isError,
    mutate,
  };
}

/**
 * Hook for analytics data
 */
export function useAdminAnalytics() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: {
      totalUsers: number;
      totalWorkshops: number;
      totalRegistrations: number;
      totalRevenue: number;
      recentSignups: any[];
      popularWorkshops: any[];
    };
  }>('/api/admin/analytics', fetcher);

  return {
    analytics: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
