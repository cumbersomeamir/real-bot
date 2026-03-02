export default function sitemap() {
  const baseUrl = 'https://dealflow.ai';
  const routes = [
    '/',
    '/about',
    '/features',
    '/pricing',
    '/case-studies',
    '/how-it-works',
    '/audit',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/integrations'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.8
  }));
}
