import Link from 'next/link';
import { Button } from '@/components/ui';

const links = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/blog', label: 'Blog' },
  { href: '/audit', label: 'Free Audit' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <nav className="section-wrap flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold text-accent-300">
          DealFlow AI
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white">
            Login
          </Link>
          <Button asChild>
            <Link href="/audit">Book Audit</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
