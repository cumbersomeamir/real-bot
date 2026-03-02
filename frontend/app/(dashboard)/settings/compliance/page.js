import { generateMetadata } from '@/lib/seo';
import SettingsLive from '../components/SettingsLive';

export const metadata = generateMetadata({
  title: 'Compliance',
  description: 'Compliance page for DealFlow AI.',
  path: '/settings/compliance'
});


export default function ComplianceSettingsPage() {
  return <SettingsLive />;
}
