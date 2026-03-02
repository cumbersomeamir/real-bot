'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Button, Card, Input, Select, Table } from '@/components/ui';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function ProjectsLive() {
  const { data, mutate, isLoading } = useSWR('/projects', fetcher);
  const [form, setForm] = useState({ name: '', city: 'Pune', location: '', type: 'RESIDENTIAL' });

  const createProject = async () => {
    if (!form.name || !form.location) {
      notifyError('Name and location required');
      return;
    }
    try {
      await api.post('/projects', {
        ...form,
        totalUnits: 100,
        availableUnits: 100,
        priceRange: { min: 5000000, max: 12000000, unit: 'total' },
        configurations: ['2BHK', '3BHK'],
        amenities: [],
        images: []
      });
      setForm({ name: '', city: 'Pune', location: '', type: 'RESIDENTIAL' });
      mutate();
      notifySuccess('Project created');
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || 'Failed to create project');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-lg">Create Project</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          <Input placeholder="Project name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
          <Input placeholder="City" value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />
          <Select
            value={form.type}
            onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
            options={[{ label: 'Residential', value: 'RESIDENTIAL' }, { label: 'Commercial', value: 'COMMERCIAL' }]}
          />
          <Button onClick={createProject}>Create</Button>
        </div>
      </Card>

      <Card>
        <h4 className="text-lg">Projects</h4>
        {isLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading projects...</p>
        ) : (
          <div className="mt-3">
            <Table
              headers={['Name', 'City', 'Type', 'Total Units', 'Available Units']}
              rows={(data?.items || []).map((p) => [p.name, p.city, p.type, p.totalUnits, p.availableUnits])}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
