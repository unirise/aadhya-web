# Aadhya Web

Frontend for the Aadhya platform — a React single-page application for assessments, activities, and multiple intelligences analysis. Supports multiple languages (English, Spanish, French, Hindi).

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.9 (strict mode) |
| Package Manager | pnpm |
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router 7 |
| Server State | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| UI Components | Radix UI / Shadcn + Lucide icons |
| Styling | Tailwind CSS 4 + PostCSS |
| Charts | Recharts |
| i18n | i18next (en, es, fr, hi) |
| HTTP Client | Axios |
| Date Utils | dayjs |
| Testing | Vitest + React Testing Library |
| Code Quality | ESLint + Prettier |
| Containerization | Docker + Docker Compose + Nginx |

## Key Commands

```bash
pnpm install                  # Install dependencies
pnpm dev                      # Dev server (port 3000, hot reload)
pnpm build                    # TypeScript check + Vite production build
pnpm preview                  # Preview production build locally
pnpm test                     # Run tests with Vitest
pnpm test:watch               # Watch mode testing
pnpm test:coverage            # Coverage report
pnpm test:ui                  # Vitest UI dashboard
pnpm type-check               # TypeScript check without emitting
pnpm lint:fix                 # Fix ESLint issues
pnpm format:fix               # Fix Prettier formatting
docker compose up              # Dev environment
docker compose --profile prod up  # Production (Nginx)
```

## Project Structure

```
src/
  main.tsx                     # Entry point — renders React root
  App.tsx                      # Root component (QueryClient + Router)
  router/AppRouter.tsx         # Route definitions with protected routes
  pages/                       # Page components (Home, Login, Assessment, etc.)
  components/
    ui/                        # Shadcn UI primitives (button, card, radio-group)
    blocks/                    # Composite block components
    forms/                     # Form components (LoginForm, ContactForm)
    charts/                    # Chart components
    activity-components/       # Activity-specific components
    Layout.tsx                 # App layout wrapper
    Navigation.tsx             # Navigation menu
    ProtectedRoute.tsx         # Auth route guard
    LanguageSwitcher.tsx       # Language selection
  services/
    apiConfig.ts               # API base URL and fetch utilities
    authService.ts             # Login/logout/token management
    activitiesApi.ts           # Activities endpoints
    assessmentsApi.ts          # Assessments endpoints
  hooks/                       # Custom hooks (useActivities, useAssessments, useZodForm)
  lib/                         # Utilities (axios config, date utils, MI scoring, mappings)
  schemas/                     # Zod validation schemas
  types/                       # TypeScript type definitions
  data/                        # Static data (questions, MI questions JSON)
  i18n/locales/                # Translation files (en, es, fr, hi)

Dockerfile                     # Production multi-stage (Node build → Nginx)
Dockerfile.dev                 # Development image (hot reload)
docker-compose.yml             # Dev + prod profiles
nginx.conf                     # Production Nginx config (SPA fallback, caching, security headers)
```

## Routes

| Path | Description | Auth |
|------|-------------|------|
| `/login` | Login page | Public |
| `/` `/home` | Main landing page | Protected |
| `/assessment/:id/start` | Assessment overview | Protected |
| `/assessment/:id/activity/:activityId` | Activity/assessment page | Protected |
| `/assessment/:id/thank-you` | Completion page | Protected |
| `/pehachan` | Pehchan module | Protected |
| `/sajag` | Sajag module | Protected |

## Environment Variables

See `.env.example`. Key ones:

```
VITE_API_BASE_URL=http://localhost:3001/api   # Backend API URL
VITE_APP_NAME=Aadhya Web
VITE_ENVIRONMENT=development
```

Default API base: `http://localhost:3001/api/v1`

## Docker

Docker is already configured for both dev and production:

- **Dev:** `Dockerfile.dev` — Node 18, hot reload on port 3000
- **Prod:** `Dockerfile` — Multi-stage build (Node 18 compile → Nginx alpine), serves static assets on port 80
- **Nginx:** SPA routing fallback, security headers, 1-year static asset caching
- **Compose profiles:** default (dev), `dev`, `prod`
