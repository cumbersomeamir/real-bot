import { generateMetadata } from '@/lib/seo';
import StepFlow from './components/StepFlow';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import DemoVideo from './components/DemoVideo';
import IntegrationLogos from './components/IntegrationLogos';

export const metadata = generateMetadata({
  title: 'How It Works',
  description: 'Understand the full lead-to-revenue workflow in DealFlow AI.',
  path: '/how-it-works',
  image: '/og/how-it-works.png'
});

export default function HowItWorksPage() {
  return (
    <div className="section-wrap py-16">
      <h1>How It Works</h1>
      <p className="mt-3 text-slate-300">From lead capture to conversion intelligence in eight operational steps.</p>
      <div className="mt-8 space-y-8">
        <StepFlow />
        <ArchitectureDiagram />
        <DemoVideo />
        <IntegrationLogos />
      </div>
    </div>
  );
}
