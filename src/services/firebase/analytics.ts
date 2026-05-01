import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from './config'
import type { DashboardStats, ChartDataPoint, StageDistribution, UserProfile } from '../../types'
import { format, subDays, parseISO } from 'date-fns'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [usersSnap, membersSnap, txSnap, wdSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'group_members')),
    getDocs(query(collection(db, 'transactions'), where('source', '==', 'payment'))),
    getDocs(collection(db, 'withdraw_requests')),
  ])

  const users = usersSnap.docs.map((d) => d.data() as UserProfile)

  const orientationIds = new Set(
    membersSnap.docs
      .filter((d) => d.data().groupId === 'orientation')
      .map((d) => d.data().userId)
  )
  const journeyIds = new Set(
    membersSnap.docs
      .filter((d) => d.data().groupId === 'journey')
      .map((d) => d.data().userId)
  )
  const crestIds = new Set(
    membersSnap.docs
      .filter((d) => d.data().groupId === 'crest')
      .map((d) => d.data().userId)
  )

  const totalRevenue = txSnap.docs.reduce((sum, d) => sum + (d.data().amount ?? 0), 0)

  const withdrawals = wdSnap.docs.map((d) => d.data())
  const totalWithdrawals = withdrawals.filter((d) => d.status === 'paid').reduce((s, d) => s + d.amount, 0)
  const pendingWithdrawals = withdrawals.filter((d) => d.status === 'pending').length

  const privateChatsSnap = await getDocs(collection(db, 'private_chats'))

  return {
    totalUsers: users.length,
    orientationUsers: orientationIds.size,
    journeyUsers: journeyIds.size,
    crestUsers: crestIds.size,
    totalRevenue,
    totalWithdrawals,
    pendingWithdrawals,
    activeChats: privateChatsSnap.size,
    blockedUsers: users.filter((u) => u.chatBlocked).length,
  }
}

export async function fetchUserGrowthData(days = 30): Promise<ChartDataPoint[]> {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('created_at', 'asc')))
  const counts: Record<string, number> = {}

  for (let i = days - 1; i >= 0; i--) {
    const dateKey = format(subDays(new Date(), i), 'MMM dd')
    counts[dateKey] = 0
  }

  snap.docs.forEach((d) => {
    const createdAt = d.data().created_at
    if (!createdAt) return
    try {
      const dateKey = format(parseISO(createdAt), 'MMM dd')
      if (counts[dateKey] !== undefined) {
        counts[dateKey]++
      }
    } catch {
      // skip invalid dates
    }
  })

  return Object.entries(counts).map(([date, value]) => ({ date, value }))
}

export async function fetchRevenueData(days = 30): Promise<ChartDataPoint[]> {
  const snap = await getDocs(
    query(
      collection(db, 'transactions'),
      where('source', '==', 'payment'),
      orderBy('createdAt', 'asc'),
      limit(500)
    )
  )

  const counts: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const dateKey = format(subDays(new Date(), i), 'MMM dd')
    counts[dateKey] = 0
  }

  snap.docs.forEach((d) => {
    const ts = d.data().createdAt
    if (!ts?.toDate) return
    const dateKey = format(ts.toDate(), 'MMM dd')
    if (counts[dateKey] !== undefined) {
      counts[dateKey] += d.data().amount ?? 0
    }
  })

  return Object.entries(counts).map(([date, value]) => ({ date, value }))
}

export async function fetchStageDistribution(): Promise<StageDistribution[]> {
  const snap = await getDocs(collection(db, 'users'))
  const stageCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

  snap.docs.forEach((d) => {
    const stage = d.data().stage ?? 0
    if (stageCounts[stage] !== undefined) stageCounts[stage]++
  })

  const labels: Record<number, string> = {
    0: 'Week 0',
    1: 'Week 1',
    2: 'Week 2',
    3: 'Week 3',
    4: 'Week 4',
    5: 'Week 5',
    6: 'Completed',
  }

  return Object.entries(stageCounts).map(([stage, count]) => ({
    stage: Number(stage),
    label: labels[Number(stage)],
    count,
  }))
}
