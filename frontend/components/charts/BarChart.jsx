'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

export default function BarChart({ title = 'BarChart', children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <h4 className="mb-3 text-base">{title}</h4>
        <div className="h-64">{children || <div className="h-full rounded-lg border border-dashed border-border" />}</div>
      </Card>
    </motion.div>
  );
}
