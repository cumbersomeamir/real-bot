import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for DealFlow AI in compliance with applicable Indian data handling practices.',
  path: '/privacy',
  image: '/og/privacy.png'
});

export default function PrivacyPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-slate-300">
        <p>Effective date: March 2, 2026.</p>
        <p>DealFlow AI Technologies Pvt. Ltd. ("DealFlow AI", "we", "our") provides a software platform for lead management and conversion analytics for real estate businesses in India.</p>
        <p>We collect account data, lead records, communication metadata, and platform usage events for service delivery, security, analytics, and compliance.</p>
        <p>We process data under customer instructions, implement encryption at rest/in transit, role-based access controls, audit logs, backups, and retention policies.</p>
        <p>Customers are responsible for lawful lead collection, obtaining consent for communications, and configuring Do-Not-Contact controls.</p>
        <p>We may use subprocessors for infrastructure, messaging, analytics, and support under contractual safeguards.</p>
        <p>Users may request access, correction, export, or deletion of personal data through authorized organization administrators.</p>
        <p>For security incidents, we follow internal response procedures and notify impacted customers as required by contract and law.</p>
        <p>Contact: hello@dealflow.ai for privacy requests, DPA queries, or NDA requests.</p>
      </div>
    </div>
  );
}
