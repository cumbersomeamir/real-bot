import { generateMetadata } from '@/lib/seo';
import LeadsLive from './components/LeadsLive';

export const metadata = generateMetadata({
  title: 'Leads',
  description: 'Manage, filter, and operate on lead pipeline records.',
  path: '/leads'
});

export default function LeadsPage() {
  return (
    <div className="space-y-4">
      <h1>Leads</h1>
      <LeadsLive />
    </div>
  );
}
