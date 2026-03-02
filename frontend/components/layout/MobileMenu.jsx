'use client';

import Link from 'next/link';
import { DASHBOARD_NAV } from '@/lib/constants';

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 md:hidden" onClick={onClose}>
      <div className="h-full w-72 bg-surface-secondary p-4" onClick={(e) => e.stopPropagation()}>
        <p className="mb-4 font-display text-lg font-semibold">Menu</p>
        <nav className="space-y-2">
          {DASHBOARD_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded px-3 py-2 text-slate-300 hover:bg-surface-hover" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
