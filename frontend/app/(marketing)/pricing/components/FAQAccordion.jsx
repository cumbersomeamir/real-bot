'use client';

import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
  ['How does billing work?', 'Plans are billed monthly with annual options available.'],
  ['What happens if we exceed lead limits?', 'Additional lead blocks are billed at overage rates based on plan.'],
  ['Can we switch plans?', 'Yes, you can upgrade anytime and downgrade at renewal.'],
  ['Do you integrate with existing CRM?', 'Yes, through APIs, webhooks, and CSV pipelines.'],
  ['What is onboarding time?', 'Typical onboarding is 7-14 business days.'],
  ['How is recovered revenue calculated?', 'Recovered value is attributed to previously leaked leads that convert post activation.'],
  ['Is our data secure?', 'Yes, with encryption, role controls, and audit logs.'],
  ['Can we use this for multiple cities?', 'Yes, project and city-level segmentation is supported.'],
  ['What WhatsApp API do you use?', 'Official WhatsApp Business API-compatible providers.'],
  ['What is the minimum contract?', 'Minimum 3-month commitment on standard plans.']
];

export default function FAQAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {faqs.map(([question, answer], idx) => (
        <Accordion.Item key={question} value={`item-${idx}`} className="surface-card p-4">
          <Accordion.Trigger className="w-full text-left font-medium">{question}</Accordion.Trigger>
          <Accordion.Content className="pt-2 text-sm text-slate-400">{answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
