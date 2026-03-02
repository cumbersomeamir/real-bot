import { notFound } from 'next/navigation';
import { generateMetadata as seoMetadata } from '@/lib/seo';
import { blogPosts } from '@/lib/mockData';
import BlogContent from '../components/BlogContent';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) {
    return seoMetadata({ title: 'Blog Not Found', description: 'Post not found', path: '/blog' });
  }
  return seoMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: '/og/blog-detail.png'
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <div className="section-wrap py-16">
      <p className="text-xs uppercase tracking-wide text-accent-300">{post.category}</p>
      <h1 className="mt-2">{post.title}</h1>
      <p className="mt-2 text-sm text-slate-400">{post.readTime}</p>
      <div className="mt-8">
        <BlogContent markdown={post.content} />
      </div>
    </div>
  );
}
