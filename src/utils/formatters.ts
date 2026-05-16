import { format, formatDistanceToNow } from 'date-fns'

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: unknown): string {
  if (!date) return '-'
  try {
    // Firestore Timestamp
    if (typeof date === 'object' && date !== null && 'toDate' in date) {
      return format((date as { toDate: () => Date }).toDate(), 'MMM dd, yyyy')
    }
    // ISO string
    if (typeof date === 'string') {
      return format(new Date(date), 'MMM dd, yyyy')
    }
    return '-'
  } catch {
    return '-'
  }
}

export function formatDateTime(date: unknown): string {
  if (!date) return '-'
  try {
    if (typeof date === 'object' && date !== null && 'toDate' in date) {
      return format((date as { toDate: () => Date }).toDate(), 'MMM dd, yyyy HH:mm')
    }
    if (typeof date === 'string') {
      return format(new Date(date), 'MMM dd, yyyy HH:mm')
    }
    return '-'
  } catch {
    return '-'
  }
}

export function formatRelativeTime(date: unknown): string {
  if (!date) return '-'
  try {
    if (typeof date === 'object' && date !== null && 'toDate' in date) {
      return formatDistanceToNow((date as { toDate: () => Date }).toDate(), { addSuffix: true })
    }
    if (typeof date === 'string') {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    }
    return '-'
  } catch {
    return '-'
  }
}

export function formatStage(stage: number): string {
  if (stage === 0) return 'Week 0 (Onboarding)'
  if (stage === 6) return 'Completed'
  return `Week ${stage}`
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

export function capitalise(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
