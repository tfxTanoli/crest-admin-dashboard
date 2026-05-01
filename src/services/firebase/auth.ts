import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './config'
import type { AdminUser } from '../../types'

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const adminDoc = await getDoc(doc(db, 'admins', credential.user.uid))

  if (!adminDoc.exists()) {
    await signOut(auth)
    throw new Error('Access denied. This account is not an admin.')
  }

  return { uid: credential.user.uid, ...adminDoc.data() } as AdminUser
}

export async function adminLogout(): Promise<void> {
  await signOut(auth)
}

export async function validateAdminSession(user: User): Promise<AdminUser | null> {
  const adminDoc = await getDoc(doc(db, 'admins', user.uid))
  if (!adminDoc.exists()) return null
  return { uid: user.uid, ...adminDoc.data() } as AdminUser
}

export function onAdminAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
