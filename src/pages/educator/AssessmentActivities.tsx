import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { IconPicker } from '@/components/ui/icon-picker'
import { EmojiPicker } from '@/components/ui/emoji-picker'
import { educatorApi } from '@/services/educatorApi'
import type { Activity, ActivityOption } from '@/types/activities'

const ACTIVITY_TYPES = [
  { value: 'MCQ', label: 'Multiple Choice Question' },
] as const

const DOMAINS = [{ value: 'intelligence', label: 'Intelligence' }] as const

const ATTRIBUTES = [
  { value: 'linguistic', label: 'Linguistic Intelligence' },
  { value: 'logical-mathematical', label: 'Logical-Mathematical Intelligence' },
  { value: 'spatial', label: 'Spatial Intelligence' },
  { value: 'musical', label: 'Musical Intelligence' },
  { value: 'bodily-kinesthetic', label: 'Bodily-Kinesthetic Intelligence' },
  { value: 'interpersonal', label: 'Interpersonal Intelligence' },
  { value: 'intrapersonal', label: 'Intrapersonal Intelligence' },
  { value: 'naturalistic', label: 'Naturalistic Intelligence' },
] as const

const DEFAULT_MCQ_OPTIONS: Omit<ActivityOption, 'value'>[] = [
  { emoji: '😊', label: 'Completely agree', scoreAdjustment: 5 },
  { emoji: '🙂', label: 'Somewhat agree', scoreAdjustment: 2 },
  { emoji: '😐', label: 'Unsure', scoreAdjustment: 0 },
  { emoji: '😕', label: 'Somewhat disagree', scoreAdjustment: -2 },
  { emoji: '😢', label: 'Completely disagree', scoreAdjustment: -5 },
]

interface OptionFormItem {
  emoji: string
  label: string
  scoreAdjustment: number
}

interface FormData {
  type: string
  domain: string
  attribute: string
  label: string
  icon: string
  title: string
  subtitle: string
  snippet: string
  description: string
  paragraph1: string
  paragraph2: string
  media: string
  options: OptionFormItem[]
}

const selectClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

const emptyForm: FormData = {
  type: 'MCQ',
  domain: 'intelligence',
  attribute: '',
  label: '',
  icon: '',
  title: '',
  subtitle: '',
  snippet: '',
  description: '',
  paragraph1: '',
  paragraph2: '',
  media: '',
  options: DEFAULT_MCQ_OPTIONS.map(o => ({ ...o })),
}

export default function AssessmentActivities() {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const navigate = useNavigate()
  const [activities, setActivities] = useState<Activity[]>([])
  const [assessmentName, setAssessmentName] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Activity | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    if (!assessmentId) return
    try {
      setLoading(true)
      const [activitiesData, assessmentData] = await Promise.all([
        educatorApi.fetchActivities(assessmentId),
        educatorApi.fetchAssessmentById(assessmentId),
      ])
      setActivities(Array.isArray(activitiesData) ? activitiesData : [])
      setAssessmentName(assessmentData?.name || 'Assessment')
    } catch (err) {
      console.error('Failed to load activities:', err)
    } finally {
      setLoading(false)
    }
  }, [assessmentId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openAdd = () => {
    setEditing(null)
    setFormData({
      ...emptyForm,
      options: DEFAULT_MCQ_OPTIONS.map(o => ({ ...o })),
    })
    setDialogOpen(true)
  }

  const openEdit = (activity: Activity) => {
    setEditing(activity)
    const meta = activity.metadata || {}
    const text = (meta.text as string) || ''
    setFormData({
      type: activity.type || 'MCQ',
      domain: activity.domain || 'intelligence',
      attribute: activity.attribute || '',
      label: meta.label || '',
      icon: meta.icon || '',
      title: meta.title || text,
      subtitle: meta.subtitle || '',
      snippet: meta.snippet || '',
      description: meta.description || '',
      paragraph1: meta.paragraph1 || '',
      paragraph2: meta.paragraph2 || '',
      media: meta.media || '',
      options: Array.isArray(meta.options)
        ? meta.options.map((o: any) => ({
            emoji: o.emoji || '',
            label: o.label || '',
            scoreAdjustment: Number(o.scoreAdjustment) || 0,
          }))
        : DEFAULT_MCQ_OPTIONS.map(o => ({ ...o })),
    })
    setDialogOpen(true)
  }

  const updateOption = (
    idx: number,
    field: keyof OptionFormItem,
    val: string | number
  ) => {
    setFormData(f => {
      const opts = [...f.options]
      opts[idx] = { ...opts[idx], [field]: val }
      return { ...f, options: opts }
    })
  }

  const removeOption = (idx: number) => {
    setFormData(f => ({
      ...f,
      options: f.options.filter((_, i) => i !== idx),
    }))
  }

  const addOption = () => {
    setFormData(f => ({
      ...f,
      options: [...f.options, { emoji: '', label: '', scoreAdjustment: 0 }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assessmentId) return
    setSubmitting(true)
    try {
      const domainDisplay =
        ATTRIBUTES.find(a => a.value === formData.attribute)?.label ||
        formData.attribute

      const numberedOptions: ActivityOption[] = formData.options.map((o, idx) => ({
        ...o,
        value: idx + 1,
      }))

      const payload = {
        type: formData.type,
        domain: formData.domain,
        attribute: formData.attribute || undefined,
        label: formData.label || undefined,
        icon: formData.icon || undefined,
        title: formData.title || undefined,
        subtitle: formData.subtitle || undefined,
        snippet: formData.snippet || undefined,
        description: formData.description || undefined,
        paragraph1: formData.paragraph1 || undefined,
        paragraph2: formData.paragraph2 || undefined,
        media: formData.media || undefined,
        metadata: {
          text: formData.title || undefined,
          domainDisplayName: domainDisplay,
          options: numberedOptions,
        },
      }

      if (editing) {
        await educatorApi.updateActivity(editing.id, payload)
      } else {
        await educatorApi.createActivity({ assessmentId, ...payload })
      }
      setDialogOpen(false)
      await loadData()
    } catch (err) {
      console.error('Failed to save activity:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (activity: Activity) => {
    if (!window.confirm('Delete this activity?')) return
    try {
      await educatorApi.deleteActivity(activity.id)
      await loadData()
    } catch (err) {
      console.error('Failed to delete activity:', err)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground'>Loading activities...</p>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate('/dashboard/assessments')}
        >
          <ArrowLeft className='size-4' />
        </Button>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold text-foreground'>
            {assessmentName}
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage activities for this assessment.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className='size-4' />
          Add Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className='text-center py-20 border rounded-lg'>
          <p className='text-muted-foreground mb-4'>
            No activities in this assessment yet.
          </p>
          <Button onClick={openAdd}>
            <Plus className='size-4' />
            Add first activity
          </Button>
        </div>
      ) : (
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attribute</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Media</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map(activity => {
                const meta = activity.metadata || {}
                const options = Array.isArray(meta.options) ? meta.options : []
                return (
                  <TableRow key={activity.id}>
                    <TableCell className='max-w-xs truncate'>
                      {meta.title || (meta.text as string) || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{activity.type}</Badge>
                    </TableCell>
                    <TableCell className='capitalize'>
                      {activity.attribute || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>{options.length}</Badge>
                    </TableCell>
                    <TableCell>
                      {meta.media ? (
                        <Badge variant='secondary'>Yes</Badge>
                      ) : (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          onClick={() => openEdit(activity)}
                        >
                          <Pencil className='size-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          onClick={() => handleDelete(activity)}
                        >
                          <Trash2 className='size-4 text-destructive' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-2xl max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Activity' : 'Add Activity'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='act-type'>Type</Label>
              <select
                id='act-type'
                value={formData.type}
                onChange={e =>
                  setFormData(f => ({ ...f, type: e.target.value }))
                }
                className={selectClass}
                required
              >
                {ACTIVITY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-domain'>Domain</Label>
              <select
                id='act-domain'
                value={formData.domain}
                onChange={e =>
                  setFormData(f => ({ ...f, domain: e.target.value }))
                }
                className={selectClass}
                required
              >
                {DOMAINS.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-attr'>Attribute</Label>
              <select
                id='act-attr'
                value={formData.attribute}
                onChange={e =>
                  setFormData(f => ({ ...f, attribute: e.target.value }))
                }
                className={selectClass}
                required
              >
                <option value='' disabled>
                  Select...
                </option>
                {ATTRIBUTES.map(a => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='act-label'>Label</Label>
                <Input
                  id='act-label'
                  value={formData.label}
                  onChange={e =>
                    setFormData(f => ({ ...f, label: e.target.value }))
                  }
                  placeholder='Display label'
                />
              </div>
              <div className='space-y-2'>
                <Label>Icon</Label>
                <IconPicker
                  value={formData.icon}
                  onChange={name => setFormData(f => ({ ...f, icon: name }))}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-title'>Title</Label>
              <Input
                id='act-title'
                value={formData.title}
                onChange={e =>
                  setFormData(f => ({ ...f, title: e.target.value }))
                }
                placeholder='Activity title'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-subtitle'>Subtitle</Label>
              <Input
                id='act-subtitle'
                value={formData.subtitle}
                onChange={e =>
                  setFormData(f => ({ ...f, subtitle: e.target.value }))
                }
                placeholder='Short subtitle'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-snippet'>Snippet</Label>
              <Textarea
                id='act-snippet'
                value={formData.snippet}
                onChange={e =>
                  setFormData(f => ({ ...f, snippet: e.target.value }))
                }
                placeholder='Brief summary snippet'
                rows={2}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-description'>Description</Label>
              <Textarea
                id='act-description'
                value={formData.description}
                onChange={e =>
                  setFormData(f => ({ ...f, description: e.target.value }))
                }
                placeholder='Full description'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-p1'>Paragraph 1</Label>
              <Textarea
                id='act-p1'
                value={formData.paragraph1}
                onChange={e =>
                  setFormData(f => ({ ...f, paragraph1: e.target.value }))
                }
                placeholder='First paragraph of content'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-p2'>Paragraph 2</Label>
              <Textarea
                id='act-p2'
                value={formData.paragraph2}
                onChange={e =>
                  setFormData(f => ({ ...f, paragraph2: e.target.value }))
                }
                placeholder='Second paragraph of content'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='act-media'>Media</Label>
              <Textarea
                id='act-media'
                value={formData.media}
                onChange={e =>
                  setFormData(f => ({ ...f, media: e.target.value }))
                }
                placeholder='Mermaid diagram, image URL, or other media content'
                rows={4}
              />
            </div>

            {formData.type === 'MCQ' && (
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Label>Options</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addOption}
                  >
                    <Plus className='size-3 mr-1' />
                    Add Option
                  </Button>
                </div>
                {formData.options.length > 0 && (
                  <div className='grid grid-cols-[2.5rem_1fr_5rem_2rem] gap-2 text-xs text-muted-foreground px-1'>
                    <span>Emoji</span>
                    <span>Label</span>
                    <span>Score</span>
                    <span />
                  </div>
                )}
                <div className='space-y-2'>
                  {formData.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className='grid grid-cols-[2.5rem_1fr_5rem_2rem] gap-2 items-center'
                    >
                      <EmojiPicker
                        value={opt.emoji}
                        onChange={emoji => updateOption(idx, 'emoji', emoji)}
                        className='size-9'
                      />
                      <Input
                        value={opt.label}
                        onChange={e =>
                          updateOption(idx, 'label', e.target.value)
                        }
                        placeholder='Option label'
                      />
                      <Input
                        type='number'
                        value={opt.scoreAdjustment}
                        onChange={e =>
                          updateOption(
                            idx,
                            'scoreAdjustment',
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder='Score'
                        title='Score Adjustment'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-sm'
                        onClick={() => removeOption(idx)}
                        className='text-destructive'
                      >
                        <X className='size-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
