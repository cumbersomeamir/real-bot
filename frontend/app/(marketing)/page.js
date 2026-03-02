import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateMetadata } from '@/lib/seo';
import { Button, Card, Tabs } from '@/components/ui';
import { moduleCards } from '@/lib/mockData';
import ROICalculator from './pricing/components/ROICalculator';
import IntegrationLogos from './how-it-works/components/IntegrationLogos';
import TestimonialBlock from './case-studies/components/TestimonialBlock';
import ParticleField from '@/components/three/ParticleField';

const StatsCounter = dynamic(() => import('./about/components/StatsCounter'));

export const metadata = generateMetadata({
  title: 'Real Estate Revenue Recovery Engine',
  description:
    'DealFlow AI recovers 15-30% of lost property deals through AI qualification, follow-up automation, and broker accountability.',
  path: '/',
  image: '/og/home.png',
  keywords: ['real estate lead management india', 'ai qualification', 'revenue leakage audit']
});

const kpis = [
  '87% reduction in lead response time',
  '3.2x increase in site visit bookings',
  '23% increase in deal closures',
  '₹47Cr+ in recovered revenue'
];

const problems = [
  {
    title: 'You spend ₹5–50L/month on ads',
    detail: '40–70% leads never get a proper follow-up'
  },
  {
    title: 'Brokers cherry-pick easy leads',
    detail: 'High-intent buyers fall through cracks'
  },
  {
    title: 'No structured pipeline',
    detail: 'Zero visibility on what is closing and why'
  }
];

const steps = [
  ['Capture Every Lead', 'All sources, zero leakage'],
  ['AI Qualifies Instantly', 'Budget, timeline, intent scored in <2 minutes'],
  ['Automated Follow-Up', '30-day personalized cadence across channels'],
  ['Broker Accountability', 'Forced SLAs, auto-reassignment, performance tracking']
];

const agents = [
  ['Qualification Agent', 'Engages every lead within 120 seconds via WhatsApp'],
  ['Follow-Up Agent', 'Runs 30-day personalized nurture sequences'],
  ['Reactivation Agent', 'Revives dead leads when new inventory matches'],
  ['Voice Agent', 'AI-powered calls for high-intent leads'],
  ['Analytics Agent', 'Detects anomalies, predicts closures, suggests actions']
];

export default function MarketingHomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--gradient-hero)] py-20">
        <ParticleField />
        <div className="section-wrap relative z-10">
          <p className="inline-flex rounded-full border border-accent-500/40 px-3 py-1 text-xs text-accent-300">Trusted by 50+ developers across Mumbai, Pune, Bangalore, Delhi NCR</p>
          <h1 className="mt-6 max-w-4xl">Real Estate Developers Are Losing ₹2–5 Crore/Year In Leaked Deals.</h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-300">DealFlow AI recovers 15–30% of your lost property deals from existing leads in 60 days. Performance-based.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/audit" className="inline-flex h-12 items-center rounded-md bg-accent-500 px-6 text-base font-medium text-slate-950 hover:bg-accent-400">
              Book Free Revenue Leakage Audit
            </Link>
            <Link href="/how-it-works" className="inline-flex h-12 items-center rounded-md border border-border px-6 text-base text-slate-200 hover:bg-surface-hover">
              See How It Works
            </Link>
          </div>
          <div className="mt-8 inline-flex rounded-xl border border-border bg-surface-card px-4 py-3">
            <p className="data-number text-accent-300">₹47Cr+ Revenue Recovered</p>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(to_right,rgba(42,58,82,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(42,58,82,0.25)_1px,transparent_1px)] bg-[size:60px_60px] py-16">
        <div className="section-wrap">
          <h2>The ₹50 Lakh Problem Nobody Talks About</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {problems.map((problem) => (
              <Card key={problem.title} className="transition hover:-translate-y-1">
                <h4 className="text-lg">{problem.title}</h4>
                <p className="mt-2 text-slate-300">{problem.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <h2>From Ad Spend to Closed Deals — Fully Automated</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {steps.map(([title, detail], idx) => (
              <Card key={title}>
                <p className="text-sm text-accent-300">Step {idx + 1}</p>
                <h4 className="mt-1 text-lg">{title}</h4>
                <p className="mt-2 text-slate-300">{detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <h2>See Everything. Miss Nothing.</h2>
          <p className="mt-3 text-slate-300">Cost per lead, source ROI, broker leaderboard, and forecast in one live view.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {['Cost/Lead', 'Cost/Visit', 'Cost/Deal', 'Pipeline Forecast'].map((metric) => (
              <Card key={metric}>
                <p className="text-sm text-slate-400">{metric}</p>
                <p className="data-number mt-2 text-2xl text-accent-300">₹{Math.floor(Math.random() * 90 + 10)}K</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <h2>Your Always-On Sales Intelligence Team</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map(([title, detail]) => (
              <Card key={title} className="animate-glow-pulse">
                <h4 className="text-lg">{title}</h4>
                <p className="mt-2 text-slate-300">{detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <h2>The Numbers Don’t Lie</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((item) => (
              <Card key={item}>
                <p className="data-number text-lg text-accent-300">{item}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <StatsCounter />
          </div>
          <div className="mt-8">
            <TestimonialBlock />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <h2>Seven Modules. One Revenue Engine.</h2>
          <div className="mt-8">
            <Tabs
              items={moduleCards.map((module) => ({
                value: module.title.toLowerCase().replace(/\s+/g, '-'),
                label: module.title,
                content: (
                  <ul className="space-y-2 text-sm text-slate-300">
                    {module.points.map((point) => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>
                )
              }))}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <ROICalculator />
        </div>
      </section>

      <section className="py-16">
        <div className="section-wrap">
          <h2>Plugs Into Your Existing Stack</h2>
          <div className="mt-6">
            <IntegrationLogos />
          </div>
        </div>
      </section>

      <section className="bg-[var(--gradient-hero)] py-16">
        <div className="section-wrap text-center">
          <h2>Stop Bleeding Deals. Start Recovering Revenue.</h2>
          <p className="mt-3 text-slate-300">Free audit. No commitment. See your leakage in 48 hours.</p>
          <Link href="/audit" className="mt-6 inline-flex h-12 items-center rounded-md bg-accent-500 px-6 text-base font-medium text-slate-950 hover:bg-accent-400">
            Book Free Revenue Leakage Audit
          </Link>
        </div>
      </section>
    </div>
  );
}
