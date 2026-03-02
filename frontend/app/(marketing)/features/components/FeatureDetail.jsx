import Link from 'next/link';
import { Button } from '@/components/ui';

export default function FeatureDetail({ title, description, features, ctaHref }) {
  return (
    <section className="surface-card p-6">
      <h3>{title}</h3>
      <p className="mt-3 text-slate-300">{description}</p>
      <ul className="mt-4 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
        {features.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      {ctaHref ? (
        <div className="mt-5">
          <Button asChild variant="ghost">
            <Link href={ctaHref}>See it in action</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
