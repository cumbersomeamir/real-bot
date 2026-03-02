'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';

export default function Tabs({ items = [] }) {
  if (!items.length) return null;
  return (
    <TabsPrimitive.Root defaultValue={items[0].value}>
      <TabsPrimitive.List className="mb-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className="rounded-md border border-border px-3 py-2 text-sm text-slate-300 data-[state=active]:border-accent-500 data-[state=active]:text-accent-300"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className="surface-card p-4">
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
