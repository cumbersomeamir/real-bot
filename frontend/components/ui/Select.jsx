import { cn } from '@/lib/utils';

export default function Select({ options = [], className, ...props }) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-border bg-surface-card px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500/40',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
