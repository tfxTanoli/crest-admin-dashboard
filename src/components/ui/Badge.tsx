type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'purple'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-700 text-gray-300',
  success: 'bg-green-900/60 text-green-400 border border-green-800',
  danger: 'bg-red-900/60 text-red-400 border border-red-800',
  warning: 'bg-yellow-900/60 text-yellow-400 border border-yellow-800',
  info: 'bg-blue-900/60 text-blue-400 border border-blue-800',
  purple: 'bg-purple-900/60 text-purple-400 border border-purple-800',
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
