import { z } from 'zod';

export const auditFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().min(2, 'Company is required'),
  phone: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  email: z.string().email('Invalid email'),
  adSpend: z.string().min(1, 'Select ad spend range'),
  activeProjects: z.coerce.number().min(1, 'At least 1 project'),
  currentCrm: z.string().min(1, 'Select CRM')
});

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  inquiryType: z.string().min(1),
  message: z.string().min(10)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
