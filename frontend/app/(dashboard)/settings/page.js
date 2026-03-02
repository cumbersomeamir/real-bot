import { generateMetadata } from '@/lib/seo';
import SettingsLive from './components/SettingsLive';

export const metadata = generateMetadata({
  title: 'Settings',
  description: 'Team, role, org settings, and audit visibility.',
  path: '/settings'
});

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1>Settings</h1>
      <SettingsLive />
    </div>
  );
}
