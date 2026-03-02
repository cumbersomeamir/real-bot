'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';

export default function Tooltip({ content, children }) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white">
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
