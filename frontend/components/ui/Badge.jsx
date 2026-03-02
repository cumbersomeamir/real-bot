import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-primary-800 text-primary-100',
  success: 'bg-emerald-900/40 text-emerald-300',
  warning: 'bg-amber-900/40 text-amber-300',
  danger: 'bg-red-900/40 text-red-300'
};

export default function Badge({ className, variant = 'default', children }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
