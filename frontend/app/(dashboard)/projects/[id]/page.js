import { generateMetadata } from '@/lib/seo';
import ProjectOverview from './components/ProjectOverview';
import InventoryGrid from './components/InventoryGrid';
import PriceHistory from './components/PriceHistory';
import ProjectLeads from './components/ProjectLeads';
import ProjectAnalytics from './components/ProjectAnalytics';

export const metadata = generateMetadata({
  title: 'Detail',
  description: 'Detail page for DealFlow AI.',
  path: '/projects/[id]'
});


export default async function ProjectDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <h1>Project {id}</h1>
      <div className="grid gap-4 xl:grid-cols-2">
        <ProjectOverview />
        <InventoryGrid />
        <PriceHistory />
        <ProjectLeads />
        <ProjectAnalytics />
      </div>
    </div>
  );
}
