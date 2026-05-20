import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList, Globe, Phone, Users } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/ui/Badge'
import { fetchProceedLogs, type ProceedLog } from '../../services/firebase/proceedLogs'
import { formatDateTime } from '../../utils/formatters'

const ITEMS_PER_PAGE = 25

function formatCreatedAt(ts: ProceedLog['createdAt']): string {
  if (!ts) return '—'
  if (typeof (ts as { toDate?: () => Date }).toDate === 'function') {
    return formatDateTime((ts as { toDate: () => Date }).toDate())
  }
  return '—'
}

export default function ProceedLogsPage() {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<'all' | 'journey' | 'crest' | 'name'>('all')
  const [page, setPage] = useState(1)

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['proceed-logs'],
    queryFn: () => fetchProceedLogs(500),
    refetchInterval: 60_000,
  })

  const filtered = useMemo(() => {
    let list = logs
    if (stageFilter !== 'all') {
      list = list.filter((l) => l.stage === stageFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          l.email.toLowerCase().includes(q) ||
          l.userId.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q),
      )
    }
    return list
  }, [logs, stageFilter, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const journeyCount = logs.filter((l) => l.stage === 'journey').length
  const crestCount = logs.filter((l) => l.stage === 'crest').length
  const nameCount = logs.filter((l) => l.stage === 'name').length

  const columns: Column<ProceedLog>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="font-mono text-sm text-white">{row.email || '—'}</span>,
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (row) => (
        <Badge
          variant={row.stage === 'journey' ? 'info' : row.stage === 'crest' ? 'success' : 'warning'}
        >
          {row.stage === 'journey' ? 'Journey' : row.stage === 'crest' ? 'Crest' : 'Name'}
        </Badge>
      ),
    },
    {
      key: 'celebrationType',
      header: 'Celebration',
      render: (row) => (
        <span className="text-sm text-gray-400">
          {row.celebrationType ? row.celebrationType : '—'}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row) => <span className="text-sm text-gray-300">{row.phone || '—'}</span>,
    },
    {
      key: 'country',
      header: 'Country',
      render: (row) => <span className="text-sm text-gray-300">{row.country || '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Proceeded At',
      render: (row) => (
        <span className="text-sm text-gray-400">{formatCreatedAt(row.createdAt)}</span>
      ),
    },
    {
      key: 'userId',
      header: 'User ID',
      render: (row) => (
        <span className="font-mono text-xs text-gray-500 truncate max-w-[120px] block">
          {row.userId}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Proceed Logs</h1>
        <p className="text-gray-400 mt-1">
          Users who clicked Proceed and agreed to be invoiced later.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-900/60"
          title="Total Proceeds"
          value={logs.length}
          loading={isLoading}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-900/60"
          title="Journey"
          value={journeyCount}
          loading={isLoading}
        />
        <StatCard
          icon={<Globe className="w-5 h-5 text-green-400" />}
          iconBg="bg-green-900/60"
          title="Crest"
          value={crestCount}
          loading={isLoading}
        />
        <StatCard
          icon={<Phone className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-900/60"
          title="Name"
          value={nameCount}
          loading={isLoading}
        />
      </div>

      {/* Stage filter tabs */}
      <div className="flex gap-2">
        {(['all', 'journey', 'crest', 'name'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setStageFilter(f); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              stageFilter === f
                ? 'bg-brand-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <DataTable
        data={paginated}
        columns={columns}
        loading={isLoading}
        emptyText="No proceed logs found."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by email, user ID, country, phone…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
