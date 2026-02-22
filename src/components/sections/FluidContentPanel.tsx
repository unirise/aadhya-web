import { type ReactNode } from 'react'
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from 'react-resizable-panels'

interface FluidContentPanelProps {
  layoutId: string
  content: ReactNode
  panel: ReactNode
  defaultSizes?: [number, number]
  minSizes?: [number, number]
}

export function FluidContentPanel({
  layoutId,
  content,
  panel,
  defaultSizes = [80, 20],
  minSizes = [30, 10],
}: FluidContentPanelProps) {
  const storageId = `aadhya-content-${layoutId}`
  const panelIds = [`${storageId}-main`, `${storageId}-side`]

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: storageId,
    panelIds,
    storage: localStorage,
  })

  const fallback = {
    [panelIds[0]]: defaultSizes[0],
    [panelIds[1]]: defaultSizes[1],
  }

  return (
    <Group
      orientation='horizontal'
      defaultLayout={defaultLayout ?? fallback}
      onLayoutChanged={onLayoutChanged}
      className='h-full'
    >
      <Panel
        id={panelIds[0]}
        defaultSize={`${defaultSizes[0]}%`}
        minSize={`${minSizes[0]}%`}
      >
        {content}
      </Panel>

      <Separator className='group relative hidden lg:flex w-2 items-center justify-center data-[separator]:cursor-col-resize p-2'>
        <div className='w-0.5 h-12 rounded-full bg-border transition-colors group-hover:bg-primary/40 group-data-[dragging]:bg-primary/60' />
      </Separator>

      <Panel
        id={panelIds[1]}
        defaultSize={`${defaultSizes[1]}%`}
        minSize={`${minSizes[1]}%`}
      >
        {panel}
      </Panel>
    </Group>
  )
}
