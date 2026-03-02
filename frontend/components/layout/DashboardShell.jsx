'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileMenu from '@/components/layout/MobileMenu';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { useUIStore } from '@/store/useUIStore';

export default function DashboardShell({ children }) {
  const { sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(true);
      return;
    }
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toast('Search shortcut captured (Cmd/Ctrl+K)');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar onToggleSidebar={handleToggleSidebar} />
        <div className="p-4">
          <Breadcrumbs />
          {children}
        </div>
      </div>
    </div>
  );
}
