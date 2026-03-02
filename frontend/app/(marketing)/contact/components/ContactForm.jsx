'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '@/lib/validators';
import { Button, Input, Select, Card } from '@/components/ui';
import { notifySuccess } from '@/components/ui/Toast';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = () => notifySuccess('Message received. Our team will respond soon.');

  return (
    <Card>
      <h3>Contact Us</h3>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Name" {...register('name')} />
        <Input placeholder="Email" type="email" {...register('email')} />
        <Input placeholder="Phone" {...register('phone')} />
        <Input placeholder="Company" {...register('company')} />
        <Select
          {...register('inquiryType')}
          options={[
            { label: 'General Inquiry', value: 'general' },
            { label: 'Sales', value: 'sales' },
            { label: 'Partnership', value: 'partnership' },
            { label: 'Support', value: 'support' }
          ]}
        />
        <textarea
          className="min-h-32 w-full rounded-md border border-border bg-surface-card p-3 text-sm"
          placeholder="Message"
          {...register('message')}
        />
        {Object.values(errors)[0] ? <p className="text-xs text-red-400">Please correct form errors.</p> : null}
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </Card>
  );
}
