# Presentation UI

A full-screen presentation/pitch deck interface built with React 19, TypeScript, Vite, and Tailwind
CSS v4.

## Features

- **Full-Screen Grid Layout**: No scrolling, optimized for slideshow viewing
- **Three-Panel Structure**: Header navigation, main content with sidebar, footer navigation
- **State Tracking**: Visited slides tracked with visual indicators
- **Theme Support**: Light/dark mode with smooth transitions
- **Mermaid Diagrams**: Interactive diagrams for visual storytelling
- **Persistent State**: LocalStorage saves progress and theme preference

## Quick Start

Access the presentation at `/presentation` route:

```
http://localhost:3000/presentation
```

## Project Structure

```
src/
├── components/presentation/
│   ├── Container.tsx      # Wrapper component
│   ├── Dot.tsx           # Square/circle base component
│   ├── Action.tsx        # Interactive navigation items
│   ├── Content.tsx       # Main content + Mermaid diagrams
│   └── index.ts          # Exports
├── contexts/
│   └── ThemeContext.tsx  # Theme state management
├── hooks/
│   └── useSlideState.ts  # Slide navigation & state
├── constants/
│   ├── slides.tsx        # Slide data
│   └── navigation.tsx    # Header nav items
└── pages/
    └── Presentation.tsx  # Main presentation page
```

## Layout Structure

```
┌─────────────────────────────────────┐
│         HEADER (auto height)        │  ← Navigation bar
├─────────────────────────────────────┤
│                                     │
│           MAIN (1fr)                │  ← Content area
│     ┌────────────┬─────────┐        │
│     │  Content   │ Sidebar │        │
│     │   (75%)    │  (25%)  │        │
│     └────────────┴─────────┘        │
│                                     │
├─────────────────────────────────────┤
│         FOOTER (auto height)        │  ← Slide navigation
└─────────────────────────────────────┘
```

## Design System

### Color Tokens

All colors use CSS variables for theme support:

- `--color-background` / `--color-foreground`
- `--color-card` / `--color-card-foreground`
- `--color-primary` / `--color-primary-foreground`
- `--color-secondary` / `--color-muted` / `--color-accent`
- `--color-border` / `--color-ring` / `--color-visited`

### Rounded Corners

- `rounded-none`: Header/footer/main containers
- `rounded-xl`: Action items
- `rounded-2xl`: Sidebar container
- `rounded-3xl`: Content cards

### Interactive States

- **Hover**: Border color change, scale transform, shadow increase
- **Active**: Primary background with full opacity
- **Visited**: Muted purple color with reduced opacity (70%)
- **Transitions**: 300ms duration for smooth interactions

## Components

### Container

Flexible wrapper with optional title and configurable rounding:

```tsx
<Container title='Optional Title' rounded='rounded-2xl' fullHeight={true} fullWidth={true}>
  {children}
</Container>
```

### Dot

Base component for square/circular elements:

```tsx
<Dot rounded='rounded-lg' square={true} onClick={() => {}}>
  <Icon />
</Dot>
```

### Action

Interactive navigation with two sizes:

```tsx
// Small (96x96px) - for footer
<Action
  icon={Home}
  label="Home"
  size="small"
  active={true}
  visited={false}
  onClick={() => {}}
/>

// Medium (flexible) - for sidebar
<Action
  icon={Users}
  title="Team Structure"
  description="Learn about our Pod approach..."
  size="medium"
  onClick={() => {}}
/>
```

### Content

Main content display with Mermaid diagram support:

```tsx
<Content
  type='text-media'
  label='DEVPODS'
  title='What are DevPods?'
  subtitle='A thoughtful approach...'
  paragraphs={['Paragraph 1', 'Paragraph 2']}
  diagram={mermaidDiagramString}
  onNext={() => {}}
/>
```

## Adding Slides

Edit `/src/constants/slides.tsx`:

```tsx
{
  id: 9,
  icon: YourIcon,
  label: 'LABEL',
  title: 'Your Title',
  subtitle: 'Optional subtitle',
  paragraphs: [
    'First paragraph...',
    'Second paragraph...',
  ],
  diagram: `graph LR
    A[Start] --> B[End]
    style A fill:#3b82f6,color:#fff`
}
```

## Mermaid Diagrams

Supports all Mermaid diagram types:

- **Flowcharts**: `graph LR`, `graph TB`
- **Sequence diagrams**: `sequenceDiagram`
- **Gantt charts**: `gantt`
- **Timeline**: `timeline`
- **And more**: Class, State, ER, Pie, etc.

### Example Diagram

```
graph LR
  A[Your Project] --> B[DevPod Team]
  B --> C[Immediate Delivery]
  style A fill:#3b82f6,stroke:#2563eb,color:#fff
  style B fill:#10b981,stroke:#059669,color:#fff
```

## State Management

### Theme Context

```tsx
const { theme, toggleTheme } = useTheme()
// theme: 'light' | 'dark'
```

### Slide State Hook

```tsx
const {
  currentSlide, // Current slide index
  visitedSlides, // Set of visited indices
  next, // Go to next slide
  prev, // Go to previous slide
  goToSlide, // Go to specific slide
  getSidebarSlides, // Get 3 random unvisited slides
} = useSlideState(totalSlides)
```

## Customization

### Change Colors

Edit `/src/index.css` theme variables:

```css
@theme {
  --color-primary: #your-color;
  --color-primary-foreground: #your-text-color;
}
```

### Change Layout

Edit grid structure in `/src/pages/Presentation.tsx`:

```tsx
// Change main content split from 75/25 to 80/20
<main className="grid grid-cols-[4fr_1fr] gap-4">
```

### Change Navigation Items

Edit `/src/constants/navigation.tsx`:

```tsx
export const createNavigationItems = (
  onHome: () => void,
  onThemeToggle: () => void,
  theme: 'light' | 'dark'
): NavItem[] => [
  // Add your navigation items here
]
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- CSS Variables support required
- React 19 compatible

## Performance

- Mermaid diagrams are rendered on-demand
- LocalStorage for state persistence
- No outer scrolling for better performance
- Smooth transitions with GPU acceleration

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast mode compatible
- Screen reader friendly

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Notes

- The presentation route is accessible at `/presentation`
- State persists in localStorage between sessions
- Theme preference is saved automatically
- Visited slides are tracked and indicated with purple color
- Sidebar shows 3 random unvisited slides for exploration
