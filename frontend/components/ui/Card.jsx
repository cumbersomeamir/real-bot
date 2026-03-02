import { cn } from '@/lib/utils';

export default function Card({ className, children }) {
  return <div className={cn('surface-card p-5 shadow-md', className)}>{children}</div>;
}
