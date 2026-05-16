import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreditCard, TrendingUp, Calendar, Users, AlertTriangle, RefreshCw } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/ui/Badge'
import {
  fetchPaymentTransactions,
  fetchPaymentStats,
  fetchFailedDistributions,
  retryDistribution,
  type PaymentRecord,
  type FailedDistribution,
} from '../../services/firebase/payments'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const ITEMS_PER_PAGE = 20

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('')
  const queryClient = useQueryClient()

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

  const { data: failedDist = [], isLoading: failedLoading } = useQuery({
    queryKey: ['failed-distributions'],
    queryFn: fetchFailedDistributions,
    refetchInterval: 30_000,
  })

  const retryMutation = useMutation({
    mutationFn: (paymentId?: string) => retryDistribution(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['failed-distributions'] })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
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
      render: (p) => <Badge variant="info">{p.description || 'Payment'}</Badge>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p) => (
        <span className="font-mono font-semibold text-green-400">{formatCurrency(p.amount)}</span>
      ),
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (p) => (
        <Badge variant={p.provider === 'paddle' ? 'info' : 'default'}>
          {p.provider === 'paddle' ? 'Paddle' : 'Paystack'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <Badge variant="success">
          {p.status === 'completed' || p.status === 'verified' ? 'Completed' : p.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (p) => <span className="text-gray-400 text-xs">{formatDateTime(p.createdAt)}</span>,
    },
  ]

  const failedColumns: Column<FailedDistribution>[] = [
    {
      key: 'user',
      header: 'User ID',
      render: (p) => (
        <span className="text-xs font-mono text-gray-400 truncate max-w-[100px] block">{p.userId}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (p) => <Badge variant="info">{p.paymentType}{p.crestType ? ` (${p.crestType})` : ''}</Badge>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p) => (
        <span className="font-mono font-semibold text-yellow-400">{formatCurrency(p.amountUsd)}</span>
      ),
    },
    {
      key: 'error',
      header: 'Error',
      render: (p) => (
        <span className="text-xs text-red-400 truncate max-w-[180px] block">
          {p.distributionError ?? '-'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Failed At',
      render: (p) => (
        <span className="text-gray-400 text-xs">{formatDateTime(p.distributionFailedAt ?? p.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <button
          onClick={() => retryMutation.mutate(p.id)}
          disabled={retryMutation.isPending}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-brand-700 hover:bg-brand-600 disabled:opacity-50 text-white rounded"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      ),
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

      {/* Failed Distributions Panel */}
      {(failedLoading || failedDist.length > 0) && (
        <div className="bg-gray-900 border border-red-500/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-white font-semibold">
                Failed Distributions
                {failedDist.length > 0 && (
                  <span className="ml-2 text-sm bg-red-900/60 text-red-300 px-2 py-0.5 rounded-full">
                    {failedDist.length}
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={() => retryMutation.mutate(undefined)}
              disabled={retryMutation.isPending || failedDist.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
              Retry All
            </button>
          </div>

          {retryMutation.isSuccess && (
            <div className="text-sm text-green-400 bg-green-900/30 px-3 py-2 rounded-lg">
              Retry complete, {retryMutation.data.results.filter((r) => r.success).length}/
              {retryMutation.data.retried} succeeded.
            </div>
          )}
          {retryMutation.isError && (
            <div className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">
              {(retryMutation.error as Error).message}
            </div>
          )}

          <DataTable
            data={failedDist}
            columns={failedColumns}
            loading={failedLoading}
            emptyText="No failed distributions"
          />
        </div>
      )}

      {/* All Payments Table */}
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
