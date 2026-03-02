import { generateMetadata } from '@/lib/seo';
import BlogListing from './components/BlogListing';
import { blogPosts } from '@/lib/mockData';
import NewsletterSignup from './components/NewsletterSignup';

export const metadata = generateMetadata({
  title: 'Blog',
  description: 'Insights on AI, automation, and conversion operations for Indian real estate teams.',
  path: '/blog',
  image: '/og/blog.png'
});

export default function BlogPage() {
  return (
    <div className="section-wrap py-16">
      <h1>Blog</h1>
      <p className="mt-3 text-slate-300">Revenue recovery playbooks, automation guides, and sales operating insights.</p>
      <BlogListing posts={blogPosts} />
      <div className="mt-8">
        <NewsletterSignup />
      </div>
    </div>
  );
}
