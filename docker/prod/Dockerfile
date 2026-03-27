ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL=https://api.urf.buildstack.space/api/v1
ARG VITE_API_URL=https://api.urf.buildstack.space/api/v1
ARG NODE_OPTIONS=--max-old-space-size=1024
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_OPTIONS=${NODE_OPTIONS}

RUN pnpm exec vite build

FROM nginx:1.27-alpine AS runtime

COPY docker/prod/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
