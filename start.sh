#!/bin/bash

echo "=========================================="
echo "  Professional Coaching Website Startup"
echo "=========================================="
echo ""

# Kill processes on ports 3000, 4000, 4001
echo "Clearing ports 3000, 4000, 4001..."
for port in 3000 4000 4001; do
  pid=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "  Killing process on port $port (PID: $pid)"
    kill -9 $pid 2>/dev/null
  else
    echo "  Port $port is free"
  fi
done

# Kill any running next dev processes
pkill -f "next dev" 2>/dev/null

# Clean up Next.js lock file
rm -rf .next/dev/lock 2>/dev/null

echo ""
sleep 1

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! psql -U postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "  ERROR: PostgreSQL is not running!"
  echo "  Please start PostgreSQL and try again."
  exit 1
fi
echo "  PostgreSQL is running"
echo ""

# Create database if it doesn't exist
echo "Ensuring database exists..."
psql -U postgres -c "CREATE DATABASE coaching;" 2>/dev/null || echo "  Database 'coaching' already exists"
echo ""

# Push schema to database
echo "Pushing Prisma schema to database..."
npm run db:push
echo ""

# Seed the database
echo "Seeding database with sample data..."
npm run db:seed
echo ""

# Start the development server
echo "=========================================="
echo "  Starting development server..."
echo "=========================================="
echo ""
echo "  Website will be available at:"
echo "  http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop the server"
echo ""

npm run dev
