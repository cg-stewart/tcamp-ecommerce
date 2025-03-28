import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import useSWR from 'swr';
import { User } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

export function useAuth() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: User;
  }>(clerkUser ? `/api/users/${clerkUser.id}` : null, fetcher);

  return {
    user: data?.data,
    isLoading: !clerkLoaded || isLoading,
    isError: error,
    mutate,
    clerkUser,
    supabase,
  };
}
