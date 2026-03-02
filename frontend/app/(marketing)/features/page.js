import { generateMetadata } from '@/lib/seo';
import FeatureGrid from './components/FeatureGrid';
import FeatureDetail from './components/FeatureDetail';
import ModuleShowcase from './components/ModuleShowcase';
import ComparisonTable from './components/ComparisonTable';

export const metadata = generateMetadata({
  title: 'Features',
  description: 'Explore all seven DealFlow AI modules for lead recovery and conversion growth.',
  path: '/features',
  image: '/og/features.png',
  keywords: ['real estate CRM India', 'AI lead qualification', 'broker accountability']
});

const modules = [
  {
    title: 'Lead Intake Engine',
    description:
      'Ingest every lead source in real time with deduplication, validation, attribution, and automated routing to projects.',
    features: [
      'Real-time ingestion from Meta Ads, Google Ads, website forms, IndiaMART CSV, WhatsApp inbound, manual entry',
      'Auto deduplication with phone, email, fuzzy name matching',
      'Phone/email validation before entering pipeline',
      'Geo-tagging by phone metadata and city enrichment',
      'UTM campaign tagging + project tagging',
      'Lead source attribution for ROI tracking',
      'Zero manual sorting'
    ]
  },
  {
    title: 'AI Qualification Engine',
    description:
      'Automates first engagement and scoring so high-intent leads are prioritized immediately and consistently.',
    features: [
      'Instant WhatsApp engagement within 120 seconds',
      'Conversational qualification for budget, timeline, configuration, financing, location preference',
      'Multi-dimensional scoring (budget, urgency, engagement, pickup behavior)',
      'Auto status assignment: Hot/Warm/Cold/Dead',
      'Optional AI voice call for high scores',
      'Continuous score refresh based on interactions',
      'Configurable scoring per project'
    ]
  },
  {
    title: 'Automated Follow-Up Engine',
    description:
      'Executes a proven multi-touch nurture cadence across channels with personalization and A/B testing.',
    features: [
      'Structured Day 0/2/5/10/15/30 cadence',
      'AI-generated personalized copy',
      'Channel fallback: WhatsApp to SMS to Email to Voice',
      'Auto-stop on closed/uninterested',
      'Template A/B testing',
      'Step-level performance analytics'
    ]
  },
  {
    title: 'Broker Accountability System',
    description:
      'Creates SLA-driven execution with transparent performance and anti-hoarding controls.',
    features: [
      'Call log + duration tracking',
      'Follow-up timestamp monitoring',
      'Response time SLA (<5 min)',
      'Conversion dashboard by broker',
      'Lead hoarding detection',
      'Auto-reassignment for inactivity',
      'Leaderboard + weekly reports'
    ]
  },
  {
    title: 'Reactivation Engine',
    description:
      'Turns dormant databases into active pipeline through re-scoring, matching, and re-engagement.',
    features: [
      'Upload old CSV/CRM exports',
      'Auto cleaning and validation',
      'Re-score with current inventory',
      'AI-triggered reactivation sequences',
      'Cross-project matching',
      'Revival conversion tracking'
    ]
  },
  {
    title: 'Revenue Intelligence Dashboard',
    description:
      'Unifies acquisition, conversion, and sales execution metrics into one decision layer.',
    features: [
      'Lead quality KPIs and qualification ratio',
      'Response and follow-up performance',
      'Cost per lead/visit/deal',
      'Campaign revenue attribution',
      'Broker comparison',
      'Leakage percentage and forecast'
    ]
  },
  {
    title: 'Admin & Compliance Layer',
    description:
      'Governs access, integration security, auditability, and operational integrity at organization level.',
    features: [
      'Role-based access controls',
      'Project + inventory management',
      'Price change trigger automations',
      'API key + integration controls',
      'WhatsApp template approvals',
      'Comprehensive audit logs and encryption'
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Platform Features</h1>
      <p className="mt-4 max-w-3xl text-slate-300">Seven tightly integrated modules designed for real estate revenue recovery.</p>
      <div className="mt-10 space-y-8">
        <FeatureGrid />
        {modules.map((module) => (
          <FeatureDetail
            key={module.title}
            title={module.title}
            description={module.description}
            features={module.features}
          />
        ))}
        <ComparisonTable />
        <ModuleShowcase />
      </div>
    </div>
  );
}
