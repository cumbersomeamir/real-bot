import { generateMetadata } from '@/lib/seo';
import AuditForm from './components/AuditForm';
import LeakageCalculator from './components/LeakageCalculator';
import AuditSteps from './components/AuditSteps';
import SocialProof from './components/SocialProof';

export const metadata = generateMetadata({
  title: 'Free Revenue Leakage Audit',
  description: 'Get a free 48-hour audit to uncover lost real estate revenue and lead leakage.',
  path: '/audit',
  image: '/og/audit.png'
});

export default function AuditPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Free Revenue Leakage Audit For Real Estate Developers</h1>
      <p className="mt-3 max-w-3xl text-slate-300">We analyze your last 3 months of lead data and show exactly how much revenue is leaking from your pipeline.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AuditForm />
        <div className="space-y-6">
          <AuditSteps />
          <SocialProof />
        </div>
      </div>
      <div className="mt-8">
        <LeakageCalculator />
      </div>
    </div>
  );
}
