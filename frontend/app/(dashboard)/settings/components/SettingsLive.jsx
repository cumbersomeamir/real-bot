'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Button, Card, Input, Select, Table } from '@/components/ui';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function SettingsLive() {
  const { data: team, mutate: mutateTeam } = useSWR('/team', fetcher);
  const { data: settings, mutate: mutateSettings } = useSWR('/settings', fetcher);
  const { data: audits } = useSWR('/audit-logs', fetcher);
  const [inviteEmail, setInviteEmail] = useState('');
  const [timezone, setTimezone] = useState(settings?.timezone || 'Asia/Kolkata');

  const invite = async () => {
    if (!inviteEmail) return;
    try {
      await api.post('/team/invite', { email: inviteEmail });
      setInviteEmail('');
      notifySuccess('Invite sent');
    } catch {
      notifyError('Invite failed');
    }
  };

  const saveSettings = async () => {
    try {
      await api.put('/settings', { ...settings, timezone });
      mutateSettings();
      notifySuccess('Settings updated');
    } catch {
      notifyError('Settings update failed');
    }
  };

  const changeRole = async (id, role) => {
    await api.put(`/team/${id}/role`, { role });
    mutateTeam();
  };

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-lg">Team</h4>
        <div className="mt-3 flex gap-2">
          <Input placeholder="Invite email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <Button onClick={invite}>Invite</Button>
        </div>
        <div className="mt-3">
          <Table
            headers={['Name', 'Email', 'Role', 'Change Role']}
            rows={(team?.items || []).map((u) => [
              u.name,
              u.email,
              u.role,
              <select
                key={u.id}
                className="rounded border border-border bg-surface-card px-2 py-1 text-xs"
                value={u.role}
                onChange={(e) => changeRole(u.id, e.target.value)}
              >
                {['OWNER', 'SALES_DIRECTOR', 'SALES_MANAGER', 'BROKER'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            ])}
          />
        </div>
      </Card>

      <Card>
        <h4 className="text-lg">Org Settings</h4>
        <div className="mt-3 flex gap-2">
          <Select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={[{ label: 'Asia/Kolkata', value: 'Asia/Kolkata' }, { label: 'Asia/Dubai', value: 'Asia/Dubai' }]}
          />
          <Button onClick={saveSettings}>Save</Button>
        </div>
      </Card>

      <Card>
        <h4 className="text-lg">Recent Audit Logs</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {(audits?.items || []).slice(0, 10).map((log) => (
            <li key={log.id} className="rounded border border-border p-3">{log.action} • {new Date(log.createdAt).toLocaleString('en-IN')}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
