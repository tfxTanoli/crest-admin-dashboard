import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Eye, Trash2 } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { fetchAllPrivateChats, fetchPrivateChatMessages, deletePrivateMessage } from '../../services/firebase/groups'
import { fetchChatInvitations } from '../../services/firebase/groups'
import type { PrivateChat, PrivateMessage, ChatInvitation } from '../../types'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function PrivateChatsPage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'invitations'>('chats')
  const [selectedChat, setSelectedChat] = useState<PrivateChat | null>(null)
  const [chatMessages, setChatMessages] = useState<PrivateMessage[]>([])
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<PrivateMessage | null>(null)
  const [search, setSearch] = useState('')

  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ['private-chats'],
    queryFn: fetchAllPrivateChats,
  })

  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['chat-invitations'],
    queryFn: fetchChatInvitations,
  })

  async function openChat(chat: PrivateChat) {
    setSelectedChat(chat)
    setChatModalOpen(true)
    setLoadingMessages(true)
    try {
      const msgs = await fetchPrivateChatMessages(chat.id)
      setChatMessages(msgs)
    } catch {
      setChatMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePrivateMessage(id),
    onSuccess: () => {
      setChatMessages((prev) => prev.filter((m) => m.id !== confirmDelete?.id))
      toast.success('Message deleted')
      setConfirmDelete(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const filteredChats = search
    ? chats.filter((c) =>
        Object.values(c.participantNames ?? {}).some((n) =>
          n.toLowerCase().includes(search.toLowerCase())
        )
      )
    : chats

  const chatColumns: Column<PrivateChat>[] = [
    {
      key: 'participants',
      header: 'Participants',
      render: (c) => (
        <div className="space-y-0.5">
          {Object.values(c.participantNames ?? {}).map((name, i) => (
            <p key={i} className="text-sm text-white">{name || '—'}</p>
          ))}
        </div>
      ),
    },
    {
      key: 'created',
      header: 'Started',
      render: (c) => <span className="text-gray-400 text-xs">{formatDate(c.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <button
          onClick={() => openChat(c)}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  const invitationColumns: Column<ChatInvitation>[] = [
    {
      key: 'from',
      header: 'From',
      render: (i) => <span className="text-white text-sm">{i.fromSpiritualName}</span>,
    },
    {
      key: 'to',
      header: 'To (UID)',
      render: (i) => <span className="text-gray-400 text-xs">{i.toUserId}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (i) => (
        <Badge
          variant={i.status === 'accepted' ? 'success' : i.status === 'rejected' ? 'danger' : 'warning'}
        >
          {i.status}
        </Badge>
      ),
    },
    {
      key: 'created',
      header: 'Sent',
      render: (i) => <span className="text-gray-400 text-xs">{formatDate(i.createdAt)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Private Chats</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor private conversations and invitations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {(['chats', 'invitations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'chats' ? (
        <DataTable
          data={filteredChats}
          columns={chatColumns}
          loading={chatsLoading}
          emptyText="No private chats found"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by participant name…"
        />
      ) : (
        <DataTable
          data={invitations}
          columns={invitationColumns}
          loading={invitationsLoading}
          emptyText="No invitations found"
        />
      )}

      {/* Chat Messages Modal */}
      <Modal
        open={chatModalOpen}
        onClose={() => { setChatModalOpen(false); setChatMessages([]) }}
        title="Private Chat Messages"
        size="lg"
      >
        {loadingMessages ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chatMessages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 p-3 rounded-lg group hover:bg-gray-800/60 ${
                  msg.isDeleted ? 'opacity-40' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {msg.spiritual_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-gray-300">{msg.spiritual_name}</span>
                    <span className="text-xs text-gray-600">{formatRelativeTime(msg.createdAt)}</span>
                    {msg.isDeleted && <Badge variant="danger">Deleted</Badge>}
                  </div>
                  <p className="text-sm text-gray-100 break-words">{msg.text}</p>
                </div>
                {!msg.isDeleted && (
                  <button
                    onClick={() => setConfirmDelete(msg)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        title="Delete Message"
        message="Permanently delete this message?"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
