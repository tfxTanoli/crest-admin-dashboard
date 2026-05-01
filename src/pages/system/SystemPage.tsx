import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import {
  fetchSystemConfigs,
  createSystemConfig,
  updateSystemConfig,
  deleteSystemConfig,
  toggleSystemConfig,
} from '../../services/firebase/system'
import type { SystemConfig } from '../../types'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function SystemPage() {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editConfig, setEditConfig] = useState<SystemConfig | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<SystemConfig | null>(null)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [editValue, setEditValue] = useState('')

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['system-configs'],
    queryFn: fetchSystemConfigs,
  })

  const createMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => createSystemConfig(key, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['system-configs'] })
      toast.success('Config created')
      setCreateOpen(false)
      setNewKey(''); setNewValue('')
    },
    onError: () => toast.error('Failed to create'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateSystemConfig(key, { value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['system-configs'] })
      toast.success('Config updated')
      setEditConfig(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const deleteMutation = useMutation({
    mutationFn: (key: string) => deleteSystemConfig(key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['system-configs'] })
      toast.success('Config deleted')
      setConfirmDelete(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ key, active }: { key: string; active: boolean }) =>
      toggleSystemConfig(key, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['system-configs'] })
    },
    onError: () => toast.error('Failed'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Config</h1>
          <p className="text-gray-400 text-sm mt-1">Manage system messages and configuration values</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
          Add Config
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {configs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-sm">No system configs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {configs.map((config) => (
              <div key={config.id ?? config.key} className="flex items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-brand-400 text-sm font-mono">{config.key}</code>
                    <Badge variant={config.active !== false ? 'success' : 'danger'}>
                      {config.active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm break-words">{config.value}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleMutation.mutate({ key: config.key, active: !(config.active !== false) })}
                    className={`p-1.5 rounded transition-colors ${
                      config.active !== false
                        ? 'text-yellow-400 hover:bg-yellow-900/20'
                        : 'text-green-400 hover:bg-green-900/20'
                    }`}
                    title={config.active !== false ? 'Deactivate' : 'Activate'}
                  >
                    {config.active !== false
                      ? <ToggleRight className="w-4 h-4" />
                      : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setEditConfig(config); setEditValue(config.value) }}
                    className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(config)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setNewKey(''); setNewValue('') }}
        title="Create System Config"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              loading={createMutation.isPending}
              onClick={() => createMutation.mutate({ key: newKey.trim(), value: newValue.trim() })}
              disabled={!newKey.trim() || !newValue.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Config Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="e.g. welcome_message"
            hint="Use snake_case format"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Value</label>
            <textarea
              rows={4}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Config value…"
              className="w-full px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editConfig}
        onClose={() => setEditConfig(null)}
        title={`Edit: ${editConfig?.key}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditConfig(null)}>Cancel</Button>
            <Button
              loading={updateMutation.isPending}
              onClick={() => editConfig && updateMutation.mutate({ key: editConfig.key, value: editValue.trim() })}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Value</label>
          <textarea
            rows={5}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.key)}
        title="Delete Config"
        message={`Delete config key "${confirmDelete?.key}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
