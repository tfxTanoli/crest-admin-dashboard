import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

export type LegalDocType = 'privacy_policy' | 'terms_conditions' | 'csae_policy'

export interface LegalDocument {
  type: LegalDocType
  content: string
  lastUpdated: string
  updatedAt?: unknown
}

export async function fetchLegalDocument(type: LegalDocType): Promise<LegalDocument | null> {
  const snap = await getDoc(doc(db, 'legal_documents', type))
  if (!snap.exists()) return null
  return snap.data() as LegalDocument
}

export async function saveLegalDocument(
  type: LegalDocType,
  content: string,
  lastUpdated: string
): Promise<void> {
  await setDoc(doc(db, 'legal_documents', type), {
    type,
    content,
    lastUpdated,
    updatedAt: serverTimestamp(),
  })
}
