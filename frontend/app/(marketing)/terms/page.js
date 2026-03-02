import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Terms of Service',
  description: 'Terms of service governing use of DealFlow AI platform.',
  path: '/terms',
  image: '/og/terms.png'
});

export default function TermsPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Terms of Service</h1>
      <div className="mt-6 space-y-4 text-slate-300">
        <p>Effective date: March 2, 2026.</p>
        <p>These Terms govern access and use of DealFlow AI by business customers. By using the service, the customer agrees to these terms.</p>
        <p>Service includes lead ingestion, qualification workflows, communication orchestration, analytics, and operational tooling.</p>
        <p>Customer is responsible for user access management, lawful data collection, and compliance with telecom, marketing, and privacy regulations.</p>
        <p>Subscription fees are billed per plan or custom contract. Overage or add-on charges apply where specified.</p>
        <p>All software, trademarks, and platform IP remain property of DealFlow AI. Customer retains ownership of its data.</p>
        <p>DealFlow AI may suspend access for security threats, legal violations, or material payment default subject to contractual notice obligations.</p>
        <p>Liability is limited to fees paid in the prior 12 months except where prohibited by law. Indirect damages are excluded.</p>
        <p>These terms are governed by laws of India with jurisdiction in Pune, Maharashtra, unless otherwise agreed in contract.</p>
      </div>
    </div>
  );
}
