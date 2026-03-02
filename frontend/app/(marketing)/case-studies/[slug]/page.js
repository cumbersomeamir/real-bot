import { notFound } from 'next/navigation';
import { generateMetadata as seoMetadata } from '@/lib/seo';
import { caseStudies } from '@/lib/mockData';
import ResultsChart from '../components/ResultsChart';
import TestimonialBlock from '../components/TestimonialBlock';

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) {
    return seoMetadata({ title: 'Case Study Not Found', description: 'Case study not found', path: '/case-studies' });
  }
  return seoMetadata({
    title: study.title,
    description: study.results,
    path: `/case-studies/${slug}`,
    image: '/og/case-study-detail.png'
  });
}

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();

  return (
    <div className="section-wrap py-16">
      <h1>{study.title}</h1>
      <p className="mt-4 text-slate-300">Example case study for demonstration and UX content staging.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
          <h3>Context</h3>
          <p className="mt-2 text-slate-300">{study.context}</p>
          <h3 className="mt-6">Problem</h3>
          <p className="mt-2 text-slate-300">{study.problem}</p>
          <h3 className="mt-6">Solution</h3>
          <p className="mt-2 text-slate-300">{study.solution}</p>
          <h3 className="mt-6">Results</h3>
          <p className="mt-2 text-slate-300">{study.results}</p>
        </section>
        <ResultsChart />
      </div>
      <div className="mt-8">
        <TestimonialBlock />
      </div>
    </div>
  );
}
