import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Send, Trash2, Users, Megaphone } from 'lucide-react'
import { fetchAllGroupMemberCounts, subscribeToGroupMessages, deleteGroupMessage, sendAdminAnnouncement } from '../../services/firebase/groups'
import type { ChatMessage, GroupType } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import { formatRelativeTime } from '../../utils/formatters'
import toast from 'react-hot-toast'

const GROUPS: { id: GroupType; label: string; color: string }[] = [
  { id: 'orientation', label: 'Orientation', color: 'info' as const },
  { id: 'journey', label: 'Journey', color: 'success' as const },
  { id: 'crest', label: 'Crest', color: 'purple' as const },
]

export default function GroupsPage() {
  const [activeGroup, setActiveGroup] = useState<GroupType>('orientation')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [confirmDelete, setConfirmDelete] = useState<ChatMessage | null>(null)
  const [announcementOpen, setAnnouncementOpen] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: memberCounts = { orientation: 0, journey: 0, crest: 0 } } = useQuery({
    queryKey: ['group-member-counts'],
    queryFn: fetchAllGroupMemberCounts,
  })

  useEffect(() => {
    setMessages([])
    const unsub = subscribeToGroupMessages(activeGroup, (msgs) => {
      setMessages(msgs)
    })
    return () => unsub()
  }, [activeGroup])

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGroupMessage(id),
    onSuccess: () => { toast.success('Message deleted'); setConfirmDelete(null) },
    onError: () => toast.error('Failed to delete'),
  })

  async function handleSendAnnouncement() {
    if (!announcementText.trim()) return
    setSendingAnnouncement(true)
    try {
      await sendAdminAnnouncement(activeGroup, announcementText.trim())
      toast.success('Announcement sent')
      setAnnouncementText('')
      setAnnouncementOpen(false)
    } catch {
      toast.error('Failed to send announcement')
    } finally {
      setSendingAnnouncement(false)
    }
  }

  const visibleMessages = messages.filter((m) => !m.isDeleted)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Groups & Chat</h1>
          <p className="text-gray-400 text-sm mt-1">Manage group messages and announcements</p>
        </div>
        <Button
          icon={<Megaphone className="w-4 h-4" />}
          onClick={() => setAnnouncementOpen(true)}
        >
          Send Announcement
        </Button>
      </div>

      {/* Group Tabs */}
      <div className="flex gap-3 flex-wrap">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGroup(g.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              activeGroup === g.id
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
          >
            <Users className="w-4 h-4" />
            {g.label}
            <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs">
              {memberCounts[g.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
          <p className="font-medium text-white capitalize">{activeGroup} Group Chat</p>
          <Badge variant="info">{visibleMessages.length} messages</Badge>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 space-y-2 flex flex-col-reverse">
          <div ref={bottomRef} />
          {visibleMessages.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">No messages yet</p>
          )}
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 p-3 rounded-lg group hover:bg-gray-800/60 ${
                msg.system_message ? 'bg-brand-900/30 border border-brand-800/40' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-300">
                {msg.spiritual_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-gray-300">
                    {msg.system_message ? '🔔 System' : msg.spiritual_name}
                  </span>
                  <span className="text-xs text-gray-600">{formatRelativeTime(msg.createdAt)}</span>
                  {msg.system_message && <Badge variant="info">Announcement</Badge>}
                </div>
                <p className="text-sm text-gray-100 break-words">{msg.text}</p>
              </div>
              <button
                onClick={() => setConfirmDelete(msg)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Modal */}
      <Modal
        open={announcementOpen}
        onClose={() => setAnnouncementOpen(false)}
        title={`Send Announcement to ${activeGroup}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAnnouncementOpen(false)}>Cancel</Button>
            <Button
              loading={sendingAnnouncement}
              icon={<Send className="w-4 h-4" />}
              onClick={handleSendAnnouncement}
              disabled={!announcementText.trim()}
            >
              Send
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  activeGroup === g.id
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <textarea
            rows={4}
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Type your announcement…"
            className="w-full px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        title="Delete Message"
        message="Permanently delete this message? It will be hidden from all users."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
