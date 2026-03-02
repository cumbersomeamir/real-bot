const milestones = [
  '2023: Company founded to solve lead leakage in Indian real estate.',
  '2024: Built qualification + follow-up AI stack with pilot partners.',
  '2025: Expanded to multi-city developer portfolios with analytics module.',
  '2026: DealFlow AI processes millions of leads with measurable revenue recovery.'
];

export default function Timeline() {
  return (
    <section>
      <h3>Timeline</h3>
      <ul className="mt-4 space-y-3">
        {milestones.map((item) => (
          <li key={item} className="surface-card p-4 text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
