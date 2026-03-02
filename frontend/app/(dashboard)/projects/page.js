import { generateMetadata } from '@/lib/seo';
import ProjectsLive from './components/ProjectsLive';

export const metadata = generateMetadata({
  title: 'Projects',
  description: 'Project and inventory management with live data operations.',
  path: '/projects'
});

export default function ProjectsPage() {
  return (
    <div className="space-y-4">
      <h1>Projects</h1>
      <ProjectsLive />
    </div>
  );
}
