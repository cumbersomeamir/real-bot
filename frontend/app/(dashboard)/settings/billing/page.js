import { generateMetadata } from '@/lib/seo';
import SettingsLive from '../components/SettingsLive';

export const metadata = generateMetadata({
  title: 'Billing',
  description: 'Billing page for DealFlow AI.',
  path: '/settings/billing'
});


export default function BillingSettingsPage() {
  return <SettingsLive />;
}
