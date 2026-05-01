import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './config'
import type { UserProfile } from '../../types'

export interface ModerationReport {
  id: string
  reportedUserId: string
  reportedByUserId: string
  reason: string
  context?: string
  status: 'open' | 'resolved' | 'dismissed'
  createdAt: unknown
  resolvedAt?: unknown
}

export async function fetchBlockedUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(
    query(collection(db, 'users'), where('chatBlocked', '==', true))
  )
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
}

export async function fetchDeletedUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(
    query(collection(db, 'users'), where('isDeleted', '==', true))
  )
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
}

export async function bulkBlockUsers(userIds: string[], blocked: boolean): Promise<void> {
  const BATCH_LIMIT = 400
  for (let i = 0; i < userIds.length; i += BATCH_LIMIT) {
    const chunk = userIds.slice(i, i + BATCH_LIMIT)
    const batch = writeBatch(db)
    chunk.forEach((uid) => {
      batch.update(doc(db, 'users', uid), {
        chatBlocked: blocked,
        updated_at: new Date().toISOString(),
      })
    })
    await batch.commit()
  }
}

export async function restoreDeletedUser(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    isDeleted: false,
    updated_at: new Date().toISOString(),
  })
}

export async function fetchDeletedGroupMessages(groupId: string): Promise<number> {
  const snap = await getDocs(
    query(
      collection(db, 'messages'),
      where('groupId', '==', groupId),
      where('isDeleted', '==', true)
    )
  )
  return snap.size
}

export async function fetchDeletedPrivateMessages(): Promise<number> {
  const snap = await getDocs(
    query(collection(db, 'private_messages'), where('isDeleted', '==', true))
  )
  return snap.size
}
