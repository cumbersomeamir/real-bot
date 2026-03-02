import { cn } from '@/lib/utils';

export default function Table({ headers = [], rows = [], className }) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border', className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-secondary text-slate-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-border bg-surface-card text-slate-100">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
