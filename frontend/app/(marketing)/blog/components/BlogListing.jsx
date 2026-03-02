'use client';

import { useMemo, useState } from 'react';
import BlogCard from './BlogCard';
import CategoryFilter from './CategoryFilter';

export default function BlogListing({ posts = [] }) {
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    if (category === 'All') return posts;
    return posts.filter((post) => post.category === category);
  }, [category, posts]);

  return (
    <>
      <CategoryFilter selected={category} onChange={setCategory} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
