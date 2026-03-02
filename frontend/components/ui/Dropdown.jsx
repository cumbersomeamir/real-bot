'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function Dropdown({ trigger, items = [] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="rounded-md border border-border bg-surface-card p-1 shadow-lg">
        {items.map((item) => (
          <DropdownMenu.Item
            key={item.label}
            onClick={item.onClick}
            className="cursor-pointer rounded px-3 py-2 text-sm text-slate-200 outline-none hover:bg-surface-hover"
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
