import { useState, useMemo, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, Banknote } from 'lucide-react'
import DataTable, { type Column } from '../../components/shared/DataTable'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { subscribeToWithdrawRequests, approveWithdrawal, rejectWithdrawal, markWithdrawalPaid } from '../../services/firebase/wallet'
import type { WithdrawRequest, WithdrawalStatus } from '../../types'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import toast from 'react-hot-toast'

const STATUS_BADGE: Record<WithdrawalStatus, 'warning' | 'success' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'info',
  rejected: 'danger',
  paid: 'success',
}

export default function WithdrawalsPage() {
  const qc = useQueryClient()
  const [requests, setRequests] = useState<WithdrawRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | ''>('')
  const [confirmApprove, setConfirmApprove] = useState<WithdrawRequest | null>(null)
  const [confirmReject, setConfirmReject] = useState<WithdrawRequest | null>(null)
  const [confirmPaid, setConfirmPaid] = useState<WithdrawRequest | null>(null)

  useEffect(() => {
    const unsub = subscribeToWithdrawRequests((data) => setRequests(data))
    return () => unsub()
  }, [])

  const filtered = useMemo(() =>
    statusFilter ? requests.filter((r) => r.status === statusFilter) : requests,
    [requests, statusFilter]
  )

  const approveMutation = useMutation({
    mutationFn: ({ id, userId, amount }: { id: string; userId: string; amount: number }) =>
      approveWithdrawal(id, userId, amount),
    onSuccess: () => { toast.success('Withdrawal approved'); setConfirmApprove(null) },
    onError: () => toast.error('Failed to approve'),
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectWithdrawal(id),
    onSuccess: () => { toast.success('Withdrawal rejected'); setConfirmReject(null) },
    onError: () => toast.error('Failed to reject'),
  })

  const paidMutation = useMutation({
    mutationFn: (id: string) => markWithdrawalPaid(id),
    onSuccess: () => { toast.success('Marked as paid'); setConfirmPaid(null) },
    onError: () => toast.error('Failed'),
  })

  const columns: Column<WithdrawRequest>[] = [
    {
      key: 'user',
      header: 'User ID',
      render: (r) => <span className="text-xs font-mono text-gray-400">{r.userId}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (r) => <span className="font-mono font-semibold text-white">{formatCurrency(r.amount)}</span>,
    },
    {
      key: 'bank',
      header: 'Bank Info',
      render: (r) => (
        <div className="text-xs text-gray-400">
          {r.bankInfo?.bankName && <p>{r.bankInfo.bankName}</p>}
          {r.bankInfo?.accountNumber && <p>{r.bankInfo.accountNumber}</p>}
          {r.bankInfo?.accountName && <p>{r.bankInfo.accountName}</p>}
          {!r.bankInfo?.bankName && '—'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_BADGE[r.status]}>{r.status}</Badge>,
    },
    {
      key: 'created',
      header: 'Requested',
      render: (r) => <span className="text-gray-500 text-xs">{formatDateTime(r.createdAt)}</span>,
    },
    {
      key: 'processed',
      header: 'Processed',
      render: (r) => <span className="text-gray-500 text-xs">{r.processedAt ? formatDateTime(r.processedAt) : '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.status === 'pending' && (
            <>
              <button
                onClick={() => setConfirmApprove(r)}
                className="p-1.5 rounded bg-green-900/30 text-green-400 hover:bg-green-900/60 transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmReject(r)}
                className="p-1.5 rounded bg-red-900/30 text-red-400 hover:bg-red-900/60 transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {r.status === 'approved' && (
            <button
              onClick={() => setConfirmPaid(r)}
              className="p-1.5 rounded bg-brand-900/30 text-brand-400 hover:bg-brand-900/60 transition-colors"
              title="Mark as Paid"
            >
              <Banknote className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Withdrawal Requests</h1>
        <p className="text-gray-400 text-sm mt-1">
          {pendingCount > 0 ? (
            <span className="text-yellow-400">{pendingCount} pending requests</span>
          ) : (
            'No pending requests'
          )}
        </p>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        emptyText="No withdrawal requests"
        actions={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WithdrawalStatus | '')}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'paid', label: 'Paid' },
            ].map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        }
      />

      <ConfirmDialog
        open={!!confirmApprove}
        onClose={() => setConfirmApprove(null)}
        onConfirm={() => confirmApprove && approveMutation.mutate({ id: confirmApprove.id, userId: confirmApprove.userId, amount: confirmApprove.amount })}
        title="Approve Withdrawal"
        message={`Approve ${formatCurrency(confirmApprove?.amount ?? 0)} withdrawal? This will deduct the amount from the user's wallet.`}
        confirmLabel="Approve"
        variant="warning"
        loading={approveMutation.isPending}
      />

      <ConfirmDialog
        open={!!confirmReject}
        onClose={() => setConfirmReject(null)}
        onConfirm={() => confirmReject && rejectMutation.mutate(confirmReject.id)}
        title="Reject Withdrawal"
        message={`Reject this ${formatCurrency(confirmReject?.amount ?? 0)} withdrawal request?`}
        confirmLabel="Reject"
        loading={rejectMutation.isPending}
      />

      <ConfirmDialog
        open={!!confirmPaid}
        onClose={() => setConfirmPaid(null)}
        onConfirm={() => confirmPaid && paidMutation.mutate(confirmPaid.id)}
        title="Mark as Paid"
        message={`Confirm ${formatCurrency(confirmPaid?.amount ?? 0)} has been paid to the user?`}
        confirmLabel="Mark Paid"
        variant="warning"
        loading={paidMutation.isPending}
      />
    </div>
  )
}
