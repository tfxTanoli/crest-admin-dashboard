import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { Transaction } from '../../types'

export interface PaymentRecord extends Transaction {
  payerEmail?: string
  payerName?: string
}

export async function fetchPaymentTransactions(limitCount = 200): Promise<PaymentRecord[]> {
  const snap = await getDocs(
    query(
      collection(db, 'transactions'),
      where('source', '==', 'payment'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentRecord))
}

export function subscribeToPayments(
  callback: (payments: PaymentRecord[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'transactions'),
    where('source', '==', 'payment'),
    orderBy('createdAt', 'desc'),
    limit(200)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentRecord)))
  })
}

export async function fetchPaymentStats(): Promise<{
  totalCount: number
  totalAmount: number
  todayAmount: number
  todayCount: number
}> {
  const snap = await getDocs(
    query(collection(db, 'transactions'), where('source', '==', 'payment'))
  )

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let totalAmount = 0
  let todayAmount = 0
  let todayCount = 0

  snap.docs.forEach((d) => {
    const data = d.data()
    totalAmount += data.amount ?? 0

    const ts = data.createdAt
    if (ts?.toDate) {
      const date = ts.toDate() as Date
      if (date >= startOfDay) {
        todayAmount += data.amount ?? 0
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
