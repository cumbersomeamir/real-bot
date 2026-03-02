import { generateMetadata } from '@/lib/seo';
import QualificationFlow from './components/QualificationFlow';
import ConversationBuilder from './components/ConversationBuilder';
import ScoringModelConfig from './components/ScoringModelConfig';
import AgentLogs from './components/AgentLogs';

export const metadata = generateMetadata({
  title: 'Qualification',
  description: 'Qualification page for DealFlow AI.',
  path: '/ai-agents/qualification'
});


export default function QualificationAgentPage() {
  return (
    <div className="space-y-4">
      <h1>Qualification Agent</h1>
      <div className="grid gap-4 xl:grid-cols-2">
        <QualificationFlow />
        <ConversationBuilder />
        <ScoringModelConfig />
        <AgentLogs />
      </div>
    </div>
  );
}
