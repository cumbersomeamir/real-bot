'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Card, Table } from '@/components/ui';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function BrokersLive() {
  const { data, isLoading } = useSWR('/brokers', fetcher);
  const { data: leaderboard } = useSWR('/brokers/leaderboard', fetcher);

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-lg">Broker Performance</h4>
        {isLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading brokers...</p>
        ) : (
          <div className="mt-3">
            <Table
              headers={['Name', 'Active Leads', 'Response Time', 'Conversion %', 'Closures']}
              rows={(data?.items || []).map((b) => [b.name, b.activeLeads, b.responseTime, b.conversionRate, b.monthClosures])}
            />
          </div>
        )}
      </Card>
      <Card>
        <h4 className="text-lg">Leaderboard</h4>
        <ol className="mt-3 space-y-2 text-sm">
          {(leaderboard?.items || []).map((item) => (
            <li key={item.rank} className="rounded border border-border p-3">#{item.rank} {item.broker} — Score {item.score}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
