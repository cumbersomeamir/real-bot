'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const chunks = pathname.split('/').filter(Boolean);

  return (
    <div className="mb-4 text-sm text-slate-400">
      <Link href="/dashboard" className="hover:text-white">
        Dashboard
      </Link>
      {chunks.map((chunk, idx) => {
        const href = `/${chunks.slice(0, idx + 1).join('/')}`;
        const title = chunk.replace(/-/g, ' ');
        return (
          <span key={href}>
            {' / '}
            <Link href={href} className="capitalize hover:text-white">
              {title}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
