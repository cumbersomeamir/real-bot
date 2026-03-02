'use client';

import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export function useLeads(params = '') {
  const { data, error, isLoading, mutate } = useSWR(`/leads${params}`, fetcher);
  return {
    leads: data?.items || [],
    meta: data?.meta,
    error,
    isLoading,
    refresh: mutate
  };
}
