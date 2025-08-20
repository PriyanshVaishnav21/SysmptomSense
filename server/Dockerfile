FROM node:18-alpine

WORKDIR /app

# Install production deps (use lockfile if present)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source
COPY src ./src

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node", "src/server.js"]
