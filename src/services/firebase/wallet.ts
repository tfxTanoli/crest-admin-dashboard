import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type {
  Transaction,
  WithdrawRequest,
  DistributionSettings,
  Wallet,
  Payment,
  CompanyWallet,
  CompanyTransaction,
} from '../../types'

// Wallets

export async function fetchAllWallets(): Promise<Wallet[]> {
  const snap = await getDocs(collection(db, 'wallets'))
  return snap.docs.map((d) => ({ ...d.data() } as Wallet))
}

export async function fetchWalletByUser(userId: string): Promise<Wallet | null> {
  const snap = await getDoc(doc(db, 'wallets', userId))
  if (!snap.exists()) return null
  return snap.data() as Wallet
}

// Transactions

export async function fetchAllTransactions(limitCount = 100): Promise<Transaction[]> {
  const snap = await getDocs(
    query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(limitCount))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction))
}

export async function fetchTransactionsByUser(userId: string): Promise<Transaction[]> {
  const snap = await getDocs(
    query(collection(db, 'transactions'), where('userId', '==', userId), limit(50))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction))
}

export function subscribeToTransactions(callback: (txs: Transaction[]) => void): Unsubscribe {
  const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(100))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)))
  })
}

// Withdraw Requests

export async function fetchAllWithdrawRequests(): Promise<WithdrawRequest[]> {
  const snap = await getDocs(
    query(collection(db, 'withdraw_requests'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WithdrawRequest))
}

export function subscribeToWithdrawRequests(
  callback: (requests: WithdrawRequest[]) => void
): Unsubscribe {
  const q = query(collection(db, 'withdraw_requests'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WithdrawRequest)))
  })
}

export async function approveWithdrawal(requestId: string, userId: string, amount: number): Promise<void> {
  const batch = writeBatch(db)

  batch.update(doc(db, 'withdraw_requests', requestId), {
    status: 'approved',
    processedAt: serverTimestamp(),
  })

  batch.set(
    doc(db, 'wallets', userId),
    { balance: increment(-amount), updatedAt: serverTimestamp() },
    { merge: true }
  )

  await batch.commit()

  await addDoc(collection(db, 'transactions'), {
    userId,
    amount,
    type: 'debit',
    source: 'withdrawal',
    description: 'Withdrawal approved by admin',
    createdAt: serverTimestamp(),
  })
}

export async function rejectWithdrawal(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'withdraw_requests', requestId), {
    status: 'rejected',
    processedAt: serverTimestamp(),
  })
}

export async function markWithdrawalPaid(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'withdraw_requests', requestId), {
    status: 'paid',
    processedAt: serverTimestamp(),
  })
}

// Distribution Settings

export async function fetchDistributionSettings(): Promise<DistributionSettings> {
  const snap = await getDoc(doc(db, 'distribution_settings', 'main'))
  if (snap.exists()) return snap.data() as DistributionSettings
  return {
    journey_percent: 25,
    crest_percent: 25,
    company_percent: 50,
    journey_fee_usd: 1,
    crest_single_fee: 2,
    crest_spouse_fee: 3,
    crest_member_percent: 25,
  }
}

export async function saveDistributionSettings(settings: DistributionSettings): Promise<void> {
  await setDoc(doc(db, 'distribution_settings', 'main'), {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// Payments Collection

export async function fetchAllPayments(limitCount = 200): Promise<Payment[]> {
  const snap = await getDocs(
    query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(limitCount))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment))
}

export function subscribeToPayments(
  callback: (payments: Payment[]) => void
): Unsubscribe {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(200))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)))
  })
}

// Company Wallet

export async function fetchCompanyWallet(): Promise<CompanyWallet | null> {
  const snap = await getDoc(doc(db, 'company_wallet', 'summary'))
  if (!snap.exists()) return null
  return snap.data() as CompanyWallet
}

export function subscribeToCompanyWallet(
  callback: (wallet: CompanyWallet | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'company_wallet', 'summary'), (snap) => {
    callback(snap.exists() ? (snap.data() as CompanyWallet) : null)
  })
}

export async function fetchCompanyTransactions(
  limitCount = 100
): Promise<CompanyTransaction[]> {
  const snap = await getDocs(
    query(collection(db, 'company_transactions'), orderBy('createdAt', 'desc'), limit(limitCount))
  )
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as CompanyTransaction)
  )
}

// Revenue Summary

export async function fetchRevenueSummary(): Promise<{
  totalRevenue: number
  totalWithdrawn: number
  pendingWithdrawals: number
}> {
  const [txSnap, wdSnap] = await Promise.all([
    getDocs(query(collection(db, 'payments'), where('status', '==', 'verified'))),
    getDocs(collection(db, 'withdraw_requests')),
  ])

  const totalRevenue = txSnap.docs.reduce((sum, d) => sum + (d.data().amountUsd ?? 0), 0)
  const withdrawals = wdSnap.docs.map((d) => d.data())
  const totalWithdrawn = withdrawals.filter((d) => d.status === 'paid').reduce((s, d) => s + d.amount, 0)
  const pendingWithdrawals = withdrawals.filter((d) => d.status === 'pending').reduce((s, d) => s + d.amount, 0)

  return { totalRevenue, totalWithdrawn, pendingWithdrawals }
}
