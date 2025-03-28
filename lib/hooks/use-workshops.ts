import useSWR from 'swr';
import { Workshop } from '@/lib/db/schemas/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch workshops');
  return res.json();
};

export function useWorkshops() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Workshop[];
  }>('/api/workshops', fetcher);

  return {
    workshops: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useFeaturedWorkshops() {
  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: Workshop[];
  }>('/api/workshops/featured', fetcher);

  return {
    workshops: data?.data ?? [],
    isLoading,
    isError: error,
  };
}

export function useWorkshop(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Workshop;
  }>(id ? `/api/workshops/${id}` : null, fetcher);

  return {
    workshop: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
