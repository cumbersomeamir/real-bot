export default function IntegrationCard({ item }) {
  return (
    <article className="surface-card p-5">
      <h4>{item.name}</h4>
      <p className="mt-2 text-sm text-slate-400">{item.description}</p>
      <p className="mt-3 text-xs text-slate-500">Type: {item.type} • Setup: {item.setupTime}</p>
      <a href="#" className="mt-3 inline-block text-sm text-accent-300">
        Documentation
      </a>
    </article>
  );
}
