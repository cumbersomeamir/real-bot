'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Sidebar({ collapsed = false }) {
  const pathname = usePathname();

  return (
    <aside className={cn('h-full border-r border-border bg-surface-secondary p-3', collapsed ? 'w-20' : 'w-64')}>
      <div className="mb-6 px-2 py-3 font-display text-lg font-semibold text-accent-300">
        {collapsed ? 'DF' : 'DealFlow AI'}
      </div>
      <nav className="space-y-1">
        {DASHBOARD_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm transition',
                active ? 'bg-primary-800 text-white' : 'text-slate-300 hover:bg-surface-hover'
              )}
            >
              {collapsed ? item.label.charAt(0) : item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
