'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Select } from '@/components/ui';
import api from '@/lib/api';
import { setAuthToken } from '@/lib/authClient';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    password: '',
    role: 'OWNER'
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      const token = data?.data?.accessToken;
      if (token) setAuthToken(token);
      notifySuccess('Account created');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl">Create account</h2>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <Input placeholder="Full name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <Input placeholder="Company" value={form.company} onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))} />
        <Input placeholder="Work email" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <Input placeholder="Phone (+91)" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
        <Select
          value={form.role}
          onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
          options={[{ label: 'Owner', value: 'OWNER' }, { label: 'Sales Director', value: 'SALES_DIRECTOR' }]}
        />
        <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
      </form>
    </Card>
  );
}
