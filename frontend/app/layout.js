import './globals.css';
import { Toaster } from 'react-hot-toast';
import CookieConsent from '@/components/shared/CookieConsent';
import JsonLd from '@/components/shared/JsonLd';
import { bodyFont, displayFont, monoFont } from '@/styles/fonts';

export const metadata = {
  metadataBase: new URL('https://dealflow.ai'),
  title: 'DealFlow AI — Real Estate Revenue Recovery Engine',
  description:
    'Recover lost real estate deals with AI-powered lead qualification, follow-up automation, and broker accountability.',
  applicationName: 'DealFlow AI',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'DealFlow AI — Real Estate Revenue Recovery Engine',
    description:
      'Recover 15–30% of leaked property deals in 60 days with AI lead management for Indian developers.',
    url: 'https://dealflow.ai',
    siteName: 'DealFlow AI',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealFlow AI',
    description: 'AI-powered real estate revenue recovery engine',
    images: ['/og/default.png']
  }
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DealFlow AI',
  url: 'https://dealflow.ai',
  logo: 'https://dealflow.ai/og/default.png',
  contactPoint: [{ '@type': 'ContactPoint', email: 'hello@dealflow.ai', contactType: 'sales' }]
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DealFlow AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '150000'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased`}>
        <JsonLd data={organizationSchema} />
        <JsonLd data={softwareSchema} />
        {children}
        <CookieConsent />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
