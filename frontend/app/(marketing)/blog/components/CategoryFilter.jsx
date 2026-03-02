'use client';

const categories = ['All', 'Real Estate Sales Strategy', 'AI & Automation in PropTech', 'Lead Management', 'Industry News', 'Product Updates'];

export default function CategoryFilter({ selected = 'All', onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`rounded-full border px-3 py-1 text-xs ${selected === category ? 'border-accent-500 text-accent-300' : 'border-border text-slate-300'}`}
          onClick={() => onChange?.(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
