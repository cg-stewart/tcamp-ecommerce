import useSWR from 'swr';
import { Workshop, CustomDesign } from '@/lib/db/schemas/types';
import { toast } from '@/components/ui/use-toast';

// Generic fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Failed to fetch: ${url}`);
    throw error;
  }
  return response.json();
};

/**
 * Generic hook for fetching any dashboard data with SWR
 */
export function useDashboardData<T>(url: string, options?: any) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: T[];
    message?: string;
  }>(url, fetcher, {
    refreshInterval: 60000, // Refresh every minute
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
}

/**
 * Hook for fetching user's workshops
 */
export function useUserWorkshops() {
  const { data, isLoading, isError, mutate } = useDashboardData<Workshop>('/api/dashboard/workshops');
  
  return {
    workshops: data,
    isLoading,
    isError,
    mutate,
  };
}

/**
 * Hook for fetching user's custom designs
 */
export function useUserCustomDesigns() {
  const { data, isLoading, isError, mutate } = useDashboardData<CustomDesign>('/api/dashboard/custom-designs');
  
  return {
    designs: data,
    isLoading,
    isError,
    mutate,
  };
}

/**
 * Hook for fetching a single workshop's details
 */
export function useWorkshopDetails(workshopId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Workshop;
  }>(
    workshopId ? `/api/dashboard/workshops/${workshopId}` : null,
    fetcher
  );

  return {
    workshop: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching user's billing information
 */
export function useUserBilling() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: {
      invoices: any[];
      subscriptions: any[];
      paymentMethods: any[];
    };
  }>(
    '/api/dashboard/billing',
    fetcher
  );

  return {
    billing: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching user's account information
 */
export function useUserAccount() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: {
      user: any;
      preferences: any;
    };
  }>(
    '/api/dashboard/account',
    fetcher
  );

  return {
    account: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
