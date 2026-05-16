import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, Ban, CheckCircle, Trash2, UserCog } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { fetchAllUsers, toggleUserChatBlock, updateUserStage, softDeleteUser } from '../../services/firebase/users'
import { fetchTransactionsByUser } from '../../services/firebase/wallet'
import type { UserProfile, Transaction } from '../../types'
import { formatDate, formatCurrency, formatStage, capitalise } from '../../utils/formatters'
import toast from 'react-hot-toast'

const STAGE_OPTIONS = [
  { value: '', label: 'All Stages' },
  { value: '0', label: 'Week 0' },
  { value: '1', label: 'Week 1' },
  { value: '2', label: 'Week 2' },
  { value: '3', label: 'Week 3' },
  { value: '4', label: 'Week 4' },
  { value: '5', label: 'Week 5' },
  { value: '6', label: 'Completed' },
]

const ITEMS_PER_PAGE = 15

export default function UsersPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [confirmBlock, setConfirmBlock] = useState<UserProfile | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<UserProfile | null>(null)
  const [stageEditUser, setStageEditUser] = useState<UserProfile | null>(null)
  const [newStage, setNewStage] = useState('0')
  const [userTxs, setUserTxs] = useState<Transaction[]>([])

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    refetchInterval: 60_000,
  })

  const filtered = useMemo(() => {
    let list = users
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.spiritual_name?.toLowerCase().includes(q)
      )
    }
    if (stageFilter !== '') {
      list = list.filter((u) => String(u.stage) === stageFilter)
    }
    return list
  }, [users, search, stageFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const blockMutation = useMutation({
    mutationFn: ({ userId, blocked }: { userId: string; blocked: boolean }) =>
      toggleUserChatBlock(userId, blocked),
    onSuccess: (_, { blocked }) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(blocked ? 'User blocked from chat' : 'User unblocked')
      setConfirmBlock(null)
    },
    onError: () => toast.error('Action failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => softDeleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User soft deleted')
      setConfirmDelete(null)
    },
    onError: () => toast.error('Delete failed'),
  })

  const stageMutation = useMutation({
    mutationFn: ({ userId, stage }: { userId: string; stage: number }) =>
      updateUserStage(userId, stage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Stage updated')
      setStageEditUser(null)
    },
    onError: () => toast.error('Update failed'),
  })

  async function openDetails(user: UserProfile) {
    setSelectedUser(user)
    setDetailOpen(true)
    try {
      const txs = await fetchTransactionsByUser(user.uid)
      setUserTxs(txs)
    } catch {
      setUserTxs([])
    }
  }

  const columns: Column<UserProfile>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div>
          <p className="font-medium text-white">{u.full_name || '-'}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'spiritual_name',
      header: 'Spiritual Name',
      render: (u) => <span className="text-gray-300">{u.spiritual_name || '-'}</span>,
    },
    {
      key: 'crest',
      header: 'Crest',
      render: (u) => (
        <Badge variant="purple">{capitalise(u.crest) || '-'}</Badge>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (u) => (
        <Badge variant={u.stage === 6 ? 'success' : 'info'}>{formatStage(u.stage)}</Badge>
      ),
    },
    {
      key: 'wallet',
      header: 'Wallet',
      render: (u) => (
        <span className="font-mono text-green-400">{formatCurrency(u.wallet_balance ?? 0)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <div className="flex flex-col gap-1">
          {u.chatBlocked && <Badge variant="danger">Blocked</Badge>}
          {u.isDeleted && <Badge variant="warning">Deleted</Badge>}
          {!u.chatBlocked && !u.isDeleted && <Badge variant="success">Active</Badge>}
        </div>
      ),
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
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openDetails(u)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setStageEditUser(u); setNewStage(String(u.stage)) }}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
            title="Update stage"
          >
            <UserCog className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmBlock(u)}
            className={`p-1.5 rounded transition-colors hover:bg-gray-700 ${u.chatBlocked ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}`}
            title={u.chatBlocked ? 'Unblock' : 'Block chat'}
          >
            {u.chatBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setConfirmDelete(u)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} total users</p>
        </div>
      </div>

      <DataTable
        data={paginated}
        columns={columns}
        loading={isLoading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by name, email, spiritual name…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={
          <Select
            options={STAGE_OPTIONS}
            value={stageFilter}
            onChange={(e) => { setStageFilter(e.target.value); setPage(1) }}
            className="text-xs w-36"
          />
        }
      />

      {/* User Details Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="User Details" size="lg">
        {selectedUser && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Full Name', selectedUser.full_name],
                ['Email', selectedUser.email],
                ['Spiritual Name', selectedUser.spiritual_name || '-'],
                ['Crest', capitalise(selectedUser.crest) || '-'],
                ['Stage', formatStage(selectedUser.stage)],
                ['Wallet Balance', formatCurrency(selectedUser.wallet_balance ?? 0)],
                ['Payment Ref', selectedUser.payment_reference || '-'],
                ['Joined', formatDate(selectedUser.created_at)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm text-white font-medium break-all">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Recent Transactions</p>
              {userTxs.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {userTxs.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 text-xs">
                      <span className="text-gray-300">{tx.description}</span>
                      <span className={tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Stage Edit Modal */}
      <Modal
        open={!!stageEditUser}
        onClose={() => setStageEditUser(null)}
        title="Update User Stage"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setStageEditUser(null)}>Cancel</Button>
            <Button
              loading={stageMutation.isPending}
              onClick={() => stageEditUser && stageMutation.mutate({ userId: stageEditUser.uid, stage: Number(newStage) })}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">{stageEditUser?.full_name}</p>
          <Select
            label="New Stage"
            value={newStage}
            onChange={(e) => setNewStage(e.target.value)}
            options={STAGE_OPTIONS.slice(1)}
          />
        </div>
      </Modal>

      {/* Block Confirm */}
      <ConfirmDialog
        open={!!confirmBlock}
        onClose={() => setConfirmBlock(null)}
        onConfirm={() =>
          confirmBlock &&
          blockMutation.mutate({ userId: confirmBlock.uid, blocked: !confirmBlock.chatBlocked })
        }
        title={confirmBlock?.chatBlocked ? 'Unblock User' : 'Block User'}
        message={
          confirmBlock?.chatBlocked
            ? `Unblock ${confirmBlock.full_name} from chat?`
            : `Block ${confirmBlock?.full_name} from sending messages?`
        }
        confirmLabel={confirmBlock?.chatBlocked ? 'Unblock' : 'Block'}
        variant={confirmBlock?.chatBlocked ? 'warning' : 'danger'}
        loading={blockMutation.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.uid)}
        title="Delete User"
        message={`Soft delete ${confirmDelete?.full_name}? This will mark them as deleted but preserve their data.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
