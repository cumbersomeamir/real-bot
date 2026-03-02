import { generateMetadata } from '@/lib/seo';
import VoiceAgentConfig from './components/VoiceAgentConfig';
import CallScripts from './components/CallScripts';
import VoiceAnalytics from './components/VoiceAnalytics';
import CallRecordings from './components/CallRecordings';

export const metadata = generateMetadata({
  title: 'Voice',
  description: 'Voice page for DealFlow AI.',
  path: '/ai-agents/voice'
});


export default function VoiceAgentPage() {
  return (
    <div className="space-y-4">
      <h1>Voice Agent</h1>
      <div className="grid gap-4 xl:grid-cols-2">
        <VoiceAgentConfig />
        <CallScripts />
        <VoiceAnalytics />
        <CallRecordings />
      </div>
    </div>
  );
}
