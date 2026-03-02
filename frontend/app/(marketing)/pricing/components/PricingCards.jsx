import { Card, Button, Badge } from '@/components/ui';

const plans = [
  {
    name: 'Starter',
    price: '₹1.5L/month',
    leads: 'Up to 500',
    projects: '2',
    agents: 'Qualification + Follow-Up',
    brokers: '5',
    reactivation: 'No',
    voice: 'No',
    csm: 'No',
    sla: 'Standard'
  },
  {
    name: 'Growth',
    price: '₹2.5L/month',
    leads: 'Up to 2,000',
    projects: '5',
    agents: 'All 5 agents',
    brokers: '15',
    reactivation: 'Yes',
    voice: 'Add-on ₹30K/mo',
    csm: 'No',
    sla: 'Priority',
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    leads: 'Unlimited',
    projects: 'Unlimited',
    agents: 'All + custom',
    brokers: 'Unlimited',
    reactivation: 'Yes',
    voice: 'Included',
    csm: 'Dedicated',
    sla: 'Premium'
  }
];

export default function PricingCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.featured ? 'border-accent-500 shadow-glow' : ''}>
          {plan.featured ? <Badge className="mb-2">Most Popular</Badge> : null}
          <h3 className="text-xl">{plan.name}</h3>
          <p className="mt-1 text-2xl font-semibold text-accent-300">{plan.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>Leads/month: {plan.leads}</li>
            <li>Projects: {plan.projects}</li>
            <li>AI Agents: {plan.agents}</li>
            <li>Brokers: {plan.brokers}</li>
            <li>Reactivation: {plan.reactivation}</li>
            <li>Voice Agent: {plan.voice}</li>
            <li>Dedicated CSM: {plan.csm}</li>
            <li>SLA: {plan.sla}</li>
          </ul>
          <Button className="mt-5 w-full">Book Demo</Button>
        </Card>
      ))}
    </div>
  );
}
