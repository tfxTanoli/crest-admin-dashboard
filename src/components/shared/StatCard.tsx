import type { ReactNode } from 'react'
import { Skeleton } from '../ui/Skeleton'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconBg?: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  loading?: boolean
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = 'bg-brand-900',
  change,
  changeType = 'neutral',
  loading = false,
}: StatCardProps) {
  const changeColor = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  }[changeType]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-sm text-gray-400 truncate">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
          {change && !loading && (
            <p className={`text-xs ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
