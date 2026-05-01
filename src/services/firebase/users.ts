import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  onSnapshot,
  serverTimestamp,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { UserProfile } from '../../types'

const USERS_PER_PAGE = 20

export async function fetchUsers(
  lastDoc?: DocumentSnapshot,
  filters?: { stage?: number; chatBlocked?: boolean }
): Promise<{ users: UserProfile[]; lastDoc: DocumentSnapshot | null }> {
  let q = query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(USERS_PER_PAGE))

  if (filters?.stage !== undefined) {
    q = query(
      collection(db, 'users'),
      where('stage', '==', filters.stage),
      orderBy('created_at', 'desc'),
      limit(USERS_PER_PAGE)
    )
  }

  if (filters?.chatBlocked !== undefined) {
    q = query(
      collection(db, 'users'),
      where('chatBlocked', '==', filters.chatBlocked),
      orderBy('created_at', 'desc'),
      limit(USERS_PER_PAGE)
    )
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }

  const snap = await getDocs(q)
  const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
  const last = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null

  return { users, lastDoc: last }
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('created_at', 'desc')))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
}

export async function fetchUserById(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', userId))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() } as UserProfile
}

export async function updateUserStage(userId: string, stage: number): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    stage,
    updated_at: new Date().toISOString(),
  })
}

export async function toggleUserChatBlock(userId: string, blocked: boolean): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    chatBlocked: blocked,
    updated_at: new Date().toISOString(),
  })
}

export async function softDeleteUser(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    isDeleted: true,
    updated_at: new Date().toISOString(),
  })
}

export async function unlockCertificate(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    crest_unlocked: true,
    updated_at: new Date().toISOString(),
  })
}

export function subscribeToUsers(callback: (users: UserProfile[]) => void): Unsubscribe {
  const q = query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(100))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile)))
  })
}

export async function getTotalUserCount(): Promise<number> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.size
}
