'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Card } from '@/components/ui';
import { formatINR } from '@/lib/formatters';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function AnalyticsLive() {
  const { user } = useAuth();
  const { data: overview, mutate: mutateOverview } = useSWR('/analytics/overview', fetcher);
  const { data: campaigns, mutate: mutateCampaigns } = useSWR('/analytics/campaigns', fetcher);
  const { data: sources, mutate: mutateSources } = useSWR('/analytics/sources', fetcher);
  const { data: forecast, mutate: mutateForecast } = useSWR('/analytics/forecast', fetcher);

  useRealtime({
    orgId: user?.organizationId,
    userId: user?.id,
    onEvent: (eventName) => {
      if (eventName.startsWith('lead:') || eventName === 'kpi:update') {
        mutateOverview();
        mutateCampaigns();
        mutateSources();
        mutateForecast();
      }
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h4 className="text-lg">Revenue Overview</h4>
        <p className="mt-2 text-sm text-slate-400">Pipeline: {formatINR(overview?.pipelineForecast || 0)}</p>
        <p className="text-sm text-slate-400">Leakage: {overview?.leakagePct || 0}%</p>
      </Card>
      <Card>
        <h4 className="text-lg">Forecast</h4>
        <p className="mt-2 text-sm text-slate-400">Projected: {formatINR(forecast?.projection || 0)}</p>
        <p className="text-sm text-slate-400">Confidence: {Math.round((forecast?.confidence || 0) * 100)}%</p>
      </Card>
      <Card>
        <h4 className="text-lg">Campaign ROI</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {(campaigns?.items || []).map((c) => (
            <li key={c.campaign}>{c.campaign}: ROI {c.roi}x</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h4 className="text-lg">Lead Sources</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {(sources?.items || []).map((s) => (
            <li key={s.source}>{s.source}: {s.leads} leads / {s.conversion}% conversion</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
