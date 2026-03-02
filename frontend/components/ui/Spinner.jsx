import { cn } from '@/lib/utils';

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-accent-500 border-t-transparent',
        className
      )}
    />
  );
}
