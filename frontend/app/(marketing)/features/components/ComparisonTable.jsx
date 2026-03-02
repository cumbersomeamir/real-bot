import { Table } from '@/components/ui';

export default function ComparisonTable() {
  return (
    <Table
      headers={['Capability', 'Traditional CRM', 'DealFlow AI']}
      rows={[
        ['Speed to first response', '30m-8h', '< 120 seconds'],
        ['Qualification consistency', 'Manual', 'AI standardized'],
        ['Follow-up execution', 'Broker dependent', 'Automated'],
        ['Leakage visibility', 'Low', 'Real-time'],
        ['Broker accountability', 'Limited', 'SLA + reassignment']
      ]}
    />
  );
}
