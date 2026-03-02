import { generateMetadata } from '@/lib/seo';
import { caseStudies } from '@/lib/mockData';
import CaseStudyCard from './components/CaseStudyCard';

export const metadata = generateMetadata({
  title: 'Case Studies',
  description: 'Real example scenarios of revenue recovery and process transformation.',
  path: '/case-studies',
  image: '/og/case-studies.png'
});

export default function CaseStudiesPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Case Studies</h1>
      <p className="mt-3 text-slate-300">Illustrative examples with placeholder data for implementation planning.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </div>
    </div>
  );
}
