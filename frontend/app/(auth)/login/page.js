import { generateMetadata } from '@/lib/seo';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';

export const metadata = generateMetadata({
  title: 'Login',
  description: 'Sign in to DealFlow AI dashboard.',
  path: '/login'
});

export default function LoginPage() {
  return (
    <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
      <LoginForm />
      <SocialLogin />
    </div>
  );
}
