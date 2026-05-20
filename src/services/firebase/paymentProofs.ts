import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'

export type ProofType = 'journey' | 'crest'
export type ProofStatus = 'pending' | 'approved' | 'rejected'

export interface PaymentProofRecord {
  id: string
  userId: string
  type: ProofType
  imageUrl: string
  status: ProofStatus
  createdAt: unknown
  reviewedAt?: unknown
  reviewNote?: string
  // Denormalized user fields (populated by fetchProofsWithUsers)
  userEmail?: string
  userFullName?: string
}

export async function fetchAllProofs(
  statusFilter?: ProofStatus,
  limitCount = 100,
): Promise<PaymentProofRecord[]> {
  const constraints = statusFilter
    ? [where('status', '==', statusFilter), orderBy('createdAt', 'desc'), limit(limitCount)]
    : [orderBy('createdAt', 'desc'), limit(limitCount)]

  const snap = await getDocs(query(collection(db, 'payment_proofs'), ...constraints))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentProofRecord))
}

export function subscribeToProofs(
  statusFilter: ProofStatus | 'all',
  callback: (proofs: PaymentProofRecord[]) => void,
): Unsubscribe {
  const q =
    statusFilter === 'all'
      ? query(collection(db, 'payment_proofs'), orderBy('createdAt', 'desc'), limit(200))
      : query(
          collection(db, 'payment_proofs'),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc'),
          limit(200),
        )

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentProofRecord)))
  })
}

export async function approveProof(proofId: string, userId: string, type: ProofType): Promise<void> {
  // Mark proof as approved
  await updateDoc(doc(db, 'payment_proofs', proofId), {
    status: 'approved' as ProofStatus,
    reviewedAt: serverTimestamp(),
  })

  // Unlock access for the user based on payment type
  if (type === 'journey') {
    await updateDoc(doc(db, 'users', userId), {
      stage: 1,
      updated_at: new Date().toISOString(),
    })
  } else if (type === 'crest') {
    await updateDoc(doc(db, 'users', userId), {
      crest_celebration_paid: true,
      updated_at: new Date().toISOString(),
    })
  }
}

export async function rejectProof(proofId: string, note?: string): Promise<void> {
  await updateDoc(doc(db, 'payment_proofs', proofId), {
    status: 'rejected' as ProofStatus,
    reviewedAt: serverTimestamp(),
    ...(note ? { reviewNote: note } : {}),
  })
}

export async function fetchProofStats(): Promise<{
  pending: number
  approved: number
  rejected: number
  total: number
}> {
  const snap = await getDocs(collection(db, 'payment_proofs'))
  let pending = 0, approved = 0, rejected = 0
  snap.docs.forEach((d) => {
    const s = d.data().status as ProofStatus
    if (s === 'pending') pending++
    else if (s === 'approved') approved++
    else if (s === 'rejected') rejected++
  })
  return { pending, approved, rejected, total: snap.size }
}
