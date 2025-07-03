# Aadhya Web

A modern React application built with Vite and Docker support.

## Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React with modern features
- 🐳 **Docker** - Containerized development and production
- 🔥 **Hot Reload** - Fast development experience
- 📦 **Modern Build** - Optimized production builds
- 🎨 **Modern UI** - Clean and responsive design

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (optional)

### Local Development

1. **Clone and install dependencies:**

   ```bash
   cd aadhya-web
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Docker Development

1. **Start with Docker Compose:**

   ```bash
   docker-compose up
   ```

2. **Or build and run manually:**
   ```bash
   docker build -f Dockerfile.dev -t aadhya-web-dev .
   docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules aadhya-web-dev
   ```

### Production Build

#### Local Production Build

```bash
npm run build
npm run preview
```

#### Docker Production Build

```bash
# Build production image
docker build -t aadhya-web-prod .

# Run production container
docker run -p 80:80 aadhya-web-prod
```

#### Docker Compose Production

```bash
docker-compose --profile prod up
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Docker Commands

### Development

```bash
# Start development environment
docker-compose up

# Start with specific profile
docker-compose --profile dev up

# Build development image
docker build -f Dockerfile.dev -t aadhya-web-dev .
```

### Production

```bash
# Start production environment
docker-compose --profile prod up

# Build production image
docker build -t aadhya-web-prod .
```

## Project Structure

```
aadhya-web/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── assets/           # Images, icons, etc.
│   ├── App.jsx           # Main App component
│   ├── App.css           # App styles
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── Dockerfile            # Production Docker image
├── Dockerfile.dev        # Development Docker image
├── docker-compose.yml    # Docker Compose configuration
├── nginx.conf           # Nginx configuration for production
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Docker** - Containerization
- **ESLint** - Code linting
