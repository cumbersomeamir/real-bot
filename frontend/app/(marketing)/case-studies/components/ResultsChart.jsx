'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { metric: 'Response Time', before: 18, after: 3 },
  { metric: 'Site Visits', before: 100, after: 147 },
  { metric: 'Closures', before: 10, after: 18 }
];

export default function ResultsChart() {
  return (
    <div className="h-72 rounded-lg border border-border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="metric" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="before" fill="#355FA5" />
          <Bar dataKey="after" fill="#F5A623" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
