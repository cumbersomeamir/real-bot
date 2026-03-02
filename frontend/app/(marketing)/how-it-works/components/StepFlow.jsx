const steps = [
  'Connect integrations in 5 minutes',
  'Configure scoring and broker routing',
  'Capture leads from all channels',
  'Qualify and score with AI',
  'Nurture through multi-channel cadence',
  'Convert with broker SLA accountability',
  'Analyze pipeline and source ROI',
  'Optimize automatically with feedback loops'
];

export default function StepFlow() {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {steps.map((step, idx) => (
        <li key={step} className="surface-card p-4">
          <p className="text-sm text-accent-300">Step {idx + 1}</p>
          <p className="mt-1 text-slate-200">{step}</p>
        </li>
      ))}
    </ol>
  );
}
