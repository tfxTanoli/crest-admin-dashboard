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
import type { Article, ContentBlock } from '../../data/articles'

export type { Article, ContentBlock }

export async function fetchArticles(): Promise<Article[]> {
  const snap = await getDocs(query(collection(db, 'articles'), orderBy('order', 'asc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article))
}

export async function uploadArticleImage(file: File): Promise<string> {
  const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
  const storageRef = ref(storage, `articles/${Date.now()}_${safeName}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function deleteArticleImage(imageUrl: string): Promise<void> {
  try {
    await deleteObject(ref(storage, imageUrl))
  } catch {
    // ignore - file may not exist in storage (e.g. external URL)
  }
}

export async function createArticle(
  data: Omit<Article, 'id'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'articles'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, 'articles', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteArticle(id: string, imageUrl?: string): Promise<void> {
  if (imageUrl) await deleteArticleImage(imageUrl)
  await deleteDoc(doc(db, 'articles', id))
}
