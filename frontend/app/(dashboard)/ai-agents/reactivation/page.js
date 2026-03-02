import { generateMetadata } from '@/lib/seo';
import ReactivationCampaigns from './components/ReactivationCampaigns';
import OldLeadUploader from './components/OldLeadUploader';
import RevivalMetrics from './components/RevivalMetrics';
import ReScoreConfig from './components/ReScoreConfig';

export const metadata = generateMetadata({
  title: 'Reactivation',
  description: 'Reactivation page for DealFlow AI.',
  path: '/ai-agents/reactivation'
});


export default function ReactivationAgentPage() {
  return (
    <div className="space-y-4">
      <h1>Reactivation Agent</h1>
      <div className="grid gap-4 xl:grid-cols-2">
        <ReactivationCampaigns />
        <OldLeadUploader />
        <RevivalMetrics />
        <ReScoreConfig />
      </div>
    </div>
  );
}
