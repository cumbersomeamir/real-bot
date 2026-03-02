'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('dealflow-cookie-consent');
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-border bg-surface-card p-4 shadow-lg md:left-auto md:max-w-md">
      <p className="text-sm text-slate-300">We use cookies for analytics and platform performance.</p>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={() => {
            localStorage.setItem('dealflow-cookie-consent', 'accepted');
            setVisible(false);
          }}
          className="w-full"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
