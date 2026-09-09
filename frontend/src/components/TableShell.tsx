'use client';

import React from 'react';

interface TableShellProps {
  headers: string[];
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  hasData?: boolean;
}

export const TableShell: React.FC<TableShellProps> = ({
  headers,
  children,
  emptyState,
  hasData = true,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white/95 via-[#F8FAFC]/90 to-white/95 shadow-2xl backdrop-blur-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#0B1728]">
          <thead className="bg-gradient-to-r from-[#0B1728] via-[#10213E] to-[#3C5880] text-xs font-black uppercase tracking-wider text-[#FFFFFF] border-b border-slate-200 shadow-md">
            <tr>
              {headers.map((h, i) => (
                <th key={i} scope="col" className="px-6 py-4.5 font-mono font-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2563EB]/35">
            {hasData ? (
              children
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-14 text-center text-[#3C5880] font-semibold">
                  {emptyState || 'No records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
