export const APP_NAME = 'DealFlow AI';
export const CURRENCY = 'INR';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5001';

export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Leads', href: '/leads' },
  { label: 'AI Agents', href: '/ai-agents' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Projects', href: '/projects' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Automation', href: '/automation' },
  { label: 'Communications', href: '/communications' },
  { label: 'Future', href: '/future' },
  { label: 'Integrations', href: '/dashboard/integrations' },
  { label: 'Settings', href: '/settings' }
];

export const LEAD_STATUS = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'HOT',
  'WARM',
  'COLD',
  'SITE_VISIT_SCHEDULED',
  'SITE_VISIT_DONE',
  'NEGOTIATION',
  'BOOKED',
  'CLOSED_WON',
  'CLOSED_LOST',
  'DEAD'
];
