'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h2>Something went wrong</h2>
      <p className="mt-2 text-slate-400">We could not load this page right now.</p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
