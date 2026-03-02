'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { Button, Card, Input } from '@/components/ui';
import api from '@/lib/api';
import { setAuthToken } from '@/lib/authClient';
import { notifyError, notifySuccess } from '@/components/ui/Toast';

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      const token = data?.data?.accessToken;
      if (!token) throw new Error('Token missing in response');
      setAuthToken(token);
      notifySuccess('Logged in successfully');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <Card>
      <h2 className="text-2xl">Sign in</h2>
      <p className="mt-2 text-xs text-slate-400">Demo: owner@dealflow.ai / Password@123</p>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Email" type="email" {...register('email')} />
        {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
        <Input placeholder="Password" type="password" {...register('password')} />
        {errors.password ? <p className="text-xs text-red-400">{errors.password.message}</p> : null}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setValue('email', 'owner@dealflow.ai');
              setValue('password', 'Password@123');
            }}
          >
            Fill Demo
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
