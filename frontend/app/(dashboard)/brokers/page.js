import { generateMetadata } from '@/lib/seo';
import BrokersLive from './components/BrokersLive';

export const metadata = generateMetadata({
  title: 'Brokers',
  description: 'Broker management, ranking, and accountability tracking.',
  path: '/brokers'
});

export default function BrokersPage() {
  return (
    <div className="space-y-4">
      <h1>Brokers</h1>
      <BrokersLive />
    </div>
  );
}
