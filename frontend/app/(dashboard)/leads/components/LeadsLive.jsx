'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Badge, Button, Card, Input, Select, Table } from '@/components/ui';
import { notifyError, notifySuccess } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function LeadsLive() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [newLead, setNewLead] = useState({ name: '', phone: '', email: '' });

  const { data, mutate, isLoading } = useSWR('/leads', fetcher);
  const leads = data?.items || [];

  useRealtime({
    orgId: user?.organizationId,
    userId: user?.id,
    onEvent: (eventName) => {
      if (eventName.startsWith('lead:')) mutate();
    }
  });

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return leads;
    return leads.filter((lead) => lead.status === statusFilter);
  }, [leads, statusFilter]);

  const createLead = async () => {
    if (!newLead.name || !newLead.phone) {
      notifyError('Name and phone are required');
      return;
    }
    try {
      await api.post('/leads', {
        ...newLead,
        source: 'MANUAL',
        organizationId: leads[0]?.organizationId,
        status: 'NEW'
      });
      setNewLead({ name: '', phone: '', email: '' });
      mutate();
      notifySuccess('Lead created');
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || 'Failed to create lead');
    }
  };

  const updateStatus = async (leadId, status) => {
    try {
      await api.put(`/leads/${leadId}`, { status });
      mutate();
    } catch (error) {
      notifyError('Failed to update status');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-lg">Quick Add Lead</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <Input placeholder="Name" value={newLead.name} onChange={(e) => setNewLead((s) => ({ ...s, name: e.target.value }))} />
          <Input placeholder="Phone" value={newLead.phone} onChange={(e) => setNewLead((s) => ({ ...s, phone: e.target.value }))} />
          <Input placeholder="Email" value={newLead.email} onChange={(e) => setNewLead((s) => ({ ...s, email: e.target.value }))} />
          <Button onClick={createLead}>Create Lead</Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-lg">Lead Table</h4>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'NEW', value: 'NEW' },
              { label: 'CONTACTED', value: 'CONTACTED' },
              { label: 'QUALIFIED', value: 'QUALIFIED' },
              { label: 'HOT', value: 'HOT' },
              { label: 'WARM', value: 'WARM' },
              { label: 'COLD', value: 'COLD' },
              { label: 'NEGOTIATION', value: 'NEGOTIATION' },
              { label: 'CLOSED_WON', value: 'CLOSED_WON' },
              { label: 'DEAD', value: 'DEAD' }
            ]}
            className="w-56"
          />
        </div>

        {isLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading leads...</p>
        ) : (
          <div className="mt-3">
            <Table
              headers={['Name', 'Phone', 'Source', 'Score', 'Status', 'Broker', 'Action']}
              rows={filtered.slice(0, 20).map((lead) => [
                lead.name,
                lead.phone,
                lead.source,
                lead.score,
                <Badge key={`${lead.id}-status`}>{lead.status}</Badge>,
                lead.assignedBrokerId || '-',
                <select
                  key={`${lead.id}-action`}
                  defaultValue={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="rounded border border-border bg-surface-card px-2 py-1 text-xs"
                >
                  {['NEW', 'CONTACTED', 'QUALIFIED', 'HOT', 'WARM', 'COLD', 'NEGOTIATION', 'CLOSED_WON', 'DEAD'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ])}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
