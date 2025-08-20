# --- build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# Inject API base at build time so the SPA points to the backend
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json* bun.lockb* ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
# Place our server block under conf.d instead of overwriting nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
