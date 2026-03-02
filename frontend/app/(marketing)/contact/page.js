import { generateMetadata } from '@/lib/seo';
import ContactForm from './components/ContactForm';
import OfficeMap from './components/OfficeMap';
import CalendlyEmbed from './components/CalendlyEmbed';

export const metadata = generateMetadata({
  title: 'Contact',
  description: 'Reach the DealFlow AI team for demos, onboarding, and partnerships.',
  path: '/contact',
  image: '/og/contact.png'
});

export default function ContactPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Contact</h1>
      <p className="mt-3 text-slate-300">hello@dealflow.ai • +91-00000-00000 • Mon-Sat, 9:00 AM - 7:00 PM IST</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ContactForm />
        <div className="space-y-6">
          <CalendlyEmbed />
          <OfficeMap />
        </div>
      </div>
    </div>
  );
}
