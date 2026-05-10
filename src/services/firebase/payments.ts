import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { auth, db } from './config'

const API_BASE = 'https://vercel-api-ruby-psi.vercel.app'

async function getAdminToken(): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')
  return user.getIdToken()
}

export interface PaymentRecord {
  id: string
  userId: string
  paymentType: 'journey' | 'crest'
  crestType?: string
  amount: number
  description: string
  reference: string
  createdAt: unknown
}

function mapPaymentDoc(d: import('firebase/firestore').QueryDocumentSnapshot): PaymentRecord {
  const data = d.data()
  return {
    id: d.id,
    userId: data.userId,
    paymentType: data.paymentType,
    crestType: data.crestType,
    amount: data.amountUsd ?? 0,
    description: data.paymentType === 'journey'
      ? 'Journey Payment'
      : `Crest Payment (${data.crestType ?? 'single'})`,
    reference: data.reference,
    createdAt: data.createdAt,
  }
}

export async function fetchPaymentTransactions(limitCount = 200): Promise<PaymentRecord[]> {
  const snap = await getDocs(
    query(
      collection(db, 'payments'),
      where('status', '==', 'verified'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  )
  return snap.docs.map(mapPaymentDoc)
}

export async function fetchPaymentStats(): Promise<{
  totalCount: number
  totalAmount: number
  todayAmount: number
  todayCount: number
}> {
  const snap = await getDocs(
    query(collection(db, 'payments'), where('status', '==', 'verified'))
  )

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let totalAmount = 0
  let todayAmount = 0
  let todayCount = 0

  snap.docs.forEach((d) => {
    const data = d.data()
    totalAmount += data.amountUsd ?? 0

    const ts = data.createdAt
    if (ts?.toDate) {
      const date = ts.toDate() as Date
      if (date >= startOfDay) {
        todayAmount += data.amountUsd ?? 0
        todayCount++
      }
    }
  })

  return {
    totalCount: snap.size,
    totalAmount,
    todayAmount,
    todayCount,
  }
}

export interface FailedDistribution {
  id: string
  userId: string
  paymentType: string
  crestType?: string
  amountUsd: number
  reference: string
  distributionError?: string
  distributionFailedAt?: unknown
  createdAt?: unknown
}

export async function fetchFailedDistributions(): Promise<FailedDistribution[]> {
  const snap = await getDocs(
    query(
      collection(db, 'payments'),
      where('processed', '==', true),
      where('distributed', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50),
    )
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FailedDistribution))
}

export async function retryDistribution(paymentId?: string): Promise<{
  retried: number
  results: { paymentId: string; success: boolean; error?: string }[]
}> {
  const token = await getAdminToken()
  const res = await fetch(`${API_BASE}/api/retryDistribution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(paymentId ? { paymentId } : {}),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || `Request failed (HTTP ${res.status})`)
  return json
}
