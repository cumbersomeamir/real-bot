import { Table } from '@/components/ui';

export default function PlanComparison() {
  return (
    <Table
      headers={['Feature', 'Starter', 'Growth', 'Enterprise']}
      rows={[
        ['Leads/month', '500', '2,000', 'Unlimited'],
        ['Projects', '2', '5', 'Unlimited'],
        ['AI Agents', '2', '5', '5 + custom'],
        ['Reactivation', 'No', 'Yes', 'Yes'],
        ['Voice Agent', 'No', 'Add-on', 'Included'],
        ['SLA', 'Standard', 'Priority', 'Premium']
      ]}
    />
  );
}
