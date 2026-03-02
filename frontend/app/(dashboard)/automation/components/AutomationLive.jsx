'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Button, Card, Input } from '@/components/ui';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function AutomationLive() {
  const { data, mutate } = useSWR('/rules', fetcher);
  const [name, setName] = useState('');

  const createRule = async () => {
    if (!name.trim()) return;
    try {
      await api.post('/rules', {
        name,
        description: 'Created from dashboard',
        conditions: [{ field: 'score', op: 'gte', value: 80 }],
        actions: [{ type: 'assign_broker' }]
      });
      setName('');
      mutate();
      notifySuccess('Rule created');
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || 'Failed to create rule');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-lg">Create Rule</h4>
        <div className="mt-3 flex gap-2">
          <Input placeholder="Rule name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={createRule}>Create</Button>
        </div>
      </Card>
      <Card>
        <h4 className="text-lg">Active Rules</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {(data?.items || []).map((rule) => (
            <li key={rule.id} className="rounded border border-border p-3">
              {rule.name} • priority {rule.priority} • {rule.isActive ? 'active' : 'paused'}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
