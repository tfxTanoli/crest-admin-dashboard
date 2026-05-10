import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, BookOpen, ShieldAlert, Pencil, Save, X } from 'lucide-react'
import {
  fetchLegalDocument,
  saveLegalDocument,
  type LegalDocType,
} from '../../services/firebase/legal'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const TABS: { id: LegalDocType; label: string; icon: typeof FileText }[] = [
  { id: 'privacy_policy', label: 'Privacy Policy', icon: FileText },
  { id: 'terms_conditions', label: 'Terms & Conditions', icon: BookOpen },
  { id: 'csae_policy', label: 'Child Safety (CSAE)', icon: ShieldAlert },
]

export default function LegalPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<LegalDocType>('privacy_policy')
  const [editOpen, setEditOpen] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editDate, setEditDate] = useState('')

  const { data: doc, isLoading } = useQuery({
    queryKey: ['legal', activeTab],
    queryFn: () => fetchLegalDocument(activeTab),
  })

  const saveMutation = useMutation({
    mutationFn: () => saveLegalDocument(activeTab, editContent, editDate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['legal', activeTab] })
      toast.success('Document saved')
      setEditOpen(false)
    },
    onError: () => toast.error('Failed to save'),
  })

  function openEdit() {
    setEditContent(doc?.content ?? '')
    setEditDate(
      doc?.lastUpdated ??
        new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    )
    setEditOpen(true)
  }

  const activeTabMeta = TABS.find((t) => t.id === activeTab)!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Legal Documents</h1>
          <p className="text-gray-400 text-sm mt-1">Manage Privacy Policy, Terms & Conditions, and CSAE Standards</p>
        </div>
        <Button icon={<Pencil className="w-4 h-4" />} onClick={openEdit}>
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-brand-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Document Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <activeTabMeta.icon className="w-4 h-4 text-brand-400" />
            <span className="text-white font-medium">{activeTabMeta.label}</span>
          </div>
          {doc?.lastUpdated && (
            <span className="text-xs text-gray-500">Last updated: {doc.lastUpdated}</span>
          )}
        </div>

        <div className="px-5 py-4">
          {isLoading ? (
            <PageSpinner />
          ) : doc?.content ? (
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-[60vh] overflow-y-auto">
              {doc.content}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
              <activeTabMeta.icon className="w-10 h-10 opacity-30" />
              <p className="text-sm">No override content saved. The public page uses the built-in default content.</p>
              <Button variant="ghost" icon={<Pencil className="w-4 h-4" />} onClick={openEdit}>
                Add Custom Content
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${activeTabMeta.label}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" icon={<X className="w-4 h-4" />} onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              icon={<Save className="w-4 h-4" />}
              loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
              disabled={!editContent.trim()}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Last Updated Date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            placeholder="e.g. 10 May 2026"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Content</label>
            <textarea
              rows={20}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y font-mono"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
