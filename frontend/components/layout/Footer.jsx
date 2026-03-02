import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary py-12">
      <div className="section-wrap grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-accent-300">DealFlow AI</p>
          <p className="mt-2 text-sm text-slate-400">Made in India</p>
        </div>
        <div>
          <h5 className="text-sm font-semibold">Product</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/integrations">Integrations</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold">Company</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/case-studies">Case Studies</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold">Legal</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
