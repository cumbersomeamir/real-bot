export function generateMetadata({ title, description, path, image, keywords = [] }) {
  const baseUrl = 'https://dealflow.ai';
  const fullTitle = `${title} | DealFlow AI`;
  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'DealFlow AI',
      images: [{ url: image || '/og/default.png', width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image || '/og/default.png']
    },
    alternates: {
      canonical: `${baseUrl}${path}`
    }
  };
}

export const siteConfig = {
  name: 'DealFlow AI',
  description: 'AI-powered real estate revenue recovery platform for developers in India.',
  url: 'https://dealflow.ai',
  email: 'hello@dealflow.ai'
};
