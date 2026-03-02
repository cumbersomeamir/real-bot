import { moduleCards } from '@/lib/mockData';

export default function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {moduleCards.map((module) => (
        <article key={module.title} className="surface-card p-5">
          <h4>{module.title}</h4>
          <ul className="mt-3 space-y-1 text-sm text-slate-300">
            {module.points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
