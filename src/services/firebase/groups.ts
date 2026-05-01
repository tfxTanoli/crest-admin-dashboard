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
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { ChatMessage, GroupMember, GroupType, ChatInvitation, PrivateChat, PrivateMessage } from '../../types'

// ─── Group Members ────────────────────────────────────────────────────────────

export async function fetchGroupMembers(groupId: GroupType): Promise<GroupMember[]> {
  const q = query(collection(db, 'group_members'), where('groupId', '==', groupId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GroupMember))
}

export async function fetchAllGroupMemberCounts(): Promise<Record<GroupType, number>> {
  const [ori, jou, cre] = await Promise.all([
    getDocs(query(collection(db, 'group_members'), where('groupId', '==', 'orientation'))),
    getDocs(query(collection(db, 'group_members'), where('groupId', '==', 'journey'))),
    getDocs(query(collection(db, 'group_members'), where('groupId', '==', 'crest'))),
  ])
  return {
    orientation: ori.size,
    journey: jou.size,
    crest: cre.size,
  }
}

// ─── Group Messages ────────────────────────────────────────────────────────────

export function subscribeToGroupMessages(
  groupId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'messages'),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
    limit(100)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)))
  })
}

export async function deleteGroupMessage(messageId: string): Promise<void> {
  await updateDoc(doc(db, 'messages', messageId), { isDeleted: true })
}

export async function sendAdminAnnouncement(groupId: string, text: string): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    groupId,
    userId: 'system',
    text,
    spiritual_name: 'Admin',
    crest_url: '',
    system_message: true,
    isDeleted: false,
    createdAt: serverTimestamp(),
  })
}

// ─── Private Chats ────────────────────────────────────────────────────────────

export async function fetchAllPrivateChats(): Promise<PrivateChat[]> {
  const snap = await getDocs(query(collection(db, 'private_chats'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PrivateChat))
}

export async function fetchPrivateChatMessages(chatId: string): Promise<PrivateMessage[]> {
  const q = query(
    collection(db, 'private_messages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PrivateMessage))
}

export async function deletePrivateMessage(messageId: string): Promise<void> {
  await updateDoc(doc(db, 'private_messages', messageId), { isDeleted: true })
}

// ─── Chat Invitations ─────────────────────────────────────────────────────────

export async function fetchChatInvitations(): Promise<ChatInvitation[]> {
  const snap = await getDocs(query(collection(db, 'chat_invitations'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatInvitation))
}

export function subscribeToActiveChats(callback: (count: number) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'private_chats')),
    (snap) => callback(snap.size)
  )
}
