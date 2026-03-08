import { type ReactNode, useState, useEffect } from 'react'
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
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const orientation = isMobile ? 'vertical' : 'horizontal'
  const storageId = `aadhya-content-${layoutId}-${orientation}`
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
      key={orientation}
      orientation={orientation}
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

      <Separator
        onClick={e => e.stopPropagation()}
        style={isMobile ? undefined : { flexBasis: '0.5rem' }}
        className={
          isMobile
            ? 'group relative h-2 flex items-center justify-center data-[separator]:cursor-row-resize p-2'
            : 'group relative flex items-center justify-center data-[separator]:cursor-col-resize p-2'
        }
      >
        <div
          className={`rounded-full bg-border transition-colors group-hover:bg-primary/40 group-data-[dragging]:bg-primary/60 ${
            isMobile ? 'h-0.5 w-12' : 'w-0.5 h-12'
          }`}
        />
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
