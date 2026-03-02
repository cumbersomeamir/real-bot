import Link from 'next/link';
import { generateMetadata } from '@/lib/seo';

const futureFeatures = [
  { slug: 'ai-chat-assistant', title: 'AI Chat Assistant' },
  { slug: 'webhook-builder', title: 'Webhook Builder' },
  { slug: 'report-builder', title: 'Custom Report Builder' },
  { slug: 'multilanguage', title: 'Multi-Language Support' },
  { slug: 'mobile-shell', title: 'Mobile App Shell' },
  { slug: 'channel-partner-portal', title: 'Channel Partner Portal' },
  { slug: 'client-portal', title: 'Client-Facing Portal' },
  { slug: 'ai-price-optimization', title: 'AI Price Optimization' },
  { slug: 'demand-heatmap', title: 'Predictive Demand Heatmap' },
  { slug: 'ad-optimizer', title: 'Dynamic Ad Campaign Optimizer' },
  { slug: 'sell-through-predictor', title: 'Inventory Sell-Through Predictor' },
  { slug: 'document-generation', title: 'Document Generation' },
  { slug: 'payment-tracking', title: 'Payment Tracking' },
  { slug: 'chatbot-builder', title: 'WhatsApp Chatbot Builder' },
  { slug: 'api-marketplace', title: 'API Marketplace' }
];

export const metadata = generateMetadata({
  title: 'Future Capabilities',
  description: 'Preview upcoming DealFlow AI capabilities.',
  path: '/future'
});

export default function FutureIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Future Capabilities</h1>
        <p className="mt-2 text-sm text-slate-400">Roadmap modules with API stubs ready for implementation.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {futureFeatures.map((feature) => (
          <Link
            key={feature.slug}
            href={`/future/${feature.slug}`}
            className="rounded-lg border border-border bg-surface-card p-4 transition hover:bg-surface-hover"
          >
            <h4>{feature.title}</h4>
            <p className="mt-1 text-xs text-slate-400">Open capability stub</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
