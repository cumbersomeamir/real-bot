import { generateMetadata } from '@/lib/seo';
import IntegrationCard from './components/IntegrationCard';
import APIPreview from './components/APIPreview';
import WebhookDemo from './components/WebhookDemo';

export const metadata = generateMetadata({
  title: 'Integrations',
  description: 'Connect ad platforms, communication channels, and workflow tools in minutes.',
  path: '/integrations',
  image: '/og/integrations.png'
});

const integrations = [
  { name: 'Meta Ads', description: 'Lead form webhook ingestion from Facebook/Instagram campaigns.', type: 'Webhook', setupTime: '5 min' },
  { name: 'Google Ads', description: 'Campaign + lead attribution sync.', type: 'Webhook', setupTime: '5 min' },
  { name: 'WhatsApp Business', description: 'Outbound templates and inbound lead handling.', type: 'API', setupTime: '15 min' },
  { name: 'IndiaMART', description: 'CSV ingestion and source normalization.', type: 'CSV', setupTime: '10 min' },
  { name: 'Twilio', description: 'SMS and voice channels.', type: 'Native', setupTime: '10 min' },
  { name: 'Zapier', description: 'No-code automation connector.', type: 'API', setupTime: '8 min' },
  { name: 'n8n', description: 'Self-hosted workflow orchestration.', type: 'Webhook', setupTime: '12 min' },
  { name: 'PostgreSQL', description: 'Data warehouse sync.', type: 'Native', setupTime: '20 min' },
  { name: 'AWS', description: 'Cloud deployment and logging stack.', type: 'API', setupTime: '20 min' }
];

export default function IntegrationsPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Integrations</h1>
      <p className="mt-3 text-slate-300">Plug DealFlow AI into your current stack without disrupting operations.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <IntegrationCard key={item.name} item={item} />
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <APIPreview />
        <WebhookDemo />
      </div>
    </div>
  );
}
