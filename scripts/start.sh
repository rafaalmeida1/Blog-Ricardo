#!/bin/sh

echo "🚀 Starting application..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "📊 Setting up database..."
npx prisma generate

# Try to push schema to database
echo "🔄 Syncing database schema..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Database ready!"
echo "🌐 Starting Next.js server..."
exec node server.js
