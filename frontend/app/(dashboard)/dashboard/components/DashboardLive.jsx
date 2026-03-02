'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Card, Skeleton } from '@/components/ui';
import { formatINR } from '@/lib/formatters';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function DashboardLive() {
  const { user } = useAuth();
  const { data: overview, isLoading: loadingOverview, mutate: mutateOverview } = useSWR('/analytics/overview', fetcher);
  const { data: funnel, isLoading: loadingFunnel, mutate: mutateFunnel } = useSWR('/analytics/funnel', fetcher);

  useRealtime({
    orgId: user?.organizationId,
    userId: user?.id,
    onEvent: (eventName) => {
      if (eventName.startsWith('lead:') || eventName === 'kpi:update') {
        mutateOverview();
        mutateFunnel();
      }
    }
  });

  if (loadingOverview || loadingFunnel) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const kpis = [
    ['Total Leads', overview?.totalLeads ?? 0],
    ['Hot Leads %', `${overview?.hotLeadsPct ?? 0}%`],
    ['Qualified %', `${overview?.qualifiedLeadsPct ?? 0}%`],
    ['Avg Response', overview?.avgResponseTime ?? '-'],
    ['Site Visits', overview?.siteVisits ?? 0],
    ['Cost / Lead', formatINR(overview?.costPerLead ?? 0)],
    ['Cost / Deal', formatINR(overview?.costPerDeal ?? 0)],
    ['Pipeline Forecast', formatINR(overview?.pipelineForecast ?? 0)]
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs uppercase text-slate-400">{label}</p>
            <p className="data-number mt-2 text-xl text-accent-300">{value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h4 className="text-lg">Lead Funnel</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {(funnel?.stages || []).map(([stage, count]) => (
            <div key={stage} className="rounded border border-border p-3">
              <p className="text-xs text-slate-400">{stage}</p>
              <p className="data-number mt-1 text-lg">{count}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
