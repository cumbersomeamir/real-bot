import { generateMetadata } from '@/lib/seo';
import AIAgentsLive from './components/AIAgentsLive';

export const metadata = generateMetadata({
  title: 'AI Agents',
  description: 'Manage autonomous qualification, follow-up, scoring, voice, and analytics agents.',
  path: '/ai-agents'
});

export default function AIAgentsPage() {
  return (
    <div className="space-y-4">
      <h1>AI Agents</h1>
      <AIAgentsLive />
    </div>
  );
}
