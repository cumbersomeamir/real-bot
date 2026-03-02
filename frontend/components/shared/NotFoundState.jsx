import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFoundState({ title = 'Page not found', description = 'The page you requested does not exist.' }) {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <h2>{title}</h2>
      <p className="mt-3 text-slate-400">{description}</p>
      <Button asChild className="mt-6">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
