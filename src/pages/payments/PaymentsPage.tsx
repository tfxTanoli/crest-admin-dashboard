import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, TrendingUp, Calendar, Users } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/ui/Badge'
import { fetchPaymentTransactions, fetchPaymentStats } from '../../services/firebase/payments'
import type { PaymentRecord } from '../../services/firebase/payments'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const ITEMS_PER_PAGE = 20

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('')

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => fetchPaymentTransactions(500),
    refetchInterval: 60_000,
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: fetchPaymentStats,
    refetchInterval: 60_000,
  })

  const filtered = useMemo(() => {
    let list = payments
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.userId.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }
    if (dateFilter) {
      list = list.filter((p) => {
        const ts = p.createdAt
        if (!ts || !(ts as { toDate?: () => Date }).toDate) return false
        const dateStr = (ts as { toDate: () => Date }).toDate().toISOString().slice(0, 10)
        return dateStr === dateFilter
      })
    }
    return list
  }, [payments, search, dateFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const columns: Column<PaymentRecord>[] = [
    {
      key: 'user',
      header: 'User ID',
      render: (p) => (
        <span className="text-xs font-mono text-gray-400 truncate max-w-[120px] block">{p.userId}</span>
      ),
    },
    {
      key: 'type',
      header: 'Payment Type',
      render: (p) => (
        <Badge variant="info">{p.description || 'Payment'}</Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p) => (
        <span className="font-mono font-semibold text-green-400">{formatCurrency(p.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <Badge variant="success">Completed</Badge>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (p) => <span className="text-gray-400 text-xs">{formatDateTime(p.createdAt)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Management</h1>
        <p className="text-gray-400 text-sm mt-1">Paystack payment records from the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Payments"
          value={stats?.totalCount ?? 0}
          icon={<CreditCard className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-900/60"
          loading={statsLoading}
        />
        <StatCard
          title="Total Collected"
          value={formatCurrency(stats?.totalAmount ?? 0)}
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          iconBg="bg-green-900/60"
          loading={statsLoading}
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats?.todayAmount ?? 0)}
          icon={<Calendar className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-900/60"
          loading={statsLoading}
        />
        <StatCard
          title="Today's Payers"
          value={stats?.todayCount ?? 0}
          icon={<Users className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-900/60"
          loading={statsLoading}
        />
      </div>

      {/* Table */}
      <DataTable
        data={paginated}
        columns={columns}
        loading={isLoading}
        emptyText="No payment records found"
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by user ID or description…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setPage(1) }}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {dateFilter && (
              <button
                onClick={() => { setDateFilter(''); setPage(1) }}
                className="text-xs text-gray-400 hover:text-white px-2 py-2"
              >
                Clear
              </button>
            )}
          </div>
        }
      />
    </div>
  )
}
