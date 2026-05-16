import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Pencil, Trash2, Upload, X, ChevronUp, ChevronDown,
  AlignLeft, Heading2, List, ImageOff, GripVertical,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchArticles, createArticle, updateArticle, deleteArticle,
  uploadArticleImage, deleteArticleImage,
} from '../../services/firebase/articles'
import type { Article, ContentBlock } from '../../data/articles'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { PageSpinner } from '../../components/ui/Spinner'

// ─── Block editor helpers ──────────────────────────────────────────────────

function emptyBlock(type: ContentBlock['type']): ContentBlock {
  if (type === 'paragraph') return { type: 'paragraph', text: '' }
  if (type === 'heading') return { type: 'heading', text: '' }
  return { type: 'list', items: [''] }
}

const BLOCK_META: Record<ContentBlock['type'], { label: string; color: string; Icon: React.ElementType }> = {
  paragraph: { label: 'Paragraph', color: 'bg-blue-900/50 text-blue-300 border-blue-800/60', Icon: AlignLeft },
  heading:   { label: 'Heading',   color: 'bg-purple-900/50 text-purple-300 border-purple-800/60', Icon: Heading2 },
  list:      { label: 'List',      color: 'bg-green-900/50 text-green-300 border-green-800/60', Icon: List },
}

// ─── Block editor row ─────────────────────────────────────────────────────

interface BlockRowProps {
  block: ContentBlock
  index: number
  total: number
  onChange: (b: ContentBlock) => void
  onMove: (dir: 'up' | 'down') => void
  onRemove: () => void
}

function BlockRow({ block, index, total, onChange, onMove, onRemove }: BlockRowProps) {
  const meta = BLOCK_META[block.type]
  const baseTextarea = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none'

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      {/* Block header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 border-b border-gray-700">
        <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${meta.color}`}>
          <meta.Icon className="w-3 h-3" />
          {meta.label}
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block content */}
      <div className="p-3 bg-gray-800/30">
        {block.type === 'heading' && (
          <input
            value={block.text}
            onChange={(e) => onChange({ type: 'heading', text: e.target.value })}
            placeholder="Section heading..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        )}
        {block.type === 'paragraph' && (
          <textarea
            value={block.text}
            rows={3}
            onChange={(e) => onChange({ type: 'paragraph', text: e.target.value })}
            placeholder="Paragraph text..."
            className={baseTextarea}
          />
        )}
        {block.type === 'list' && (
          <div>
            <textarea
              value={block.items.join('\n')}
              rows={4}
              onChange={(e) => {
                const items = e.target.value.split('\n')
                onChange({ type: 'list', items })
              }}
              placeholder="One item per line..."
              className={baseTextarea}
            />
            <p className="mt-1 text-xs text-gray-600">Each line becomes a bullet point</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────

type ModalMode = 'create' | 'edit' | null

function defaultForm() {
  return {
    title: '',
    subtitle: '',
    imageAlt: '',
    order: 1,
    blocks: [] as ContentBlock[],
    // image tracking
    imageFile: null as File | null,
    imagePreview: '',     // object URL for new file preview
    existingImageUrl: '', // URL already stored in Firestore
    imageRemoved: false,
  }
}

export default function ArticlesAdminPage() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<ModalMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null)

  const [form, setForm] = useState(defaultForm())

  // ── Query ──────────────────────────────────────────────────────────────
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: fetchArticles,
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, image }: { id: string; image?: string }) =>
      deleteArticle(id, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-articles'] })
      qc.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Article deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  // ── Open modals ────────────────────────────────────────────────────────
  function openCreate() {
    setForm({ ...defaultForm(), order: articles.length + 1 })
    setEditingId(null)
    setMode('create')
  }

  function openEdit(article: Article) {
    setForm({
      title: article.title,
      subtitle: article.subtitle ?? '',
      imageAlt: article.imageAlt ?? '',
      order: article.order,
      blocks: article.content.map((b) =>
        b.type === 'list' ? { ...b, items: [...b.items] } : { ...b }
      ),
      imageFile: null,
      imagePreview: '',
      existingImageUrl: article.image ?? '',
      imageRemoved: false,
    })
    setEditingId(article.id)
    setMode('edit')
  }

  function closeModal() {
    setMode(null)
    setEditingId(null)
    setForm(defaultForm())
  }

  // ── Image handlers ─────────────────────────────────────────────────────
  function handleImageFile(file: File) {
    setForm((f) => ({
      ...f,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      imageRemoved: false,
    }))
  }

  function removeImage() {
    setForm((f) => ({
      ...f,
      imageFile: null,
      imagePreview: '',
      existingImageUrl: '',
      imageRemoved: true,
    }))
  }

  // ── Block handlers ─────────────────────────────────────────────────────
  function addBlock(type: ContentBlock['type']) {
    setForm((f) => ({ ...f, blocks: [...f.blocks, emptyBlock(type)] }))
  }

  function updateBlock(i: number, updated: ContentBlock) {
    setForm((f) => ({ ...f, blocks: f.blocks.map((b, idx) => idx === i ? updated : b) }))
  }

  function removeBlock(i: number) {
    setForm((f) => ({ ...f, blocks: f.blocks.filter((_, idx) => idx !== i) }))
  }

  function moveBlock(i: number, dir: 'up' | 'down') {
    setForm((f) => {
      const arr = [...f.blocks]
      const swap = dir === 'up' ? i - 1 : i + 1
      if (swap < 0 || swap >= arr.length) return f
      ;[arr[i], arr[swap]] = [arr[swap], arr[i]]
      return { ...f, blocks: arr }
    })
  }

  // ── Clean blocks before save (trim, filter empty list items) ──────────
  function cleanBlocks(blocks: ContentBlock[]): ContentBlock[] {
    return blocks
      .map((b): ContentBlock => {
        if (b.type === 'paragraph') return { type: 'paragraph', text: b.text.trim() }
        if (b.type === 'heading') return { type: 'heading', text: b.text.trim() }
        return {
          type: 'list',
          items: b.items.map((s) => s.trim()).filter((s) => s.length > 0),
        }
      })
      .filter((b) => {
        if (b.type === 'list') return b.items.length > 0
        return b.text.length > 0
      })
  }

  // ── Save ───────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (form.order < 1) { toast.error('Order must be at least 1'); return }

    setSaving(true)
    try {
      // Resolve final image URL
      let imageUrl: string | undefined = form.existingImageUrl || undefined

      if (form.imageFile) {
        // Delete old image from storage if replacing
        if (form.existingImageUrl) await deleteArticleImage(form.existingImageUrl)
        imageUrl = await uploadArticleImage(form.imageFile)
      } else if (form.imageRemoved && form.existingImageUrl) {
        // Image was explicitly removed; old was already cleared from existingImageUrl
        imageUrl = undefined
      }

      const payload: Omit<Article, 'id'> = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        image: imageUrl,
        imageAlt: form.imageAlt.trim() || undefined,
        order: form.order,
        content: cleanBlocks(form.blocks),
      }

      if (mode === 'create') {
        await createArticle(payload)
        toast.success('Article created')
      } else if (editingId) {
        await updateArticle(editingId, payload)
        toast.success('Article updated')
      }

      qc.invalidateQueries({ queryKey: ['admin-articles'] })
      qc.invalidateQueries({ queryKey: ['articles'] })
      closeModal()
    } catch {
      toast.error('Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  const currentImage = form.imagePreview || form.existingImageUrl

  // ── Render ─────────────────────────────────────────────────────────────
  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-gray-400 text-sm mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} published
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          New Article
        </Button>
      </div>

      {/* Articles list */}
      {articles.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
          <AlignLeft className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No articles yet</p>
          <p className="text-gray-600 text-sm mt-1">Click "New Article" to create the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Order badge */}
              <div className="w-9 h-9 bg-brand-900/60 rounded-lg flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">
                {article.order}
              </div>

              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 flex items-center justify-center">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.imageAlt ?? article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{article.title}</p>
                {article.subtitle && (
                  <p className="text-gray-500 text-xs truncate mt-0.5">{article.subtitle}</p>
                )}
                <p className="text-gray-600 text-xs mt-1">
                  {article.content.length} block{article.content.length !== 1 ? 's' : ''}
                  {article.image ? ' · has image' : ' · no image'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(article)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(article)}
                  className="p-1.5 rounded-lg text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────────────── */}
      <Modal
        open={mode !== null}
        onClose={closeModal}
        title={mode === 'create' ? 'New Article' : 'Edit Article'}
        size="xl"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>
              {mode === 'create' ? 'Publish Article' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* ── Basic info ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Title *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Article title..."
              />
            </div>
            <Input
              label="Order"
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 1 }))}
              hint="Display position (1 = first)"
            />
          </div>

          <Input
            label="Subtitle (optional)"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="A short descriptive line under the title..."
          />

          {/* ── Image ─────────────────────────────────────────────────── */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">
              Image <span className="text-gray-600 font-normal">(optional)</span>
            </p>

            {currentImage ? (
              <div className="relative inline-block">
                <img
                  src={currentImage}
                  alt="preview"
                  className="h-40 w-auto max-w-full rounded-xl object-contain border border-gray-700 bg-gray-800 p-2"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="p-1.5 bg-gray-900/90 rounded-lg text-gray-300 hover:text-white border border-gray-700 transition-colors"
                    title="Change image"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={removeImage}
                    className="p-1.5 bg-red-900/80 rounded-lg text-red-300 hover:text-red-100 border border-red-800 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-400 hover:border-brand-500 hover:text-brand-400 transition-colors"
              >
                <Upload className="w-7 h-7" />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs text-gray-600">PNG, JPG, WEBP up to 5 MB</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
            />

            {currentImage && (
              <div className="mt-2">
                <Input
                  label="Image alt text (optional)"
                  value={form.imageAlt}
                  onChange={(e) => setForm((f) => ({ ...f, imageAlt: e.target.value }))}
                  placeholder="Describe the image for accessibility..."
                />
              </div>
            )}
          </div>

          {/* ── Content blocks ─────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-300">
                Content Blocks
                <span className="ml-2 text-xs text-gray-600">
                  ({form.blocks.length} block{form.blocks.length !== 1 ? 's' : ''})
                </span>
              </p>
              <div className="flex gap-2">
                {(['paragraph', 'heading', 'list'] as const).map((type) => {
                  const meta = BLOCK_META[type]
                  return (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-90 ${meta.color}`}
                    >
                      <meta.Icon className="w-3 h-3" />
                      + {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {form.blocks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center text-gray-600 text-sm">
                No content blocks yet. Use the buttons above to add paragraphs, headings, or lists.
              </div>
            ) : (
              <div className="space-y-2">
                {form.blocks.map((block, i) => (
                  <BlockRow
                    key={i}
                    block={block}
                    index={i}
                    total={form.blocks.length}
                    onChange={(updated) => updateBlock(i, updated)}
                    onMove={(dir) => moveBlock(i, dir)}
                    onRemove={() => removeBlock(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget &&
          deleteMutation.mutate({ id: deleteTarget.id, image: deleteTarget.image })
        }
        title="Delete Article"
        message={`Permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
