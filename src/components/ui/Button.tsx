import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white border border-brand-600',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600',
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700',
  success: 'bg-green-600 hover:bg-green-700 text-white border border-green-600',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
