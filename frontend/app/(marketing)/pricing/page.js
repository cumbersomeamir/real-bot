import { generateMetadata } from '@/lib/seo';
import JsonLd from '@/components/shared/JsonLd';
import PricingCards from './components/PricingCards';
import ROICalculator from './components/ROICalculator';
import PlanComparison from './components/PlanComparison';
import FAQAccordion from './components/FAQAccordion';

export const metadata = generateMetadata({
  title: 'Pricing',
  description: 'Flexible plans for developers across project stages with performance-based options.',
  path: '/pricing',
  image: '/og/pricing.png'
});

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does billing work?',
      acceptedAnswer: { '@type': 'Answer', text: 'Plans are billed monthly with annual options available.' }
    }
  ]
};

export default function PricingPage() {
  return (
    <div className="section-wrap py-16">
      <JsonLd data={faqSchema} />
      <h1>Pricing</h1>
      <p className="mt-3 text-slate-300">Choose a plan that matches your lead volume and growth targets.</p>
      <div className="mt-8 space-y-8">
        <PricingCards />
        <div className="surface-card p-6">
          <h3>Performance-Based Option</h3>
          <p className="mt-2 text-slate-300">₹1L/month base + 1% of recovered deal value. Available for Growth and Enterprise.</p>
        </div>
        <PlanComparison />
        <ROICalculator />
        <FAQAccordion />
      </div>
    </div>
  );
}
