import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './config'
import type { CrestConfig } from '../../types'

export async function fetchCrests(): Promise<CrestConfig[]> {
  const snap = await getDocs(query(collection(db, 'crests'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CrestConfig))
}

export async function uploadCrestImage(file: File, crestName: string): Promise<string> {
  const fileName = `crests/${Date.now()}_${crestName.toLowerCase().replace(/\s+/g, '_')}`
  const storageRef = ref(storage, fileName)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function createCrest(
  name: string,
  imageFile: File
): Promise<string> {
  const image_url = await uploadCrestImage(imageFile, name)
  const docRef = await addDoc(collection(db, 'crests'), {
    name,
    image_url,
    active: true,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateCrest(
  crestId: string,
  updates: Partial<{ name: string; active: boolean; image_url: string }>
): Promise<void> {
  await updateDoc(doc(db, 'crests', crestId), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function toggleCrestActive(crestId: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'crests', crestId), { active, updatedAt: serverTimestamp() })
}

export async function deleteCrest(crestId: string, imageUrl?: string): Promise<void> {
  if (imageUrl) {
    try {
      const storageRef = ref(storage, imageUrl)
      await deleteObject(storageRef)
    } catch {
      // ignore storage deletion errors
    }
  }
  await deleteDoc(doc(db, 'crests', crestId))
}
