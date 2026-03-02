export default function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full rounded-full bg-surface-tertiary">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-700 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
