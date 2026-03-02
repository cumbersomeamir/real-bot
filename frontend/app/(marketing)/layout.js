import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
