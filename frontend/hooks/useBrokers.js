'use client';

import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export function useBrokers() {
  const { data, error, isLoading } = useSWR('/brokers', fetcher);
  return { brokers: data?.items || [], error, isLoading };
}
