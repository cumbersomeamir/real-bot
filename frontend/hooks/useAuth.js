'use client';

import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url) => api.get(url).then((res) => res.data?.data || null);

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR('/auth/me', fetcher);
  return {
    user: data,
    isLoading,
    isAuthenticated: Boolean(data),
    error,
    refresh: mutate
  };
}
