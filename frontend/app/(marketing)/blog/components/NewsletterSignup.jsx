'use client';

import { Input, Button } from '@/components/ui';

export default function NewsletterSignup() {
  return (
    <div className="surface-card p-6">
      <h3>Newsletter</h3>
      <p className="mt-2 text-sm text-slate-400">Get monthly playbooks on lead conversion and proptech automation.</p>
      <div className="mt-4 flex gap-2">
        <Input placeholder="Work email" type="email" />
        <Button>Subscribe</Button>
      </div>
    </div>
  );
}
