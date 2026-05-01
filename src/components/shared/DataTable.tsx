import type { ReactNode } from 'react'
import { TableSkeleton } from '../ui/Skeleton'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyText?: string
  searchValue?: string
  onSearchChange?: (v: string) => void
  searchPlaceholder?: string
  page?: number
  totalPages?: number
  onPageChange?: (p: number) => void
  actions?: ReactNode
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyText = 'No data found',
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  page,
  totalPages,
  onPageChange,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Toolbar */}
      {(onSearchChange || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-800">
          {onSearchChange && (
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={5} cols={columns.length} />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-sm">{emptyText}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider ${col.width ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 ${col.width ?? ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages !== undefined && onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Page {(page ?? 1)} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange((page ?? 1) - 1)}
              disabled={(page ?? 1) <= 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange((page ?? 1) + 1)}
              disabled={(page ?? 1) >= totalPages}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
