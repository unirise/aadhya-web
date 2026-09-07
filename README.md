# Aadhya Web

A modern React application for the Aadhya NGO project, built with
**React**, **Vite**, **TypeScript**, **React Router**, **TanStack
Query**, **React Hook Form**, **Zod**, **Recharts**, **Tailwind CSS**,
and **Docker**.

The application communicates with the Aadhya Server backend through its
REST API.

------------------------------------------------------------------------

## Table of Contents

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Repository Setup](#repository-setup)
-   [Environment Configuration](#environment-configuration)
-   [Local Development](#local-development)
-   [Backend Connection](#backend-connection)
-   [Complete Aadhya Setup](#complete-aadhya-setup)
-   [Docker Development](#docker-development)
-   [Production Build](#production-build)
-   [Available Scripts](#available-scripts)
-   [Testing](#testing)
-   [Linting and Formatting](#linting-and-formatting)
-   [Troubleshooting](#troubleshooting)
-   [Project Structure](#project-structure)
-   [Technologies Used](#technologies-used)
-   [Development Workflow](#development-workflow)
-   [Quick Start](#quick-start)

------------------------------------------------------------------------

## Project Overview

Aadhya Web is the frontend application for the Aadhya platform.

It provides the user interface for authentication, Explore, Vision,
Intelligence assessment, Physical assessment, profiles, activities, and
other application features.

The frontend communicates with Aadhya Server through its REST API.

------------------------------------------------------------------------

## Features

-   ⚡ **Vite** - Fast development and build tooling
-   ⚛️ **React 19** - Current React version used by the repository
-   🧭 **React Router** - Client-side routing
-   🔄 **TanStack Query** - Server-state management
-   📝 **React Hook Form** - Form handling
-   ✅ **Zod** - Schema validation
-   📊 **Recharts** - Data visualization
-   🎨 **Tailwind CSS** - Styling
-   🌐 **i18next / react-i18next** - Internationalization
-   🧩 **Radix UI** - UI primitives
-   🐳 **Docker** - Containerized development and production
-   🔥 **Vite HMR** - Hot reload during development
-   🧪 **Vitest** - Frontend testing

------------------------------------------------------------------------

# Prerequisites

Required:

-   **Node.js 18+**
-   **npm**
-   **Git**

Optional:

-   **Docker Desktop**
-   **Docker Compose**

Docker is not required when running the frontend directly with Vite.

The repository also contains a `pnpm-lock.yaml`, and the Dockerfiles use
pnpm `10.15.1`. The normal local commands documented here use npm,
matching the existing local development workflow.

------------------------------------------------------------------------

# Repository Setup

## 1. Clone the development branch

``` bash
git clone -b develop https://github.com/Unirise-Research-Foundation/aadhya-web.git
cd aadhya-web
```

## 2. Update an existing checkout

``` bash
git checkout develop
git pull origin develop
```

## 3. Install dependencies

``` bash
npm install
```

------------------------------------------------------------------------

# Environment Configuration

The repository contains:

``` text
.env.example
```

Create a local `.env` file.

### Windows PowerShell

``` powershell
Copy-Item .env.example .env
```

### macOS / Linux

``` bash
cp .env.example .env
```

For local development, the API base URL can be configured as:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

The `.env.example` file also contains a commented `VITE_API_URL`
example, but the current API configuration code uses
**`VITE_API_BASE_URL`**.

The current application settings include:

``` env
VITE_APP_NAME=Aadhya Web
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

Optional feature flags in the example file include:

``` env
# VITE_ENABLE_ANALYTICS=true
# VITE_ENABLE_DEBUG=false
```

Do not commit private credentials or production secrets.

Restart Vite after changing `.env`.

------------------------------------------------------------------------

# Local Development

Start the Vite development server:

``` bash
npm run dev
```

The Vite configuration uses:

``` text
Host: 0.0.0.0
Port: 3000
```

Open:

``` text
http://localhost:3000
```

Hot reload is enabled during development.

------------------------------------------------------------------------

# Backend Connection

The local frontend API base URL is:

``` text
http://localhost:3001/api
```

The application code also has this URL as the development fallback when
`VITE_API_BASE_URL` is not supplied.

The production fallback is:

``` text
https://api.urf.buildstack.space/api
```

The local architecture is:

``` text
Browser
   |
   | http://localhost:3000
   v
Aadhya Web
React + Vite
   |
   | http://localhost:3001/api
   v
Aadhya Server
NestJS
   |
   | localhost:5433
   v
PostgreSQL
Docker
```

The backend must be running for API-dependent functionality.

------------------------------------------------------------------------

# Complete Aadhya Setup

For a complete local setup, use three terminals.

## Terminal 1 --- PostgreSQL

Open the `aadhya-server` repository:

``` bash
cd aadhya-server
```

Start PostgreSQL:

``` bash
docker compose up localhost -d
```

Verify:

``` bash
docker ps
```

The PostgreSQL container should be:

``` text
aadhya-postgres
```

------------------------------------------------------------------------

## Terminal 2 --- Backend

Open the backend repository:

``` bash
cd aadhya-server
```

On first setup, or after pulling new migrations:

``` bash
pnpm migration:run
```

Start the backend:

``` bash
pnpm start:dev:local
```

API:

``` text
http://localhost:3001/api
```

Health check:

``` text
http://localhost:3001/api/health
```

------------------------------------------------------------------------

## Terminal 3 --- Frontend

Open the frontend repository:

``` bash
cd aadhya-web
```

Start Vite:

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Backend Health Check

Before troubleshooting frontend API requests, verify:

``` text
http://localhost:3001/api/health
```

The backend health endpoint returns:

``` text
ok
```

If the endpoint does not respond:

1.  Check that Docker Desktop is running.
2.  Check that PostgreSQL is running.
3.  Check the backend terminal.
4.  Start the backend with:

``` bash
pnpm start:dev:local
```

------------------------------------------------------------------------

# Docker Development

The repository contains a `docker-compose.yml` with development and
production services.

## Start the default Compose development service

``` bash
docker compose up
```

The Compose file contains an unprofiled development service named:

``` text
aadhya-web
```

which exposes port `3000`.

## Start with the development profile

``` bash
docker compose --profile dev up
```

The `dev` profile contains the additional `aadhya-web-dev` service.

## Build the development image

``` bash
docker build -f Dockerfile.dev -t aadhya-web-dev .
```

The development Dockerfile uses Node 20 and pnpm `10.15.1`.

## Run the development image manually

macOS/Linux:

``` bash
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  aadhya-web-dev
```

Windows users can use Docker Compose or Docker Desktop to avoid
shell-specific volume syntax.

## Stop containers

``` bash
docker compose down
```

------------------------------------------------------------------------

# Production Build

## Local production build

The repository's build script runs TypeScript checking followed by the
Vite build:

``` bash
npm run build
```

Preview the generated build:

``` bash
npm run preview
```

------------------------------------------------------------------------

# Docker Production

Build the production image:

``` bash
docker build -t aadhya-web-prod .
```

Run it:

``` bash
docker run -p 80:80 aadhya-web-prod
```

The production Docker image:

1.  Builds the frontend with Node/pnpm.
2.  Copies `dist` into Nginx.
3.  Serves the application through Nginx on port `80`.

------------------------------------------------------------------------

# Docker Compose Production

Start the production profile:

``` bash
docker compose --profile prod up
```

Run in the background:

``` bash
docker compose --profile prod up -d
```

Stop:

``` bash
docker compose down
```

The production Compose service exposes:

``` text
localhost:80
```

------------------------------------------------------------------------

# Available Scripts

These are the scripts currently defined in `package.json`.

### Development

``` bash
npm run dev
```

### Build

``` bash
npm run build
```

### Type checking

``` bash
npm run type-check
```

### Lint checking

``` bash
npm run lint:check
```

### Automatically fix lint issues

``` bash
npm run lint:fix
```

### Prettier

``` bash
npm run prettier:check
npm run prettier:fix
```

### Preview production build

``` bash
npm run preview
```

### Tests

``` bash
npm run test
npm run test:ui
npm run test:coverage
npm run test:watch
```

Run:

``` bash
npm run
```

to see all scripts available in the current checkout.

------------------------------------------------------------------------

# Testing

The project uses **Vitest** for frontend tests.

### Run tests

``` bash
npm run test
```

### Run tests in watch mode

``` bash
npm run test:watch
```

### Run the Vitest UI

``` bash
npm run test:ui
```

### Generate test coverage

``` bash
npm run test:coverage
```

------------------------------------------------------------------------

# Linting and Formatting

### Check lint

``` bash
npm run lint:check
```

### Fix lint issues

``` bash
npm run lint:fix
```

### Check Prettier formatting

``` bash
npm run prettier:check
```

### Format files

``` bash
npm run prettier:fix
```

------------------------------------------------------------------------

# Troubleshooting

## Network Error

If the frontend displays a network error:

### 1. Check the backend

Open:

``` text
http://localhost:3001/api/health
```

### 2. Check PostgreSQL

From `aadhya-server`:

``` bash
docker compose up localhost -d
```

### 3. Check the frontend API variable

Use:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Restart Vite

Stop the development server:

``` text
Ctrl+C
```

Then:

``` bash
npm run dev
```

------------------------------------------------------------------------

## `relation "person" does not exist`

This is a backend/database issue.

From `aadhya-server`:

``` bash
docker compose up localhost -d
```

Run:

``` bash
pnpm migration:run
```

Then:

``` bash
pnpm start:dev:local
```

------------------------------------------------------------------------

## Backend cannot be reached

Check:

``` text
http://localhost:3001
http://localhost:3001/api/health
```

If the health endpoint is unavailable, start the backend.

------------------------------------------------------------------------

## Port 3000 already in use

Windows PowerShell:

``` powershell
netstat -ano | findstr :3000
```

Identify the process using the port and stop it if necessary.

------------------------------------------------------------------------

## Blank page

Check:

-   Vite terminal output
-   Browser developer console
-   Network tab
-   API availability

Restart:

``` bash
npm run dev
```

------------------------------------------------------------------------

## Dependency problems

Windows PowerShell:

``` powershell
Remove-Item -Recurse -Force node_modules
npm install
```

macOS/Linux:

``` bash
rm -rf node_modules
npm install
```

Then:

``` bash
npm run dev
```

------------------------------------------------------------------------

# Project Structure

The current repository structure is:

``` text
aadhya-web/
├── .agents/
│   └── skills/
├── .github/
│   └── workflows/
├── docker/
│   └── prod/
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── pages/
│   ├── router/
│   ├── schemas/
│   ├── services/
│   ├── test/
│   ├── types/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── eslint.config.js
├── index.html
├── nginx.conf
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── .env.example
└── README.md
```

------------------------------------------------------------------------

# Technologies Used

### React 19

Current React version used by the repository.

### Vite

Frontend development server and build tool.

### TypeScript

Used throughout the current source code.

### React Router

Client-side routing.

### TanStack Query

Server-state and API data management.

### React Hook Form

Form management.

### Zod

Validation.

### Recharts

Charts and data visualization.

### Tailwind CSS

Utility-first styling.

### i18next / react-i18next

Internationalization support.

### Radix UI

Reusable UI primitives.

### Axios

HTTP client used by the API service layer.

### Docker

Containerized development and production.

### Nginx

Production web server.

### Vitest

Frontend testing.

### ESLint / Prettier

Linting and formatting.

------------------------------------------------------------------------

# Development Workflow

``` text
Pull latest changes
       |
       v
Install/update dependencies if required
       |
       v
Start PostgreSQL
       |
       v
Run backend migrations if required
       |
       v
Start Aadhya Server
       |
       v
Start Aadhya Web
       |
       v
Open http://localhost:3000
```

------------------------------------------------------------------------

# Daily Startup

### Backend / PostgreSQL

Terminal 1:

``` bash
cd aadhya-server
docker compose up localhost -d
```

Terminal 2:

``` bash
cd aadhya-server
pnpm start:dev:local
```

### Frontend

Terminal 3:

``` bash
cd aadhya-web
npm run dev
```

Open:

``` text
http://localhost:3000
```

You do not need to run migrations every day unless new migrations were
added.

------------------------------------------------------------------------

# Quick Start

## First time

Clone:

``` bash
git clone -b develop https://github.com/Unirise-Research-Foundation/aadhya-web.git
cd aadhya-web
```

Install:

``` bash
npm install
```

Create `.env`:

``` powershell
Copy-Item .env.example .env
```

Set:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

Start:

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

The Aadhya Server and PostgreSQL must also be running for API-dependent
functionality.

------------------------------------------------------------------------

# Quick Reference

  Service                    Local Address
  -------------------------- ------------------------------------
  Aadhya Web                 `http://localhost:3000`
  Aadhya Server              `http://localhost:3001`
  API Base URL               `http://localhost:3001/api`
  API Health                 `http://localhost:3001/api/health`
  PostgreSQL                 `localhost:5433`
  Production Web Container   `localhost:80`

------------------------------------------------------------------------

# Important Notes

1.  The frontend development server runs on port `3000`.
2.  The backend runs on port `3001`.
3.  PostgreSQL is exposed on host port `5433`.
4.  The frontend API base URL is `http://localhost:3001/api`.
5.  `VITE_API_BASE_URL` is the environment variable used by the current
    API configuration.
6.  Restart Vite after changing environment variables.
7.  Run backend migrations during first setup or after new migrations
    are pulled.
8.  Do not commit `.env` or production secrets.
9.  The repository currently uses TypeScript source files such as
    `App.tsx`, `main.tsx`, and `vite.config.ts`.
10. The Dockerfiles use Node 20 and pnpm `10.15.1`.
