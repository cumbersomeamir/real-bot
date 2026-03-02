import { generateMetadata } from '@/lib/seo';
import SettingsLive from '../components/SettingsLive';

export const metadata = generateMetadata({
  title: 'Team',
  description: 'Team page for DealFlow AI.',
  path: '/settings/team'
});


export default function TeamSettingsPage() {
  return <SettingsLive />;
}
