'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auditFormSchema } from '@/lib/validators';
import { Button, Input, Select, Card } from '@/components/ui';
import { notifySuccess } from '@/components/ui/Toast';

export default function AuditForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      name: '',
      company: '',
      phone: '',
      email: '',
      adSpend: '₹1-5L',
      activeProjects: 1,
      currentCrm: 'None'
    }
  });

  const onSubmit = async () => {
    notifySuccess('Audit request submitted. Our team will contact you shortly.');
  };

  return (
    <Card>
      <h3>Book Free Revenue Leakage Audit</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <Input placeholder="Name" {...register('name')} />
        {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
        <Input placeholder="Company" {...register('company')} />
        <Input placeholder="Phone" {...register('phone')} />
        <Input placeholder="Email" type="email" {...register('email')} />
        <Select
          options={[
            { label: '₹1-5L', value: '₹1-5L' },
            { label: '₹5-10L', value: '₹5-10L' },
            { label: '₹10-25L', value: '₹10-25L' },
            { label: '₹25L+', value: '₹25L+' }
          ]}
          {...register('adSpend')}
        />
        <Input placeholder="Number of active projects" type="number" {...register('activeProjects')} />
        <Select
          options={[
            { label: 'None', value: 'None' },
            { label: 'Excel', value: 'Excel' },
            { label: 'Salesforce', value: 'Salesforce' },
            { label: 'Custom', value: 'Custom' },
            { label: 'Other', value: 'Other' }
          ]}
          {...register('currentCrm')}
        />
        <Input type="file" />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          Submit Audit Request
        </Button>
      </form>
    </Card>
  );
}
