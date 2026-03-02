import { generateMetadata } from '@/lib/seo';
import AutomationLive from './components/AutomationLive';

export const metadata = generateMetadata({
  title: 'Automation',
  description: 'Create and monitor rule engine automations.',
  path: '/automation'
});

export default function AutomationPage() {
  return (
    <div className="space-y-4">
      <h1>Automation Rules</h1>
      <AutomationLive />
    </div>
  );
}
