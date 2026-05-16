import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Building2, TrendingUp, Repeat2, Crown } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import DataTable, { type Column } from '../../components/shared/DataTable'
import Badge from '../../components/ui/Badge'
import {
  subscribeToCompanyWallet,
  fetchCompanyTransactions,
} from '../../services/firebase/wallet'
import type { CompanyWallet, CompanyTransaction } from '../../types'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const SOURCE_LABELS: Record<string, string> = {
  journey_payment: 'Journey',
  crest_payment: 'Crest',
}

const ITEMS_PER_PAGE = 20

export default function CompanyWalletPage() {
  const [wallet, setWallet] = useState<CompanyWallet | null>(null)
  const [walletLoading, setWalletLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const unsub = subscribeToCompanyWallet((data) => {
      setWallet(data)
      setWalletLoading(false)
    })
    return () => unsub()
  }, [])

  const { data: txList = [], isLoading: txLoading } = useQuery({
    queryKey: ['company-transactions'],
    queryFn: () => fetchCompanyTransactions(500),
    refetchInterval: 60_000,
  })

  const filtered = useMemo(() => {
    if (!search) return txList
    const q = search.toLowerCase()
    return txList.filter(
      (t) =>
        t.userId.toLowerCase().includes(q) ||
        t.paymentRef.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q),
    )
  }, [txList, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const columns: Column<CompanyTransaction>[] = [
    {
      key: 'source',
      header: 'Type',
      render: (t) => (
        <Badge variant={t.source === 'journey_payment' ? 'info' : 'warning'}>
          {SOURCE_LABELS[t.source] ?? t.source}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Company Share',
      render: (t) => (
        <span className="font-mono font-semibold text-green-400">{formatCurrency(t.amount)}</span>
      ),
    },
    {
      key: 'user',
      header: 'Payer ID',
      render: (t) => <span className="text-xs font-mono text-gray-400">{t.userId}</span>,
    },
    {
      key: 'ref',
      header: 'Payment Ref',
      render: (t) => (
        <span className="text-xs font-mono text-gray-500 truncate max-w-[120px] block">
          {t.paymentRef}
        </span>
      ),
    },
    {
      key: 'crestType',
      header: 'Crest Type',
      render: (t) =>
        t.crestType ? (
          <Badge variant="success">{t.crestType}</Badge>
        ) : (
          <span className="text-gray-600">-</span>
        ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (t) => (
        <span className="text-gray-500 text-xs">{formatDateTime(t.createdAt)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Company Wallet</h1>
        <p className="text-gray-400 text-sm mt-1">Platform earnings from all payment types</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Balance"
          value={formatCurrency(wallet?.balance ?? 0)}
          icon={<Building2 className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-900/60"
          loading={walletLoading}
        />
        <StatCard
          title="Total Earned"
          value={formatCurrency(wallet?.total_earned ?? 0)}
          icon={<TrendingUp className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-900/60"
          loading={walletLoading}
        />
        <StatCard
          title="Journey Earnings"
          value={formatCurrency(wallet?.total_journey_earned ?? 0)}
          icon={<Repeat2 className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-900/60"
          loading={walletLoading}
        />
        <StatCard
          title="Crest Earnings"
          value={formatCurrency(wallet?.total_crest_earned ?? 0)}
          icon={<Crown className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-900/60"
          loading={walletLoading}
        />
      </div>

      {/* Earnings breakdown bar */}
      {wallet && wallet.total_earned > 0 && (
        <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3">Revenue Breakdown</p>
          <div className="h-3 rounded-full overflow-hidden bg-gray-700 flex">
            <div
              className="bg-blue-500 h-full transition-all"
              style={{
                width: `${((wallet.total_journey_earned ?? 0) / wallet.total_earned) * 100}%`,
              }}
              title={`Journey: ${formatCurrency(wallet.total_journey_earned ?? 0)}`}
            />
            <div
              className="bg-yellow-500 h-full transition-all"
              style={{
                width: `${((wallet.total_crest_earned ?? 0) / wallet.total_earned) * 100}%`,
              }}
              title={`Crest: ${formatCurrency(wallet.total_crest_earned ?? 0)}`}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400">Journey</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-400">Crest</span>
            </div>
          </div>
        </div>
      )}

      {/* Transaction table */}
      <DataTable
        data={paginated}
        columns={columns}
        loading={txLoading}
        emptyText="No company transactions yet"
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        searchPlaceholder="Search by user ID or payment ref…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
