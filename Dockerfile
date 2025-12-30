FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV REDIS_URL=""
ENV DATABASE_URL=""

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
# Copy scripts for seeding
COPY --from=builder /app/scripts ./scripts

# Create uploads directory with proper permissions
RUN mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/public/uploads && \
    chmod -R 777 /app/public/uploads

# Create entrypoint script that runs as root to fix permissions, then switches to nextjs
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo 'echo "🔧 Ajustando permissões do diretório de uploads..."' >> /app/entrypoint.sh && \
    echo 'mkdir -p /app/public/uploads' >> /app/entrypoint.sh && \
    echo 'chown -R nextjs:nodejs /app/public/uploads' >> /app/entrypoint.sh && \
    echo 'chmod -R 777 /app/public/uploads' >> /app/entrypoint.sh && \
    echo 'echo "✅ Permissões ajustadas!"' >> /app/entrypoint.sh && \
    echo 'exec su-exec nextjs "$@"' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Install su-exec for user switching
RUN apk add --no-cache su-exec

# Create startup script inline
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting application..."' >> /app/start.sh && \
    echo 'echo "⏳ Waiting for database connection..."' >> /app/start.sh && \
    echo 'sleep 15' >> /app/start.sh && \
    echo 'echo "🔄 Checking database schema..."' >> /app/start.sh && \
    echo 'npx prisma db push' >> /app/start.sh && \
    echo 'sleep 5' >> /app/start.sh && \
    echo 'echo "🌱 Seeding database (if needed)..."' >> /app/start.sh && \
    echo 'npm run db:seed' >> /app/start.sh && \
    echo 'echo "🔍 Checking users..."' >> /app/start.sh && \
    echo 'npm run check-users' >> /app/start.sh && \
    echo 'echo "✅ Database ready!"' >> /app/start.sh && \
    echo 'echo "🌐 Starting Next.js server..."' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Fix permissions for node_modules
RUN chown -R nextjs:nodejs /app/node_modules

# Use entrypoint to fix permissions before switching user
# Note: entrypoint runs as root, then switches to nextjs user
ENTRYPOINT ["/app/entrypoint.sh"]

EXPOSE 3333

ENV PORT 3333
ENV HOSTNAME "0.0.0.0"

CMD ["/app/start.sh"]
