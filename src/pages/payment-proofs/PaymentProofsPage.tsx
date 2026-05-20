import { useState, useEffect, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Clock,
  CheckCircle,
  XCircle,
  ImageIcon,
  Users,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import {
  subscribeToProofs,
  approveProof,
  rejectProof,
  fetchProofStats,
  type PaymentProofRecord,
  type ProofStatus,
} from '../../services/firebase/paymentProofs'
import { fetchUserById } from '../../services/firebase/users'
import { formatDateTime } from '../../utils/formatters'

type StatusFilter = ProofStatus | 'all'

interface EnrichedProof extends PaymentProofRecord {
  userEmail?: string
  userFullName?: string
}

export default function PaymentProofsPage() {
  const queryClient = useQueryClient()

  const [proofs, setProofs] = useState<EnrichedProof[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  const [selectedProof, setSelectedProof] = useState<EnrichedProof | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [imageModalProof, setImageModalProof] = useState<EnrichedProof | null>(null)

  // Live subscription
  useEffect(() => {
    setLoading(true)
    const unsub = subscribeToProofs(statusFilter, async (raw) => {
      // Enrich with user data (fire parallel lookups, cache by userId)
      const userCache: Record<string, { email?: string; fullName?: string }> = {}
      const enriched = await Promise.all(
        raw.map(async (p) => {
          if (!userCache[p.userId]) {
            try {
              const user = await fetchUserById(p.userId)
              userCache[p.userId] = {
                email: user?.email,
                fullName: user?.full_name,
              }
            } catch {
              userCache[p.userId] = {}
            }
          }
          return {
            ...p,
            userEmail: userCache[p.userId]?.email,
            userFullName: userCache[p.userId]?.fullName,
          }
        }),
      )
      setProofs(enriched)
      setLoading(false)
    })
    return () => unsub()
  }, [statusFilter])

  // Stats
  useEffect(() => {
    setStatsLoading(true)
    fetchProofStats().then((s) => {
      setStats(s)
      setStatsLoading(false)
    })
  }, [proofs]) // refresh stats when list changes

  const approveMutation = useMutation({
    mutationFn: ({ proof }: { proof: EnrichedProof }) =>
      approveProof(proof.id, proof.userId, proof.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-proofs'] })
      setSelectedProof(null)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ proofId, note }: { proofId: string; note?: string }) =>
      rejectProof(proofId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-proofs'] })
      setShowRejectModal(false)
      setRejectNote('')
      setSelectedProof(null)
    },
  })

  function openRejectModal(proof: EnrichedProof) {
    setSelectedProof(proof)
    setRejectNote('')
    setShowRejectModal(true)
  }

  const filteredProofs = useMemo(() => proofs, [proofs])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Proof Verification</h1>
        <p className="text-gray-400 text-sm mt-1">
          Review PayPal payment screenshots uploaded by users and approve or reject access.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-900/60"
          loading={statsLoading}
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-5 h-5 text-green-400" />}
          iconBg="bg-green-900/60"
          loading={statsLoading}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-900/60"
          loading={statsLoading}
        />
        <StatCard
          title="Total Submissions"
          value={stats.total}
          icon={<Users className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-900/60"
          loading={statsLoading}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-1">
        {(['pending', 'approved', 'rejected', 'all'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
              statusFilter === s
                ? 'bg-brand-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {s === 'all' ? 'All' : s}
            {s === 'pending' && stats.pending > 0 && (
              <span className="ml-2 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Proofs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : filteredProofs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No {statusFilter === 'all' ? '' : statusFilter} payment proofs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProofs.map((proof) => (
            <ProofCard
              key={proof.id}
              proof={proof}
              onApprove={() => approveMutation.mutate({ proof })}
              onReject={() => openRejectModal(proof)}
              onViewImage={() => setImageModalProof(proof)}
              approveLoading={approveMutation.isPending && approveMutation.variables?.proof.id === proof.id}
              rejectLoading={rejectMutation.isPending && rejectMutation.variables?.proofId === proof.id}
            />
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        open={showRejectModal}
        title="Reject Payment Proof"
        onClose={() => {
          setShowRejectModal(false)
          setRejectNote('')
        }}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Rejecting proof for{' '}
            <span className="text-white font-medium">
              {selectedProof?.userEmail ?? selectedProof?.userId}
            </span>
            . The user will need to re-upload a new screenshot.
          </p>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rejection note (optional)</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              rows={3}
              placeholder="e.g. Screenshot is blurry, payment amount doesn't match…"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowRejectModal(false)
                setRejectNote('')
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                selectedProof &&
                rejectMutation.mutate({ proofId: selectedProof.id, note: rejectNote || undefined })
              }
              disabled={rejectMutation.isPending || !selectedProof}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {rejectMutation.isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
              Confirm Reject
            </button>
          </div>
        </div>
      </Modal>

      {/* Image Lightbox */}
      <Modal
        open={imageModalProof !== null}
        title="Payment Screenshot"
        onClose={() => setImageModalProof(null)}
      >
        {imageModalProof && (
          <div className="space-y-3">
            <img
              src={imageModalProof.imageUrl}
              alt="Payment proof"
              className="w-full rounded-lg object-contain max-h-[70vh]"
            />
            <a
              href={imageModalProof.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-brand-400 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Open full size
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── Proof Card ───────────────────────────────────────────────────────────────

interface ProofCardProps {
  proof: EnrichedProof
  onApprove: () => void
  onReject: () => void
  onViewImage: () => void
  approveLoading: boolean
  rejectLoading: boolean
}

function ProofCard({
  proof,
  onApprove,
  onReject,
  onViewImage,
  approveLoading,
  rejectLoading,
}: ProofCardProps) {
  const isPending = proof.status === 'pending'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
      {/* Screenshot thumbnail */}
      <button
        className="relative w-full h-44 bg-gray-800 overflow-hidden flex items-center justify-center group"
        onClick={onViewImage}
      >
        <img
          src={proof.imageUrl}
          alt="Payment proof thumbnail"
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <span className="text-white text-xs font-medium px-3 py-1 bg-black/60 rounded-full">
            View Full Screenshot
          </span>
        </div>
      </button>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Status + type */}
        <div className="flex items-center justify-between">
          <StatusBadge status={proof.status} />
          <Badge variant="info" className="capitalize">{proof.type}</Badge>
        </div>

        {/* User info */}
        <div>
          <p className="text-white text-sm font-medium truncate">
            {proof.userFullName ?? 'Unknown User'}
          </p>
          <p className="text-gray-500 text-xs truncate">{proof.userEmail ?? proof.userId}</p>
        </div>

        {/* Date */}
        <p className="text-gray-600 text-xs">{formatDateTime(proof.createdAt)}</p>

        {/* Actions — only for pending */}
        {isPending && (
          <div className="flex gap-2 mt-auto">
            <button
              onClick={onApprove}
              disabled={approveLoading || rejectLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {approveLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              Approve
            </button>
            <button
              onClick={onReject}
              disabled={approveLoading || rejectLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {rejectLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: ProofStatus }) {
  if (status === 'approved') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-400">
        <CheckCircle className="w-3.5 h-3.5" /> Approved
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-400">
        <XCircle className="w-3.5 h-3.5" /> Rejected
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-yellow-400">
      <Clock className="w-3.5 h-3.5" /> Pending
    </span>
  )
}
