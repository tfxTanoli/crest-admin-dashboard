// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  uid: string
  email: string
  role: 'admin' | 'superadmin'
  createdAt?: unknown
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string
  email: string
  full_name: string
  stage: number
  eligible: boolean
  spiritual_name: string
  crest: string
  crest_unlocked: boolean
  crest_custom_url?: string
  wallet_balance: number
  payment_reference?: string
  chatBlocked?: boolean
  isDeleted?: boolean
  created_at: string
  updated_at: string
}

// ─── Community ────────────────────────────────────────────────────────────────

export type GroupType = 'orientation' | 'journey' | 'crest'

export interface Group {
  id: GroupType
  type: GroupType
  createdAt: unknown
}

export interface GroupMember {
  id?: string
  userId: string
  groupId: GroupType
  spiritual_name?: string
  joinedAt: unknown
  lastReadAt?: unknown
}

export interface ChatMessage {
  id: string
  groupId: string
  userId: string
  text: string
  spiritual_name: string
  crest_url: string
  system_message: boolean
  createdAt: unknown
  isDeleted: boolean
  replyToId?: string
  replyToText?: string
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected'

export interface ChatInvitation {
  id: string
  fromUserId: string
  fromSpiritualName: string
  toUserId: string
  status: InvitationStatus
  chatId?: string
  createdAt: unknown
}

export interface PrivateChat {
  id: string
  participants: string[]
  participantNames: Record<string, string>
  createdAt: unknown
}

export interface PrivateMessage {
  id: string
  chatId: string
  userId: string
  text: string
  spiritual_name: string
  crest_url: string
  participants: string[]
  createdAt: unknown
  isDeleted: boolean
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export interface Wallet {
  userId: string
  balance: number
  updatedAt: unknown
}

export type TransactionType = 'credit' | 'debit'
export type TransactionSource =
  | 'payment'
  | 'journey_distribution'
  | 'crest_distribution'
  | 'withdrawal'
  | 'refund'

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: TransactionType
  source: TransactionSource
  description: string
  createdAt: unknown
}

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface WithdrawRequest {
  id: string
  userId: string
  amount: number
  status: WithdrawalStatus
  bankInfo?: {
    bankName?: string
    accountNumber?: string
    accountName?: string
  }
  createdAt: unknown
  processedAt?: unknown
}

export interface DistributionSettings {
  journey_percent: number
  crest_percent: number
  company_percent: number
  journey_fee_usd?: number
  crest_single_fee?: number
  crest_spouse_fee?: number
  crest_member_percent?: number
}

// ─── Crests & System ──────────────────────────────────────────────────────────

export interface CrestConfig {
  id: string
  name: string
  image_url: string
  active: boolean
  createdAt?: unknown
}

export interface SystemConfig {
  id?: string
  key: string
  value: string
  active?: boolean
  updatedAt?: unknown
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number
  orientationUsers: number
  journeyUsers: number
  crestUsers: number
  totalRevenue: number
  totalWithdrawals: number
  pendingWithdrawals: number
  activeChats: number
  blockedUsers: number
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface StageDistribution {
  stage: number
  label: string
  count: number
}
