import { generateMetadata } from '@/lib/seo';
import AnalyticsLive from './components/AnalyticsLive';

export const metadata = generateMetadata({
  title: 'Analytics',
  description: 'Revenue intelligence, campaign ROI, source analysis, and forecasting.',
  path: '/analytics'
});

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1>Analytics</h1>
      <AnalyticsLive />
    </div>
  );
}
