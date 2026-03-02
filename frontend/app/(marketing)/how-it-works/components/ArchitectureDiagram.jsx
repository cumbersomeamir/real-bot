export default function ArchitectureDiagram() {
  return (
    <div className="surface-card p-6">
      <h3>Architecture</h3>
      <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-surface-secondary p-4 text-xs text-slate-300">
{`[Lead Sources] -> [Intake Engine] -> [Dedup + Validate] -> [AI Qualification] -> [Scoring] -> [Rule Engine] -> [Broker Assignment / Auto Follow-Up] -> [Communication Engine] -> [Dashboard Analytics]`}
      </pre>
    </div>
  );
}
