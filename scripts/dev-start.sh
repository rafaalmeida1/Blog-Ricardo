#!/bin/sh

echo "🚀 Starting development application..."

# Check if we're in Docker or local
if [ -f /.dockerenv ]; then
    echo "🐳 Running in Docker container"
    
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
else
    echo "💻 Running locally"
    echo "⚠️  Make sure you have Node.js 18+ and PostgreSQL running"
    echo "🌐 Starting Next.js development server..."
    exec npm run dev
fi
