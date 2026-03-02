import { cn } from '@/lib/utils';

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-border bg-surface-card px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40',
        className
      )}
      {...props}
    />
  );
}
