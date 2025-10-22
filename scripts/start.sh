#!/bin/sh

echo "🚀 Starting application..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
sleep 5

echo "📊 Setting up database..."
npx prisma generate

# Try to push schema to database
echo "🔄 Syncing database schema..."
npx prisma db push --accept-data-loss || echo "Database push failed, continuing..."

echo "🌱 Seeding database..."
npm run db:seed || echo "Seeding failed, continuing..."

echo "✅ Database ready!"
echo "🌐 Starting Next.js server..."
exec node server.js
