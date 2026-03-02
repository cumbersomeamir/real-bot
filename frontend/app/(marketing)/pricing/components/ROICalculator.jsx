'use client';

import { useMemo, useState } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { formatINR } from '@/lib/formatters';

export default function ROICalculator() {
  const [adSpend, setAdSpend] = useState(1200000);
  const [leads, setLeads] = useState(900);
  const [conversionRate, setConversionRate] = useState(2.1);

  const result = useMemo(() => {
    const avgDeal = 9000000;
    const currentDeals = (leads * conversionRate) / 100;
    const potentialRecoveryRate = 0.2;
    const leakedRevenue = Math.max(0, leads * avgDeal * 0.0045 - currentDeals * avgDeal);
    const recovered = leakedRevenue * potentialRecoveryRate;
    const roi = adSpend > 0 ? ((recovered - 250000) / 250000) * 100 : 0;
    return { leakedRevenue, recovered, roi };
  }, [adSpend, leads, conversionRate]);

  return (
    <Card>
      <h3>Calculate Your Revenue Leakage</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="text-sm">
          Monthly ad spend (₹)
          <Input type="number" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} className="mt-1" />
        </label>
        <label className="text-sm">
          Total leads/month
          <Input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="mt-1" />
        </label>
        <label className="text-sm">
          Current conversion rate (%)
          <Input
            type="number"
            step="0.1"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
            className="mt-1"
          />
        </label>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Estimated leaked revenue</p>
          <p className="data-number mt-2 text-xl text-amber-300">{formatINR(result.leakedRevenue)}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Potential recovery</p>
          <p className="data-number mt-2 text-xl text-emerald-300">{formatINR(result.recovered)}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Estimated ROI</p>
          <p className="data-number mt-2 text-xl text-accent-300">{result.roi.toFixed(1)}%</p>
        </div>
      </div>
      <Button className="mt-5">Get Your Personalized Audit</Button>
    </Card>
  );
}
