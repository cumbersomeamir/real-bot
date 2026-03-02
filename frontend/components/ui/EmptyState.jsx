import { Button } from '@/components/ui';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="surface-card p-8 text-center">
      <h4>{title}</h4>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      {actionLabel ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
