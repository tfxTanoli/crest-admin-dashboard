import { useQuery } from '@tanstack/react-query'
import {
  Users,
  DollarSign,
  ArrowDownToLine,
  Clock,
  MessageSquare,
  ShieldOff,
  UserCheck,
  Star,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import StatCard from '../../components/shared/StatCard'
import { StatCardSkeleton } from '../../components/ui/Skeleton'
import Card from '../../components/ui/Card'
import { fetchDashboardStats } from '../../services/firebase/analytics'
import { fetchUserGrowthData, fetchRevenueData, fetchStageDistribution } from '../../services/firebase/analytics'
import { formatCurrency } from '../../utils/formatters'

const PIE_COLORS = ['#6175f5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30_000,
  })

  const { data: userGrowth = [] } = useQuery({
    queryKey: ['user-growth'],
    queryFn: () => fetchUserGrowthData(30),
  })

  const { data: revenueData = [] } = useQuery({
    queryKey: ['revenue-data'],
    queryFn: () => fetchRevenueData(30),
  })

  const { data: stageData = [] } = useQuery({
    queryKey: ['stage-distribution'],
    queryFn: fetchStageDistribution,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers ?? 0}
              icon={<Users className="w-5 h-5 text-brand-400" />}
              iconBg="bg-brand-900/60"
            />
            <StatCard
              title="Orientation Members"
              value={stats?.orientationUsers ?? 0}
              icon={<UserCheck className="w-5 h-5 text-blue-400" />}
              iconBg="bg-blue-900/60"
            />
            <StatCard
              title="Journey Members"
              value={stats?.journeyUsers ?? 0}
              icon={<UserCheck className="w-5 h-5 text-green-400" />}
              iconBg="bg-green-900/60"
            />
            <StatCard
              title="Crest Members"
              value={stats?.crestUsers ?? 0}
              icon={<Star className="w-5 h-5 text-yellow-400" />}
              iconBg="bg-yellow-900/60"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
              iconBg="bg-emerald-900/60"
            />
            <StatCard
              title="Total Withdrawals"
              value={formatCurrency(stats?.totalWithdrawals ?? 0)}
              icon={<ArrowDownToLine className="w-5 h-5 text-orange-400" />}
              iconBg="bg-orange-900/60"
            />
            <StatCard
              title="Pending Withdrawals"
              value={stats?.pendingWithdrawals ?? 0}
              icon={<Clock className="w-5 h-5 text-red-400" />}
              iconBg="bg-red-900/60"
            />
            <StatCard
              title="Blocked Users"
              value={stats?.blockedUsers ?? 0}
              icon={<ShieldOff className="w-5 h-5 text-purple-400" />}
              iconBg="bg-purple-900/60"
            />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="User Growth (30 days)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6175f5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6175f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#a5bcfd' }}
              />
              <Area type="monotone" dataKey="value" name="New Users" stroke="#6175f5" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue Trend (30 days)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="value" name="Revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Stage Progression">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="count" name="Users" fill="#6175f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Stage Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stageData.filter((d) => d.count > 0)}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                nameKey="label"
              >
                {stageData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
