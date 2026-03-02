import { generateMetadata } from '@/lib/seo';
import CadenceBuilder from './components/CadenceBuilder';
import MessageTemplates from './components/MessageTemplates';
import SequenceTimeline from './components/SequenceTimeline';
import ABTestPanel from './components/ABTestPanel';

export const metadata = generateMetadata({
  title: 'Follow Up',
  description: 'Follow Up page for DealFlow AI.',
  path: '/ai-agents/follow-up'
});


export default function FollowUpAgentPage() {
  return (
    <div className="space-y-4">
      <h1>Follow-Up Agent</h1>
      <div className="grid gap-4 xl:grid-cols-2">
        <CadenceBuilder />
        <MessageTemplates />
        <SequenceTimeline />
        <ABTestPanel />
      </div>
    </div>
  );
}
