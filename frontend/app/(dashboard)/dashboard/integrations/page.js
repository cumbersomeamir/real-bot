import { generateMetadata } from '@/lib/seo';
import IntegrationsLive from './components/IntegrationsLive';

export const metadata = generateMetadata({
  title: 'Integrations',
  description: 'Connection status and setup information for supported integrations.',
  path: '/dashboard/integrations'
});

export default function DashboardIntegrationsPage() {
  return (
    <div className="space-y-4">
      <h1>Integrations</h1>
      <IntegrationsLive />
    </div>
  );
}
