'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Button, Card, Input, Select } from '@/components/ui';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function CommunicationsLive() {
  const { data: templates, mutate } = useSWR('/communications/templates', fetcher);
  const { data: queue } = useSWR('/communications/queue', fetcher);
  const [form, setForm] = useState({ name: '', category: 'marketing', content: '' });

  const createTemplate = async () => {
    if (!form.name || !form.content) return;
    try {
      await api.post('/communications/templates', {
        name: form.name,
        category: form.category,
        content: form.content,
        variables: []
      });
      setForm({ name: '', category: 'marketing', content: '' });
      mutate();
      notifySuccess('Template created');
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || 'Template creation failed');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-lg">Create WhatsApp Template</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Input placeholder="Template name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Select
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            options={[{ label: 'Marketing', value: 'marketing' }, { label: 'Utility', value: 'utility' }]}
          />
          <Input placeholder="Template content" value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} />
        </div>
        <Button className="mt-3" onClick={createTemplate}>Create</Button>
      </Card>

      <Card>
        <h4 className="text-lg">Templates</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {(templates?.items || []).map((t) => (
            <li key={t.id} className="rounded border border-border p-3">{t.name} • {t.status} • {t.category}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h4 className="text-lg">Queue Snapshot</h4>
        <p className="mt-2 text-sm">Queued: {queue?.queued || 0}</p>
        <p className="text-sm">Delivered: {queue?.delivered || 0}</p>
        <p className="text-sm">Failed: {queue?.failed || 0}</p>
      </Card>
    </div>
  );
}
