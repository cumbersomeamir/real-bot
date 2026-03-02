import { generateMetadata } from '@/lib/seo';
import { Card, Input, Button } from '@/components/ui';

export const metadata = generateMetadata({
  title: 'Forgot Password',
  description: 'Reset your DealFlow AI account password.',
  path: '/forgot-password'
});

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl">Forgot Password</h2>
      <p className="mt-2 text-sm text-slate-400">Enter your registered email to receive reset instructions.</p>
      <form className="mt-4 space-y-3">
        <Input placeholder="Email" type="email" />
        <Button className="w-full" type="submit">Send reset link</Button>
      </form>
    </Card>
  );
}
