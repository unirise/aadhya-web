import { type ReactNode } from 'react'
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from 'react-resizable-panels'

interface FluidLayoutProps {
  layoutId: string
  header: ReactNode
  children: ReactNode
  footer: ReactNode
  defaultSizes?: [number, number, number]
  minSizes?: [number, number, number]
  className?: string
}

export function FluidLayout({
  layoutId,
  header,
  children,
  footer,
  defaultSizes = [10, 80, 10],
  minSizes = [5, 40, 5],
  className,
}: FluidLayoutProps) {
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
    [panelIds[0]]: defaultSizes[0],
    [panelIds[1]]: defaultSizes[1],
    [panelIds[2]]: defaultSizes[2],
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden bg-background text-foreground ${className ?? ''}`}
    >
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground focus:border focus:rounded-md'
      >
        Skip to main content
      </a>
      <Group
        orientation='vertical'
        defaultLayout={defaultLayout ?? fallback}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel
          id={panelIds[0]}
          defaultSize={`${defaultSizes[0]}%`}
          minSize={`${minSizes[0]}%`}
          maxSize='25%'
        >
          {header}
        </Panel>

        <Separator
          onClick={e => e.stopPropagation()}
          className='group relative h-2 flex items-center justify-center data-[separator]:cursor-row-resize p-2'
        >
          <div className='h-0.5 w-12 rounded-full bg-border transition-colors group-hover:bg-primary/40 group-data-[dragging]:bg-primary/60' />
        </Separator>

        <Panel
          id={panelIds[1]}
          defaultSize={`${defaultSizes[1]}%`}
          minSize={`${minSizes[1]}%`}
        >
          <div id='main-content' className='h-full w-full overflow-hidden'>
            {children}
          </div>
        </Panel>

        <Separator
          onClick={e => e.stopPropagation()}
          className='group relative h-2 flex items-center justify-center data-[separator]:cursor-row-resize p-2'
        >
          <div className='h-0.5 w-12 rounded-full bg-border transition-colors group-hover:bg-primary/40 group-data-[dragging]:bg-primary/60' />
        </Separator>

        <Panel
          id={panelIds[2]}
          defaultSize={`${defaultSizes[2]}%`}
          minSize={`${minSizes[2]}%`}
          maxSize='25%'
        >
          {footer}
        </Panel>
      </Group>
    </div>
  )
}
