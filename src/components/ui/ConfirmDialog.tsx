import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`w-6 h-6 flex-shrink-0 mt-0.5 ${variant === 'danger' ? 'text-red-400' : 'text-yellow-400'}`}
        />
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    </Modal>
  )
}
