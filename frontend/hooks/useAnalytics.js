'use client';

import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export function useAnalytics(endpoint = '/analytics/overview') {
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return { data, error, isLoading };
}
