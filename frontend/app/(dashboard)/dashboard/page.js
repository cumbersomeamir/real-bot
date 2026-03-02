import { generateMetadata } from '@/lib/seo';
import DashboardLive from './components/DashboardLive';

export const metadata = generateMetadata({
  title: 'Dashboard Overview',
  description: 'Primary KPI overview and operational alerts for your revenue engine.',
  path: '/dashboard'
});

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1>Dashboard Overview</h1>
      <DashboardLive />
    </div>
  );
}
