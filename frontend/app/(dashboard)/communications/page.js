import { generateMetadata } from '@/lib/seo';
import CommunicationsLive from './components/CommunicationsLive';

export const metadata = generateMetadata({
  title: 'Communications',
  description: 'Manage templates, queue, and delivery status across channels.',
  path: '/communications'
});

export default function CommunicationsPage() {
  return (
    <div className="space-y-4">
      <h1>Communications</h1>
      <CommunicationsLive />
    </div>
  );
}
