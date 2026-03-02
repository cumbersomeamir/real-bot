import { generateMetadata } from '@/lib/seo';
import MissionBlock from './components/MissionBlock';
import TeamSection from './components/TeamSection';
import StatsCounter from './components/StatsCounter';
import Timeline from './components/Timeline';

export const metadata = generateMetadata({
  title: 'About',
  description: 'Meet the team behind DealFlow AI and our mission to recover revenue for real estate developers.',
  path: '/about',
  image: '/og/about.png'
});

export default function AboutPage() {
  return (
    <div className="section-wrap py-16">
      <h1>About DealFlow AI</h1>
      <p className="mt-4 max-w-3xl text-slate-300">Founded by real estate and AI veterans who saw leakage problems firsthand, DealFlow AI is purpose-built for Indian developers.</p>
      <div className="mt-10 space-y-10">
        <MissionBlock />
        <StatsCounter />
        <TeamSection />
        <Timeline />
      </div>
    </div>
  );
}
