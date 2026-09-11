import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export type DataColumn<T> = { key: string; label: string; render: (row: T) => ReactNode; className?: string };

export function DataTable<T>({ rows, columns, rowKey, emptyTitle = "No records found", emptyText = "Change the filters or add a new record." }: { rows: T[]; columns: DataColumn<T>[]; rowKey: (row: T) => string; emptyTitle?: string; emptyText?: string }) {
  if (!rows.length) return <EmptyState title={emptyTitle} text={emptyText}/>;
  return <div className="overflow-hidden rounded-lg border border-border bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-border bg-mist text-xs font-semibold uppercase text-stone"><tr>{columns.map((column) => <th key={column.key} className={`px-4 py-3 ${column.className ?? ""}`}>{column.label}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map((row) => <tr key={rowKey(row)} className="hover:bg-snow">{columns.map((column) => <td key={column.key} className={`px-4 py-3 text-sm ${column.className ?? ""}`}>{column.render(row)}</td>)}</tr>)}</tbody></table></div></div>;
}
