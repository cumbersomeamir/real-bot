import { generateMetadata } from '@/lib/seo';
import BrokerProfile from './components/BrokerProfile';
import BrokerPerformance from './components/BrokerPerformance';
import AssignedLeads from './components/AssignedLeads';
import CallLogHistory from './components/CallLogHistory';

export const metadata = generateMetadata({
  title: 'Detail',
  description: 'Detail page for DealFlow AI.',
  path: '/brokers/[id]'
});


export default async function BrokerDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <h1>Broker {id}</h1>
      <div className="grid gap-4 xl:grid-cols-2">
        <BrokerProfile />
        <BrokerPerformance />
        <AssignedLeads />
        <CallLogHistory />
      </div>
    </div>
  );
}
