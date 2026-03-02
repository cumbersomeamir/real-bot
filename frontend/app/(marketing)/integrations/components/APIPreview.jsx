export default function APIPreview() {
  return (
    <div className="surface-card p-6">
      <h3>API Preview</h3>
      <pre className="mt-4 overflow-x-auto rounded border border-border bg-surface-secondary p-3 text-xs text-slate-300">
{`POST /api/webhooks/meta\n{\n  "lead": { "name": "Aman", "phone": "+919999999999" }\n}`}
      </pre>
    </div>
  );
}
