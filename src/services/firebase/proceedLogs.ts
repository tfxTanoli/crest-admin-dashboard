import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

export interface ProceedLog {
  id: string
  userId: string
  email: string
  paypalEmail: string
  phone: string
  country: string
  stage: 'journey' | 'crest' | 'name'
  celebrationType?: string
  createdAt: Timestamp | null
}

export async function fetchProceedLogs(maxCount = 500): Promise<ProceedLog[]> {
  const snap = await getDocs(
    query(
      collection(db, 'proceed_logs'),
      orderBy('createdAt', 'desc'),
      limit(maxCount),
    ),
  )
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      userId: data.userId ?? '',
      email: data.email ?? '',
      paypalEmail: data.paypalEmail ?? '',
      phone: data.phone ?? '',
      country: data.country ?? '',
      stage: data.stage ?? 'journey',
      celebrationType: data.celebrationType,
      createdAt: data.createdAt ?? null,
    }
  })
}
