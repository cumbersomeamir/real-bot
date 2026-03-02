import Link from 'next/link';
import { Card } from '@/components/ui';

export default function BlogCard({ post }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-accent-300">{post.category}</p>
      <h3 className="mt-2 text-xl">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-400">{post.excerpt}</p>
      <p className="mt-2 text-xs text-slate-500">{post.readTime}</p>
      <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-accent-300 hover:text-accent-200">
        Read article
      </Link>
    </Card>
  );
}
