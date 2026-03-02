'use client';

import { Card } from '@/components/ui';

const integrations = [
  ['Meta Ads', 'Connected via webhook', '5 min setup'],
  ['Google Ads', 'Connected via webhook', '5 min setup'],
  ['WhatsApp Business', 'Template + webhook mode', '15 min setup'],
  ['Twilio', 'SMS/Voice channel', '10 min setup'],
  ['IndiaMART', 'CSV + webhook ingest', '10 min setup'],
  ['Zapier', 'API token mode', '8 min setup'],
  ['n8n', 'Webhook trigger mode', '12 min setup']
];

export default function IntegrationsLive() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {integrations.map(([name, desc, setup]) => (
        <Card key={name}>
          <h4 className="text-lg">{name}</h4>
          <p className="mt-1 text-sm text-slate-400">{desc}</p>
          <p className="mt-2 text-xs text-slate-500">{setup}</p>
        </Card>
      ))}
    </div>
  );
}
