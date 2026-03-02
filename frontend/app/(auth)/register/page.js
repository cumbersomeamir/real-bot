import { generateMetadata } from '@/lib/seo';
import RegisterForm from './components/RegisterForm';
import OnboardingSteps from './components/OnboardingSteps';

export const metadata = generateMetadata({
  title: 'Register',
  description: 'Create your DealFlow AI workspace.',
  path: '/register'
});

export default function RegisterPage() {
  return (
    <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
      <RegisterForm />
      <OnboardingSteps />
    </div>
  );
}
