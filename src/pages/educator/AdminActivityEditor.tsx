import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Plus, X } from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from 'react-resizable-panels'
import { cn } from '@/lib/utils'
import { educatorApi } from '@/services/educatorApi'
import { DOMAINS, ATTRIBUTES_BY_DOMAIN, ACTIVITY_TYPES } from '@/constants/activity-constants'
import { IconPicker, Icon, type IconName } from '@/components/ui/icon-picker'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { FluidContentPanel } from '@/components/sections/FluidContentPanel'
import { mapActivitiesToDotData } from '@/lib/mapActivityToPresentationItem'
import type { ApiActivity } from '@/lib/mapActivityToPresentationItem'
import { useSlideState } from '@/hooks/useSlideState'
import { useTheme } from '@/contexts/ThemeContext'
import type { DotData } from '@/types/dot'
import type { ActivityMetadata, ActivityOption } from '@/types/activities'

// --- Inline components ---

const ghost =
  'bg-transparent border-none outline-none w-full cursor-text transition-colors ' +
  'hover:bg-primary/5 focus:bg-primary/5 rounded px-1 py-0.5 resize-none overflow-hidden ' +
  'placeholder:text-muted-foreground/30'

const WORD_LIMITS: Record<string, number> = {
  tinyText: 1,
  label: 2,
  title: 15,
  subtitle: 10,
  largeText: 100,
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

function WordCount({ field, value }: { field: string; value: string }) {
  const limit = WORD_LIMITS[field]
  if (!limit) return null
  const count = countWords(value)
  const over = count > limit
  const near = !over && count >= limit * 0.85
  return (
    <span
      className={cn(
        'text-[10px] tabular-nums transition-colors select-none',
        over
          ? 'text-destructive'
          : near
            ? 'text-amber-500'
            : 'text-muted-foreground/30'
      )}
    >
      {count}/{limit}
    </span>
  )
}

function GhostTextarea({
  className,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      className={`${ghost} ${className ?? ''}`}
      {...props}
    />
  )
}

interface EditableActivityContentProps {
  activityId: string
  metadata: ActivityMetadata
  saving: boolean
  onFieldChange: (field: string, value: string) => void
  onFieldBlur: (field: string, value: string) => void
}

function EditableActivityContent({
  metadata,
  onFieldChange,
  onFieldBlur,
}: EditableActivityContentProps) {
  const largeTextValue = Array.isArray(metadata.largeText)
    ? metadata.largeText.join('\n\n')
    : ((metadata.largeText as string) ?? '')

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='flex gap-4 lg:gap-8 p-4 lg:p-12 overflow-y-auto h-full w-full'>
        {/* Left: text fields */}
        <div className='flex-1 flex flex-col justify-center space-y-2 lg:space-y-4 min-w-0'>
          {/* tinyText */}
          <div>
            <GhostTextarea
              value={metadata.tinyText ?? ''}
              placeholder='Activity label…'
              onChange={e => onFieldChange('tinyText', e.target.value)}
              onBlur={e => onFieldBlur('tinyText', e.target.value)}
              className='text-xs text-muted-foreground'
            />
            <div className='flex justify-end px-1'>
              <WordCount field='tinyText' value={metadata.tinyText ?? ''} />
            </div>
          </div>

          {/* label badge */}
          <div>
            <GhostTextarea
              value={metadata.label ?? ''}
              placeholder='Category'
              onChange={e => onFieldChange('label', e.target.value)}
              onBlur={e => onFieldBlur('label', e.target.value)}
              className='bg-primary/10 text-primary text-xs lg:text-sm font-semibold uppercase tracking-wider px-2.5 py-1 rounded-xl transition-colors hover:bg-primary/20 focus:bg-primary/20 placeholder:text-primary/30'
            />
            <div className='flex justify-end px-1'>
              <WordCount field='label' value={metadata.label ?? ''} />
            </div>
          </div>

          {/* title */}
          <div>
            <GhostTextarea
              value={metadata.title ?? ''}
              placeholder='Title…'
              onChange={e => onFieldChange('title', e.target.value)}
              onBlur={e => onFieldBlur('title', e.target.value)}
              className='text-xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight'
            />
            <div className='flex justify-end px-1'>
              <WordCount field='title' value={metadata.title ?? ''} />
            </div>
          </div>

          {/* subtitle */}
          <div>
            <GhostTextarea
              value={metadata.subtitle ?? ''}
              placeholder='Subtitle…'
              onChange={e => onFieldChange('subtitle', e.target.value)}
              onBlur={e => onFieldBlur('subtitle', e.target.value)}
              className='text-sm lg:text-lg text-primary/80 font-medium italic'
            />
            <div className='flex justify-end px-1'>
              <WordCount field='subtitle' value={metadata.subtitle ?? ''} />
            </div>
          </div>

          {/* largeText */}
          <div>
            <GhostTextarea
              value={largeTextValue}
              placeholder={
                'Body text…\n\nSeparate paragraphs with a blank line.'
              }
              onChange={e => onFieldChange('largeText', e.target.value)}
              onBlur={e => onFieldBlur('largeText', e.target.value)}
              className='text-base leading-relaxed text-foreground/90'
            />
            <div className='flex justify-end px-1'>
              <WordCount field='largeText' value={largeTextValue} />
            </div>
          </div>
        </div>

        {/* Right: media */}
        <div className='w-1/3 lg:w-1/5 flex flex-col justify-center shrink-0'>
          <GhostTextarea
            value={metadata.media ?? ''}
            placeholder={'graph TD\n  A-->B'}
            onChange={e => onFieldChange('media', e.target.value)}
            onBlur={e => onFieldBlur('media', e.target.value)}
            className='text-sm font-mono text-foreground/70'
          />
        </div>
      </div>
    </div>
  )
}

const fieldLabel = 'block text-xs font-medium text-muted-foreground mb-1'
const fieldSelect =
  'w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm ' +
  'focus:outline-none focus:ring-1 focus:ring-ring transition-colors'

interface EditableOptionsPanelProps {
  domain: string
  attribute: string
  activityType: string
  options: ActivityOption[]
  onDomainChange: (value: string) => void
  onAttributeChange: (value: string) => void
  onActivityTypeChange: (value: string) => void
  onOptionChange: (
    idx: number,
    field: keyof ActivityOption,
    value: string | number
  ) => void
  onOptionBlur: (idx: number) => void
  onAddOption: () => void
  onDeleteOption: (idx: number) => void
}

function EditableOptionsPanel({
  domain,
  attribute,
  activityType,
  options,
  onDomainChange,
  onAttributeChange,
  onActivityTypeChange,
  onOptionChange,
  onOptionBlur,
  onAddOption,
  onDeleteOption,
}: EditableOptionsPanelProps) {
  const domainAttributes = ATTRIBUTES_BY_DOMAIN[domain] ?? []

  return (
    <div className='h-full overflow-y-auto p-4 space-y-4'>
      {/* Domain */}
      <div>
        <label htmlFor='field-domain' className={fieldLabel}>
          Domain
        </label>
        <select
          id='field-domain'
          value={domain}
          onChange={e => onDomainChange(e.target.value)}
          className={fieldSelect}
        >
          {DOMAINS.map(d => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Attribute */}
      <div>
        <label htmlFor='field-attribute' className={fieldLabel}>
          Attribute
        </label>
        <select
          id='field-attribute'
          value={attribute}
          onChange={e => onAttributeChange(e.target.value)}
          className={fieldSelect}
        >
          <option value='' disabled>
            Select attribute…
          </option>
          {domainAttributes.map(a => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Type */}
      <div>
        <label htmlFor='field-activity-type' className={fieldLabel}>
          Activity Type
        </label>
        <select
          id='field-activity-type'
          value={activityType}
          onChange={e => onActivityTypeChange(e.target.value)}
          className={fieldSelect}
        >
          {ACTIVITY_TYPES.map(t => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Options */}
      <div>
        <p className={fieldLabel}>Options</p>
        <div className='space-y-1'>
          {options.map((opt, idx) => (
            <div
              key={idx}
              className='flex items-center gap-2 rounded-lg border border-input bg-background px-2 py-1.5'
            >
              <IconPicker
                value={opt.emoji as IconName | undefined}
                onValueChange={name => onOptionChange(idx, 'emoji', name)}
                triggerPlaceholder=''
              >
                <button
                  type='button'
                  className='w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors shrink-0'
                  title='Pick icon'
                >
                  {opt.emoji ? (
                    <Icon name={opt.emoji as IconName} className='size-4' />
                  ) : (
                    <span className='text-muted-foreground/30 text-base leading-none'>?</span>
                  )}
                </button>
              </IconPicker>
              <input
                value={opt.label}
                onChange={e => onOptionChange(idx, 'label', e.target.value)}
                onBlur={() => onOptionBlur(idx)}
                className={`flex-1 min-w-0 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/40`}
                placeholder='Label'
              />
              <input
                type='number'
                value={opt.scoreAdjustment}
                onChange={e =>
                  onOptionChange(
                    idx,
                    'scoreAdjustment',
                    parseInt(e.target.value) || 0
                  )
                }
                onBlur={() => onOptionBlur(idx)}
                className='w-10 text-xs text-center bg-transparent border-none outline-none text-muted-foreground shrink-0'
                placeholder='0'
                title='Score adjustment'
              />
              <button
                type='button'
                onClick={() => onDeleteOption(idx)}
                className='p-1 rounded hover:bg-destructive/10 transition-colors shrink-0'
                title='Remove option'
              >
                <X className='size-3 text-destructive/60' />
              </button>
            </div>
          ))}

          {options.length === 0 && (
            <p className='text-xs text-muted-foreground/40 text-center py-3'>
              No options yet.
            </p>
          )}
        </div>

        <button
          type='button'
          onClick={onAddOption}
          className='mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          <Plus className='size-3' />
          Add option
        </button>
      </div>
    </div>
  )
}

// Resizable 3-row layout that fills its parent (h-full) instead of h-screen/w-screen
function AdminLayout({
  layoutId,
  header,
  footer,
  children,
}: {
  layoutId: string
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const storageId = `aadhya-layout-${layoutId}`
  const panelIds = [
    `${storageId}-header`,
    `${storageId}-content`,
    `${storageId}-footer`,
  ]
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: storageId,
    panelIds,
    storage: localStorage,
  })
  const fallback = {
    [panelIds[0]]: 10,
    [panelIds[1]]: 75,
    [panelIds[2]]: 15,
  }

  return (
    <div className='h-full w-full overflow-hidden bg-background text-foreground p-2 sm:p-4'>
      <Group
        orientation='vertical'
        defaultLayout={defaultLayout ?? fallback}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel id={panelIds[0]} defaultSize='10%' minSize='5%' maxSize='25%'>
          {header}
        </Panel>

        <Separator className='group relative h-2 flex items-center justify-center data-[separator]:cursor-row-resize p-2'>
          <div className='h-0.5 w-12 rounded-full bg-border transition-colors group-hover:bg-primary/40 group-data-[dragging]:bg-primary/60' />
        </Separator>

        <Panel id={panelIds[1]} defaultSize='75%' minSize='40%'>
          <div className='h-full w-full overflow-hidden min-h-0'>
            {children}
          </div>
        </Panel>

        <Separator className='group relative h-2 flex items-center justify-center data-[separator]:cursor-row-resize p-2'>
          <div className='h-0.5 w-12 rounded-full bg-border transition-colors group-hover:bg-primary/40 group-data-[dragging]:bg-primary/60' />
        </Separator>

        <Panel id={panelIds[2]} defaultSize='15%' minSize='5%' maxSize='25%'>
          {footer}
        </Panel>
      </Group>
    </div>
  )
}

// --- Main page ---

export default function AdminActivityEditor() {
  const { assessmentId, activityId } = useParams<{
    assessmentId: string
    activityId: string
  }>()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [rawActivities, setRawActivities] = useState<ApiActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirtyEdits, setDirtyEdits] = useState<
    Record<string, Partial<ActivityMetadata>>
  >({})

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!assessmentId) return
      try {
        setIsLoading(true)
        const data = await educatorApi.fetchActivities(assessmentId)
        setRawActivities(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load activities:', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [assessmentId])

  const dotDataItems = useMemo(
    () => mapActivitiesToDotData(rawActivities),
    [rawActivities]
  )

  const { currentSlideIndex, goToSlide, isVisited } = useSlideState(
    dotDataItems.length,
    `admin-activity-editor-${assessmentId}`
  )

  const initialSlideSet = useRef(false)
  useEffect(() => {
    if (initialSlideSet.current || rawActivities.length === 0 || !activityId)
      return
    const idx = rawActivities.findIndex(a => a.id === activityId)
    if (idx >= 0) goToSlide(idx)
    initialSlideSet.current = true
  }, [rawActivities, activityId, goToSlide])

  const handleFieldChange = useCallback(
    (actId: string, field: string, value: string) => {
      setDirtyEdits(prev => ({
        ...prev,
        [actId]: { ...(prev[actId] ?? {}), [field]: value },
      }))
    },
    []
  )

  const handleFieldBlur = useCallback(
    async (actId: string, field: string, value: unknown) => {
      const rawActivity = rawActivities.find(a => a.id === actId)
      if (!rawActivity) return
      let processedValue: unknown = value
      if (field === 'largeText' && typeof value === 'string') {
        processedValue = (value as string).split('\n\n').filter(Boolean)
      }
      const updatedMetadata: ActivityMetadata = {
        ...rawActivity.metadata,
        [field]: processedValue,
      }
      try {
        setSaving(true)
        await educatorApi.updateActivity(actId, {
          metadata: updatedMetadata as Record<string, unknown>,
        })
        setRawActivities(prev =>
          prev.map(a =>
            a.id === actId ? { ...a, metadata: updatedMetadata } : a
          )
        )
      } catch (err) {
        console.error('Failed to save:', err)
      } finally {
        setSaving(false)
      }
    },
    [rawActivities]
  )

  const handleOptionChange = useCallback(
    (
      actId: string,
      currentOptions: ActivityOption[],
      idx: number,
      field: keyof ActivityOption,
      value: string | number
    ) => {
      const updated = [...currentOptions]
      updated[idx] = { ...updated[idx], [field]: value }
      setDirtyEdits(prev => ({
        ...prev,
        [actId]: { ...(prev[actId] ?? {}), options: updated },
      }))
    },
    []
  )

  const handleOptionBlur = useCallback(
    async (actId: string, options: ActivityOption[]) => {
      await handleFieldBlur(actId, 'options', options)
    },
    [handleFieldBlur]
  )

  const handleDomainAttributeChange = useCallback(
    async (
      actId: string,
      field: 'domain' | 'attribute' | 'type',
      value: string
    ) => {
      try {
        setSaving(true)
        await educatorApi.updateActivity(actId, { [field]: value })
        setRawActivities(prev =>
          prev.map(a => (a.id === actId ? { ...a, [field]: value } : a))
        )
      } catch (err) {
        console.error('Failed to save:', err)
      } finally {
        setSaving(false)
      }
    },
    []
  )

  const handleAddOption = useCallback(
    async (actId: string, currentOpts: ActivityOption[]) => {
      const newOption: ActivityOption = {
        emoji: '',
        label: '',
        scoreAdjustment: 0,
        value: currentOpts.length + 1,
      }
      const updated = [...currentOpts, newOption]
      setDirtyEdits(prev => ({
        ...prev,
        [actId]: { ...(prev[actId] ?? {}), options: updated },
      }))
      await handleFieldBlur(actId, 'options', updated)
    },
    [handleFieldBlur]
  )

  const handleDeleteOption = useCallback(
    async (actId: string, currentOpts: ActivityOption[], idx: number) => {
      const updated = currentOpts.filter((_, i) => i !== idx)
      setDirtyEdits(prev => ({
        ...prev,
        [actId]: { ...(prev[actId] ?? {}), options: updated },
      }))
      await handleFieldBlur(actId, 'options', updated)
    },
    [handleFieldBlur]
  )

  const onBack = useCallback(() => {
    navigate(`/dashboard/assessments/${assessmentId}/activities`)
  }, [navigate, assessmentId])

  const headerDots: DotData[] = useMemo(
    () => [
      {
        id: 'back',
        icon: ArrowLeft,
        label: 'Back',
        title: 'Back to Activities',
        tinyText: 'Back',
        onClick: onBack,
      },
      {
        id: 'save-status',
        icon: CheckCircle,
        label: saving ? 'Saving' : 'Saved',
        title: saving ? 'Saving changes…' : 'All changes saved',
        tinyText: saving ? 'Saving…' : 'Saved',
      },
      { ...themeDot(theme, toggleTheme) },
    ],
    [onBack, saving, theme, toggleTheme]
  )

  const footerDots: DotData[] = useMemo(
    () =>
      dotDataItems.map((item, i) => ({
        ...item,
        tinyText: `Activity ${i + 1}`,
        isActive: i === currentSlideIndex,
        isVisited: isVisited(i),
        onClick: () => goToSlide(i),
      })),
    [dotDataItems, currentSlideIndex, isVisited, goToSlide]
  )

  const layoutId = `admin-activity-editor-${assessmentId}`

  if (isLoading) {
    return (
      <AdminLayout
        layoutId={layoutId}
        header={<Header items={headerDots} />}
        footer={<Footer items={[]} />}
      >
        <div className='flex items-center justify-center h-full'>
          <p className='text-muted-foreground'>Loading activities…</p>
        </div>
      </AdminLayout>
    )
  }

  if (rawActivities.length === 0) {
    return (
      <AdminLayout
        layoutId={layoutId}
        header={<Header items={headerDots} />}
        footer={<Footer items={[]} />}
      >
        <div className='flex items-center justify-center h-full'>
          <p className='text-muted-foreground'>No activities found.</p>
        </div>
      </AdminLayout>
    )
  }

  const activity = rawActivities[currentSlideIndex]
  const currentDomain = (activity.domain ?? '').toLowerCase()
  const currentAttribute = (activity.attribute ?? '').toLowerCase()
  const mergedMetadata: ActivityMetadata = {
    ...activity.metadata,
    // Normalize legacy field: metadata.text was used as title before DotData alignment
    title:
      activity.metadata.title ?? (activity.metadata.text as string | undefined),
    label: activity.metadata.label ?? activity.attribute,
    ...(dirtyEdits[activity.id] ?? {}),
  }
  const currentOptions = (mergedMetadata.options as ActivityOption[]) ?? []

  const editableContent = (
    <div className='w-full h-full rounded-2xl bg-card border overflow-hidden'>
      <EditableActivityContent
        activityId={activity.id}
        metadata={mergedMetadata}
        saving={saving}
        onFieldChange={(field, value) =>
          handleFieldChange(activity.id, field, value)
        }
        onFieldBlur={(field, value) =>
          handleFieldBlur(activity.id, field, value)
        }
      />
    </div>
  )

  const editablePanel = (
    <div className='w-full h-full rounded-2xl bg-card border overflow-hidden'>
      <EditableOptionsPanel
        domain={currentDomain}
        attribute={currentAttribute}
        activityType={activity.type ?? 'mcq'}
        options={currentOptions}
        onDomainChange={async value => {
          await handleDomainAttributeChange(activity.id, 'domain', value)
          await handleDomainAttributeChange(activity.id, 'attribute', '')
        }}
        onAttributeChange={value =>
          handleDomainAttributeChange(activity.id, 'attribute', value)
        }
        onActivityTypeChange={value =>
          handleDomainAttributeChange(activity.id, 'type', value)
        }
        onOptionChange={(idx, field, value) =>
          handleOptionChange(activity.id, currentOptions, idx, field, value)
        }
        onOptionBlur={() =>
          handleOptionBlur(
            activity.id,
            (dirtyEdits[activity.id]?.options as ActivityOption[]) ??
              currentOptions
          )
        }
        onAddOption={() => handleAddOption(activity.id, currentOptions)}
        onDeleteOption={idx =>
          handleDeleteOption(activity.id, currentOptions, idx)
        }
      />
    </div>
  )

  return (
    <AdminLayout
      layoutId={layoutId}
      header={<Header items={headerDots} />}
      footer={<Footer items={footerDots} currentIndex={currentSlideIndex} />}
    >
      <main className='w-full h-full overflow-hidden min-h-0'>
        {isMobile ? (
          <div className='flex flex-col w-full h-full overflow-hidden gap-2 sm:gap-4 min-h-0'>
            {editableContent}
            <div className='overflow-hidden min-h-0'>{editablePanel}</div>
          </div>
        ) : (
          <FluidContentPanel
            layoutId={layoutId}
            content={editableContent}
            panel={editablePanel}
            defaultSizes={[80, 20]}
          />
        )}
      </main>
    </AdminLayout>
  )
}
