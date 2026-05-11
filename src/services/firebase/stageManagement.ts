import {
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './config'

// Stage Update

export async function forceSetUserStage(userId: string, stage: number): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    stage,
    updated_at: new Date().toISOString(),
  })
}

export async function resetUserProgression(userId: string): Promise<void> {
  const batch = writeBatch(db)

  // Reset user profile back to stage 0
  batch.update(doc(db, 'users', userId), {
    stage: 0,
    eligible: false,
    spiritual_name: '',
    crest: '',
    crest_unlocked: false,
    payment_reference: null,
    updated_at: new Date().toISOString(),
  })

  await batch.commit()
}

// Certificate Unlock

export async function unlockUserCertificate(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    crest_unlocked: true,
    updated_at: new Date().toISOString(),
  })
}

// Force Week Unlock
// Advances user to the given stage without going through the normal flow

export async function forceUnlockWeek(userId: string, targetStage: number): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    stage: targetStage,
    updated_at: new Date().toISOString(),
  })
}

// Bulk Stage Reset

export async function bulkResetStage(userIds: string[], targetStage: number): Promise<void> {
  const BATCH_LIMIT = 400
  for (let i = 0; i < userIds.length; i += BATCH_LIMIT) {
    const chunk = userIds.slice(i, i + BATCH_LIMIT)
    const batch = writeBatch(db)
    chunk.forEach((uid) => {
      batch.update(doc(db, 'users', uid), {
        stage: targetStage,
        updated_at: new Date().toISOString(),
      })
    })
    await batch.commit()
  }
}
