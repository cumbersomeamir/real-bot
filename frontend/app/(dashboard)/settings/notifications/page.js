import { generateMetadata } from '@/lib/seo';
import SettingsLive from '../components/SettingsLive';

export const metadata = generateMetadata({
  title: 'Notifications',
  description: 'Notifications page for DealFlow AI.',
  path: '/settings/notifications'
});


export default function NotificationSettingsPage() {
  return <SettingsLive />;
}
