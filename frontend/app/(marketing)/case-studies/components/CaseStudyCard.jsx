import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export default function CaseStudyCard({ study }) {
  return (
    <Card>
      <h3 className="text-xl">{study.title}</h3>
      <p className="mt-2 text-sm text-slate-400">{study.context}</p>
      <p className="mt-2 text-sm text-slate-300">{study.results}</p>
      <div className="mt-4">
        <Link href={`/case-studies/${study.slug}`} className="text-sm text-accent-300 hover:text-accent-200">
          Read case study
        </Link>
      </div>
    </Card>
  );
}
