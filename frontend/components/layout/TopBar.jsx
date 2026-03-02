'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, Input, Button } from '@/components/ui';
import { clearAuthToken } from '@/lib/authClient';

export default function TopBar({ onToggleSidebar }) {
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface-secondary px-4">
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle sidebar"
          className="rounded-md border border-border px-3 py-2 text-sm"
          onClick={onToggleSidebar}
        >
          Menu
        </button>
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input className="w-80 pl-9" placeholder="Search leads, projects, brokers..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearAuthToken();
            router.push('/login');
          }}
        >
          Logout
        </Button>
        <Avatar name="Owner User" />
      </div>
    </header>
  );
}
