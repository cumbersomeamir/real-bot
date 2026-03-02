import { Card } from '@/components/ui';

export default function OnboardingSteps() {
  return (
    <Card>
      <h3>Onboarding Steps</h3>
      <ol className="mt-3 space-y-2 text-sm text-slate-300">
        <li>1. Connect lead sources</li>
        <li>2. Configure projects and brokers</li>
        <li>3. Activate qualification and follow-up agents</li>
        <li>4. Launch dashboard and monitor leakage</li>
      </ol>
    </Card>
  );
}
