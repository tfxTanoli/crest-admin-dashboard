import { useQuery } from '@tanstack/react-query'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import Card from '../../components/ui/Card'
import { PageSpinner } from '../../components/ui/Spinner'
import {
  fetchUserGrowthData,
  fetchRevenueData,
  fetchStageDistribution,
  fetchDashboardStats,
} from '../../services/firebase/analytics'
import { formatCurrency } from '../../utils/formatters'

const PIE_COLORS = ['#6175f5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

export default function AnalyticsPage() {
  const { data: userGrowth = [], isLoading: growthLoading } = useQuery({
    queryKey: ['user-growth-analytics'],
    queryFn: () => fetchUserGrowthData(60),
  })

  const { data: revenueData = [], isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: () => fetchRevenueData(60),
  })

  const { data: stageData = [] } = useQuery({
    queryKey: ['stage-analytics'],
    queryFn: fetchStageDistribution,
  })

  const { data: stats } = useQuery({
    queryKey: ['stats-analytics'],
    queryFn: fetchDashboardStats,
  })

  const groupData = [
    { name: 'Orientation', value: stats?.orientationUsers ?? 0, color: '#6175f5' },
    { name: 'Journey', value: stats?.journeyUsers ?? 0, color: '#22c55e' },
    { name: 'Crest', value: stats?.crestUsers ?? 0, color: '#f59e0b' },
  ]

  if (growthLoading || revenueLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Platform metrics over the last 60 days</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? 0 },
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue ?? 0) },
          { label: 'Blocked Users', value: stats?.blockedUsers ?? 0 },
          { label: 'Active Chats', value: stats?.activeChats ?? 0 },
        ].map((item) => (
          <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="text-xl font-bold text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* User Growth */}
      <Card title="User Growth (60 days)">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={userGrowth}>
            <defs>
              <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6175f5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6175f5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#a5bcfd' }}
            />
            <Area type="monotone" dataKey="value" name="New Users" stroke="#6175f5" fill="url(#ugGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue */}
      <Card title="Revenue Trend (60 days)">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, 'Revenue']}
            />
            <Line type="monotone" dataKey="value" name="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stage Progression */}
        <Card title="Stage Progression">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              />
              <Bar dataKey="count" name="Users" fill="#6175f5" radius={[4, 4, 0, 0]}>
                {stageData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Group Distribution */}
        <Card title="Group Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={groupData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {groupData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              />
              <Legend
                formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
