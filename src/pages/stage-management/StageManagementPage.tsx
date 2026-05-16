import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Unlock,
  RotateCcw,
  ArrowRight,
  Award,
  Search,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { fetchAllUsers } from '../../services/firebase/users'
import {
  forceUnlockWeek,
  resetUserProgression,
  unlockUserCertificate,
  bulkResetStage,
} from '../../services/firebase/stageManagement'
import type { UserProfile } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatDate, formatStage } from '../../utils/formatters'
import toast from 'react-hot-toast'

const STAGE_OPTIONS = [
  { value: '0', label: 'Week 0 (Onboarding)' },
  { value: '1', label: 'Week 1 (Identity)' },
  { value: '2', label: 'Week 2 (Discipline)' },
  { value: '3', label: 'Week 3 (Wilderness)' },
  { value: '4', label: 'Week 4 (Shadow Work)' },
  { value: '5', label: 'Week 5 (Baptism)' },
  { value: '6', label: 'Week 6 (Mission): Completed' },
]

const STAGE_BADGE: Record<number, 'default' | 'info' | 'warning' | 'success' | 'purple'> = {
  0: 'default',
  1: 'info',
  2: 'info',
  3: 'warning',
  4: 'warning',
  5: 'purple',
  6: 'success',
}

export default function StageManagementPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [targetStage, setTargetStage] = useState('0')
  const [stageModalOpen, setStageModalOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState<UserProfile | null>(null)
  const [confirmUnlock, setConfirmUnlock] = useState<UserProfile | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  })

  const filtered = useMemo(() => {
    let list = [...users]
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
    list.sort((a, b) =>
      sortDir === 'asc' ? a.stage - b.stage : b.stage - a.stage
    )
    return list
  }, [users, search, stageFilter, sortDir])

  const stageSummary = useMemo(() => {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    users.forEach((u) => {
      if (counts[u.stage] !== undefined) counts[u.stage]++
    })
    return counts
  }, [users])

  const stageMutation = useMutation({
    mutationFn: ({ userId, stage }: { userId: string; stage: number }) =>
      forceUnlockWeek(userId, stage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Stage updated')
      setStageModalOpen(false)
      setSelectedUser(null)
    },
    onError: () => toast.error('Failed to update stage'),
  })

  const resetMutation = useMutation({
    mutationFn: (userId: string) => resetUserProgression(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User progression reset to Week 0')
      setConfirmReset(null)
    },
    onError: () => toast.error('Reset failed'),
  })

  const unlockMutation = useMutation({
    mutationFn: (userId: string) => unlockUserCertificate(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Certificate unlocked')
      setConfirmUnlock(null)
    },
    onError: () => toast.error('Unlock failed'),
  })

  function openStageModal(user: UserProfile) {
    setSelectedUser(user)
    setTargetStage(String(user.stage))
    setStageModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Stage & Week Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Force-unlock weeks, reset progression, and manage certificates
        </p>
      </div>

      {/* Stage Distribution Summary */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {Object.entries(stageSummary).map(([stage, count]) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stageFilter === stage ? '' : stage)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
              stageFilter === stage
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            <span className="text-xl font-bold text-white">{count}</span>
            <span className="text-xs">Wk {stage}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <Select
          options={[{ value: '', label: 'All Stages' }, ...STAGE_OPTIONS]}
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="w-48"
        />
        <button
          onClick={() => setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white"
        >
          Stage {sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* User List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No users found</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filtered.map((user) => (
              <div key={user.uid} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-800/40 transition-colors">
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">{user.full_name || '-'}</p>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={STAGE_BADGE[user.stage] ?? 'default'}>
                      {formatStage(user.stage)}
                    </Badge>
                    {user.crest_unlocked && (
                      <Badge variant="success">
                        <Award className="w-3 h-3 mr-1 inline" />
                        Certified
                      </Badge>
                    )}
                    {user.spiritual_name && (
                      <span className="text-xs text-gray-400 italic">"{user.spiritual_name}"</span>
                    )}
                  </div>
                </div>

                {/* Joined */}
                <div className="hidden sm:block text-xs text-gray-500 flex-shrink-0">
                  {formatDate(user.created_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openStageModal(user)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-900/40 text-brand-400 hover:bg-brand-900/70 transition-colors border border-brand-800/50"
                    title="Force set stage"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Set Stage
                  </button>
                  <button
                    onClick={() => setConfirmUnlock(user)}
                    disabled={user.crest_unlocked}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/60 transition-colors border border-yellow-800/40 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Unlock certificate"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Cert
                  </button>
                  <button
                    onClick={() => setConfirmReset(user)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-900/30 text-red-400 hover:bg-red-900/60 transition-colors border border-red-800/40"
                    title="Reset to Week 0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Set Stage Modal */}
      <Modal
        open={stageModalOpen}
        onClose={() => { setStageModalOpen(false); setSelectedUser(null) }}
        title="Force Set Stage"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setStageModalOpen(false)}>Cancel</Button>
            <Button
              loading={stageMutation.isPending}
              onClick={() =>
                selectedUser &&
                stageMutation.mutate({ userId: selectedUser.uid, stage: Number(targetStage) })
              }
            >
              Apply
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-white font-medium">{selectedUser?.full_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Current: <span className="text-brand-400">{formatStage(selectedUser?.stage ?? 0)}</span>
            </p>
          </div>
          <Select
            label="Target Stage"
            value={targetStage}
            onChange={(e) => setTargetStage(e.target.value)}
            options={STAGE_OPTIONS}
          />
          <p className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800/40 rounded-lg px-3 py-2">
            This bypasses normal progression checks. The user's data for skipped weeks will remain unchanged.
          </p>
        </div>
      </Modal>

      {/* Reset Confirm */}
      <ConfirmDialog
        open={!!confirmReset}
        onClose={() => setConfirmReset(null)}
        onConfirm={() => confirmReset && resetMutation.mutate(confirmReset.uid)}
        title="Reset User Progression"
        message={`Reset "${confirmReset?.full_name}" back to Week 0? Their stage, eligibility, spiritual name, crest, and payment reference will be cleared.`}
        confirmLabel="Reset"
        loading={resetMutation.isPending}
      />

      {/* Cert Unlock Confirm */}
      <ConfirmDialog
        open={!!confirmUnlock}
        onClose={() => setConfirmUnlock(null)}
        onConfirm={() => confirmUnlock && unlockMutation.mutate(confirmUnlock.uid)}
        title="Unlock Certificate"
        message={`Manually unlock the crest certificate for "${confirmUnlock?.full_name}"?`}
        confirmLabel="Unlock"
        variant="warning"
        loading={unlockMutation.isPending}
      />
    </div>
  )
}
