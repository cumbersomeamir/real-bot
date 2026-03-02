'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Leads processed', value: '1.2M+' },
  { label: 'Revenue recovered', value: '₹47Cr+' },
  { label: 'Developers served', value: '50+' }
];

export default function StatsCounter() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <motion.div key={stat.label} className="surface-card p-4" whileHover={{ y: -4 }}>
          <p className="data-number text-2xl font-semibold text-accent-300">{stat.value}</p>
          <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
