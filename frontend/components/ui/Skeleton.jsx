export default function Skeleton({ className = 'h-4 w-full' }) {
  return <div className={`animate-pulse rounded bg-slate-700/40 ${className}`} />;
}
