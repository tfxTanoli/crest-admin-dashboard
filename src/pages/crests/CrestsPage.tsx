import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'
import { fetchCrests, createCrest, updateCrest, uploadCrestImage, toggleCrestActive, deleteCrest } from '../../services/firebase/crests'
import type { CrestConfig } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function CrestsPage() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editCrest, setEditCrest] = useState<CrestConfig | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<CrestConfig | null>(null)

  const [newName, setNewName] = useState('')
  const [newFile, setNewFile] = useState<File | null>(null)
  const [newPreview, setNewPreview] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)

  const { data: crests = [], isLoading } = useQuery({
    queryKey: ['crests'],
    queryFn: fetchCrests,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleCrestActive(id, active),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crests'] }); toast.success('Updated') },
    onError: () => toast.error('Failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) => deleteCrest(id, url),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crests'] }); toast.success('Deleted'); setConfirmDelete(null) },
    onError: () => toast.error('Delete failed'),
  })

  function handleFileChange(file: File, type: 'new' | 'edit') {
    const url = URL.createObjectURL(file)
    if (type === 'new') { setNewFile(file); setNewPreview(url) }
    else { setEditFile(file); setEditPreview(url) }
  }

  async function handleCreate() {
    if (!newName.trim() || !newFile) { toast.error('Name and image required'); return }
    setCreating(true)
    try {
      await createCrest(newName.trim(), newFile)
      qc.invalidateQueries({ queryKey: ['crests'] })
      toast.success('Crest created')
      setCreateOpen(false)
      setNewName(''); setNewFile(null); setNewPreview(null)
    } catch { toast.error('Failed to create crest') }
    finally { setCreating(false) }
  }

  async function handleEdit() {
    if (!editCrest || !editName.trim()) return
    setEditing(true)
    try {
      const updates: Partial<CrestConfig> = { name: editName.trim() }
      if (editFile) {
        updates.image_url = await uploadCrestImage(editFile, editName)
      }
      await updateCrest(editCrest.id, updates)
      qc.invalidateQueries({ queryKey: ['crests'] })
      toast.success('Crest updated')
      setEditCrest(null); setEditFile(null); setEditPreview(null)
    } catch { toast.error('Failed to update') }
    finally { setEditing(false) }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Crest Management</h1>
          <p className="text-gray-400 text-sm mt-1">{crests.length} crests configured</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
          Add Crest
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {crests.map((crest) => (
          <div key={crest.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="aspect-square bg-gray-800 relative">
              {crest.image_url ? (
                <img src={crest.image_url} alt={crest.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                  🛡️
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={crest.active ? 'success' : 'danger'}>
                  {crest.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-white mb-3">{crest.name}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditCrest(crest); setEditName(crest.name); setEditPreview(crest.image_url) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => toggleMutation.mutate({ id: crest.id, active: !crest.active })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-colors ${
                    crest.active
                      ? 'text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/40'
                      : 'text-green-400 bg-green-900/20 hover:bg-green-900/40'
                  }`}
                >
                  {crest.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {crest.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setConfirmDelete(crest)}
                  className="p-1.5 rounded-lg text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setNewName(''); setNewFile(null); setNewPreview(null) }}
        title="Create Crest"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleCreate} disabled={!newName || !newFile}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Crest Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Lion" />
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Image</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'new')} />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center gap-2 text-gray-400 hover:border-brand-500 hover:text-brand-400 transition-colors"
            >
              {newPreview ? (
                <img src={newPreview} alt="preview" className="w-20 h-20 object-cover rounded-lg" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
              <span className="text-sm">{newFile ? newFile.name : 'Click to upload'}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editCrest}
        onClose={() => { setEditCrest(null); setEditFile(null); setEditPreview(null) }}
        title="Edit Crest"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditCrest(null)}>Cancel</Button>
            <Button loading={editing} onClick={handleEdit}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Crest Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Image</p>
            <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'edit')} />
            <button
              onClick={() => editFileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-700 rounded-xl p-4 flex items-center gap-3 text-gray-400 hover:border-brand-500 transition-colors"
            >
              {(editPreview) && (
                <img src={editPreview} alt="preview" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
              )}
              <span className="text-sm">{editFile ? editFile.name : 'Click to replace image'}</span>
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate({ id: confirmDelete.id, url: confirmDelete.image_url })}
        title="Delete Crest"
        message={`Permanently delete "${confirmDelete?.name}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
