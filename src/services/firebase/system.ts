import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import type { SystemConfig } from '../../types'

export async function fetchSystemConfigs(): Promise<SystemConfig[]> {
  const snap = await getDocs(query(collection(db, 'system_configs')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SystemConfig))
}

export async function createSystemConfig(key: string, value: string): Promise<void> {
  await setDoc(doc(db, 'system_configs', key), {
    key,
    value,
    active: true,
    updatedAt: serverTimestamp(),
  })
}

export async function updateSystemConfig(key: string, updates: Partial<SystemConfig>): Promise<void> {
  await updateDoc(doc(db, 'system_configs', key), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSystemConfig(key: string): Promise<void> {
  await deleteDoc(doc(db, 'system_configs', key))
}

export async function toggleSystemConfig(key: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'system_configs', key), {
    active,
    updatedAt: serverTimestamp(),
  })
}
