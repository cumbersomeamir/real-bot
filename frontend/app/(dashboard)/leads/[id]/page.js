import { generateMetadata } from '@/lib/seo';
import LeadTimeline from './components/LeadTimeline';
import ConversationLog from './components/ConversationLog';
import LeadScoreCard from './components/LeadScoreCard';
import FollowUpSchedule from './components/FollowUpSchedule';
import LeadActions from './components/LeadActions';

export const metadata = generateMetadata({
  title: 'Lead Detail',
  description: 'Lead-level timeline, communications, and score intelligence.',
  path: '/leads/[id]'
});

export default async function LeadDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <h1>Lead {id}</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <LeadTimeline />
        <ConversationLog />
        <LeadScoreCard />
        <FollowUpSchedule />
      </div>
      <LeadActions />
    </div>
  );
}
