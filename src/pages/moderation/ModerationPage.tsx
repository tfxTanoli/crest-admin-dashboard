import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShieldOff, ShieldCheck, RotateCcw, Trash2, AlertTriangle } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import StatCard from '../../components/shared/StatCard'
import {
  fetchBlockedUsers,
  fetchDeletedUsers,
  bulkBlockUsers,
  restoreDeletedUser,
} from '../../services/firebase/moderation'
import { toggleUserChatBlock } from '../../services/firebase/users'
import type { UserProfile } from '../../types'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

type ActiveTab = 'blocked' | 'deleted'

export default function ModerationPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<ActiveTab>('blocked')
  const [confirmUnblock, setConfirmUnblock] = useState<UserProfile | null>(null)
  const [confirmRestore, setConfirmRestore] = useState<UserProfile | null>(null)

  const { data: blockedUsers = [], isLoading: blockedLoading } = useQuery({
    queryKey: ['blocked-users'],
    queryFn: fetchBlockedUsers,
    refetchInterval: 30_000,
  })

  const { data: deletedUsers = [], isLoading: deletedLoading } = useQuery({
    queryKey: ['deleted-users'],
    queryFn: fetchDeletedUsers,
    refetchInterval: 30_000,
  })

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => toggleUserChatBlock(userId, false),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blocked-users'] })
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User unblocked')
      setConfirmUnblock(null)
    },
    onError: () => toast.error('Failed to unblock'),
  })

  const restoreMutation = useMutation({
    mutationFn: (userId: string) => restoreDeletedUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deleted-users'] })
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User restored')
      setConfirmRestore(null)
    },
    onError: () => toast.error('Failed to restore'),
  })

  const blockedColumns: Column<UserProfile>[] = [
    {
      key: 'user',
      header: 'User',
      render: (u) => (
        <div>
          <p className="text-sm font-medium text-white">{u.full_name || '—'}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'spiritual',
      header: 'Spiritual Name',
      render: (u) => <span className="text-gray-300 text-sm">{u.spiritual_name || '—'}</span>,
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (u) => <Badge variant="info">Week {u.stage}</Badge>,
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (u) => <span className="text-gray-400 text-xs">{formatDate(u.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <Button
          size="sm"
          variant="success"
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          onClick={() => setConfirmUnblock(u)}
        >
          Unblock
        </Button>
      ),
    },
  ]

  const deletedColumns: Column<UserProfile>[] = [
    {
      key: 'user',
      header: 'User',
      render: (u) => (
        <div>
          <p className="text-sm font-medium text-white">{u.full_name || '—'}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'spiritual',
      header: 'Spiritual Name',
      render: (u) => <span className="text-gray-300 text-sm">{u.spiritual_name || '—'}</span>,
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (u) => <Badge variant="default">Week {u.stage}</Badge>,
    },
    {
      key: 'updated',
      header: 'Deleted At',
      render: (u) => <span className="text-gray-400 text-xs">{formatDate(u.updated_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <Button
          size="sm"
          variant="secondary"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={() => setConfirmRestore(u)}
        >
          Restore
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderation</h1>
        <p className="text-gray-400 text-sm mt-1">Manage blocked and deleted users</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Blocked Users"
          value={blockedUsers.length}
          icon={<ShieldOff className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-900/60"
          loading={blockedLoading}
        />
        <StatCard
          title="Deleted Users"
          value={deletedUsers.length}
          icon={<Trash2 className="w-5 h-5 text-orange-400" />}
          iconBg="bg-orange-900/60"
          loading={deletedLoading}
        />
      </div>

      {/* Info Banner */}
      {blockedUsers.length === 0 && deletedUsers.length === 0 && !blockedLoading && !deletedLoading && (
        <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800/40 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">Platform is clean — no blocked or deleted users.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('blocked')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'blocked' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShieldOff className="w-4 h-4" />
          Blocked
          {blockedUsers.length > 0 && (
            <span className="bg-black/30 px-1.5 py-0.5 rounded-full text-xs">{blockedUsers.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('deleted')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'deleted' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Deleted
          {deletedUsers.length > 0 && (
            <span className="bg-black/30 px-1.5 py-0.5 rounded-full text-xs">{deletedUsers.length}</span>
          )}
        </button>
      </div>

      {/* Tables */}
      {activeTab === 'blocked' ? (
        <DataTable
          data={blockedUsers}
          columns={blockedColumns}
          loading={blockedLoading}
          emptyText="No blocked users"
        />
      ) : (
        <DataTable
          data={deletedUsers}
          columns={deletedColumns}
          loading={deletedLoading}
          emptyText="No deleted users"
        />
      )}

      {/* Unblock confirm */}
      <ConfirmDialog
        open={!!confirmUnblock}
        onClose={() => setConfirmUnblock(null)}
        onConfirm={() => confirmUnblock && unblockMutation.mutate(confirmUnblock.uid)}
        title="Unblock User"
        message={`Allow "${confirmUnblock?.full_name}" to send messages again?`}
        confirmLabel="Unblock"
        variant="warning"
        loading={unblockMutation.isPending}
      />

      {/* Restore confirm */}
      <ConfirmDialog
        open={!!confirmRestore}
        onClose={() => setConfirmRestore(null)}
        onConfirm={() => confirmRestore && restoreMutation.mutate(confirmRestore.uid)}
        title="Restore User"
        message={`Restore "${confirmRestore?.full_name}" so they can access the platform again?`}
        confirmLabel="Restore"
        variant="warning"
        loading={restoreMutation.isPending}
      />
    </div>
  )
}
