import { generateMetadata as seoMetadata } from '@/lib/seo';

const featureMap = {
  'ai-chat-assistant': 'AI Chat Assistant',
  'webhook-builder': 'Webhook Builder',
  'report-builder': 'Custom Report Builder',
  multilanguage: 'Multi-Language Support',
  'mobile-shell': 'Mobile App Shell',
  'channel-partner-portal': 'Channel Partner Portal',
  'client-portal': 'Client-Facing Portal',
  'ai-price-optimization': 'AI Price Optimization',
  'demand-heatmap': 'Predictive Demand Heatmap',
  'ad-optimizer': 'Dynamic Ad Campaign Optimizer',
  'sell-through-predictor': 'Inventory Sell-Through Predictor',
  'document-generation': 'Document Generation',
  'payment-tracking': 'Payment Tracking',
  'chatbot-builder': 'WhatsApp Chatbot Builder',
  'api-marketplace': 'API Marketplace'
};

export async function generateMetadata({ params }) {
  const { feature } = await params;
  return seoMetadata({
    title: featureMap[feature] || 'Future Capability',
    description: 'Coming-soon capability stub for DealFlow AI.',
    path: `/future/${feature}`
  });
}

export default async function FutureCapabilityPage({ params }) {
  const { feature } = await params;
  const title = featureMap[feature] || 'Future Capability';

  return (
    <div className="space-y-4">
      <h1>{title}</h1>
      <div className="rounded-xl border border-border bg-surface-card p-6">
        <p className="text-sm text-slate-300">
          This capability is scaffolded. API stub is available at{' '}
          <code className="rounded bg-black/30 px-1 py-0.5">/api/future/{feature}</code>.
        </p>
        <p className="mt-2 text-sm text-slate-400">Current API response: 501 Not Implemented (as expected for roadmap features).</p>
      </div>
    </div>
  );
}
