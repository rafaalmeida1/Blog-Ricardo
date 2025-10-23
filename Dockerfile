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
# Scripts are not needed for production

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Create startup script inline
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting application..."' >> /app/start.sh && \
    echo 'echo "⏳ Waiting for database connection..."' >> /app/start.sh && \
    echo 'sleep 15' >> /app/start.sh && \
    echo 'echo "📊 Setting up database..."' >> /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo 'echo "🔄 Creating database tables..."' >> /app/start.sh && \
    echo 'npx prisma db push --force-reset --accept-data-loss' >> /app/start.sh && \
    echo 'sleep 5' >> /app/start.sh && \
    echo 'echo "🌱 Seeding database..."' >> /app/start.sh && \
    echo 'npm run db:seed' >> /app/start.sh && \
    echo 'echo "✅ Database ready!"' >> /app/start.sh && \
    echo 'echo "🌐 Starting Next.js server..."' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

USER nextjs

EXPOSE 3333

ENV PORT 3333
ENV HOSTNAME "0.0.0.0"

CMD ["/app/start.sh"]
