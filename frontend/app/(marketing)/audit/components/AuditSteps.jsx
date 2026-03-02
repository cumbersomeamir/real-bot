const steps = [
  'Connect your last 3 months of lead exports securely.',
  'Analyze response times, follow-up gaps, and source leakage.',
  'Map campaign spend to closure outcomes and funnel drop-offs.',
  'Deliver your leakage score and recovery playbook within 48 hours.'
];

export default function AuditSteps() {
  return (
    <div className="surface-card p-6">
      <h3>How the audit works</h3>
      <ol className="mt-4 space-y-2 text-sm text-slate-300">
        {steps.map((step, idx) => (
          <li key={step}>{idx + 1}. {step}</li>
        ))}
      </ol>
    </div>
  );
}
