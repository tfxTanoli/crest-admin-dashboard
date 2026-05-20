import { useQuery } from '@tanstack/react-query'
import { DollarSign, TrendingUp, ArrowDownToLine, Clock } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import DataTable, { type Column } from '../../components/shared/DataTable'
import Badge from '../../components/ui/Badge'
import { fetchAllTransactions } from '../../services/firebase/wallet'
import { fetchRevenueSummary } from '../../services/firebase/wallet'
import { fetchAllUsers } from '../../services/firebase/users'
import type { Transaction } from '../../types'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { useState, useMemo } from 'react'

const SOURCE_LABELS: Record<string, string> = {
  journey_distribution: 'Journey Dist.',
  crest_distribution: 'Crest Dist.',
  withdrawal: 'Withdrawal',
  refund: 'Refund',
}

export default function WalletPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['revenue-summary'],
    queryFn: fetchRevenueSummary,
    refetchInterval: 30_000,
  })

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['all-transactions'],
    queryFn: () => fetchAllTransactions(500),
  })

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users-map'],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60_000,
  })

  const userNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const u of allUsers) map[u.uid] = u.full_name
    return map
  }, [allUsers])

  const filtered = useMemo(() => {
    let list = transactions
    if (typeFilter) list = list.filter((t) => t.source === typeFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          (userNameMap[t.userId] ?? t.userId).toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      )
    }
    return list
  }, [transactions, typeFilter, search, userNameMap])

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const columns: Column<Transaction>[] = [
    {
      key: 'user',
      header: 'Member',
      render: (t) => <span className="text-sm text-gray-200">{userNameMap[t.userId] ?? t.userId}</span>,
    },
    {
      key: 'source',
      header: 'Source',
      render: (t) => <Badge variant="info">{SOURCE_LABELS[t.source] ?? t.source}</Badge>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (t) => (
        <Badge variant={t.type === 'credit' ? 'success' : 'danger'}>{t.type}</Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (t) => (
        <span className={`font-mono font-semibold ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
          {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (t) => <span className="text-gray-300 text-sm">{t.description}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (t) => <span className="text-gray-500 text-xs">{formatDateTime(t.createdAt)}</span>,
    },
  ]

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'journey_distribution', label: 'Journey Distribution' },
    { value: 'crest_distribution', label: 'Crest Distribution' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'refund', label: 'Refund' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Platform financial summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-900/60"
          loading={summaryLoading}
        />
        <StatCard
          title="Total Withdrawn (Paid)"
          value={formatCurrency(summary?.totalWithdrawn ?? 0)}
          icon={<ArrowDownToLine className="w-5 h-5 text-orange-400" />}
          iconBg="bg-orange-900/60"
          loading={summaryLoading}
        />
        <StatCard
          title="Pending Withdrawals"
          value={formatCurrency(summary?.pendingWithdrawals ?? 0)}
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-900/60"
          loading={summaryLoading}
        />
        <StatCard
          title="Total Transactions"
          value={transactions.length}
          icon={<TrendingUp className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-900/60"
          loading={isLoading}
        />
      </div>

      <DataTable
        data={paginated}
        columns={columns}
        loading={isLoading}
        emptyText="No transactions found"
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by name or description…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {sourceOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        }
      />
    </div>
  )
}
