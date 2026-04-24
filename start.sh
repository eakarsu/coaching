#!/bin/bash

echo "=========================================="
echo "  AI Productivity Suite Startup"
echo "=========================================="
echo ""

# Kill processes on ports 3000, 3001, 4000, 4001 (NOT 5000)
echo "Clearing ports 3000, 3001, 4000, 4001..."
for port in 3000 3001 4000 4001; do
  pid=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "  Killing process on port $port (PID: $pid)"
    kill -9 $pid 2>/dev/null
  else
    echo "  Port $port is free"
  fi
done

# Kill any running next dev processes
echo "Cleaning up old Next.js processes..."
pkill -f "next dev" 2>/dev/null
pkill -f "next-router-worker" 2>/dev/null

# Clean up Next.js lock file and cache
rm -rf .next/dev/lock 2>/dev/null
rm -rf .next/cache 2>/dev/null

echo ""
sleep 1

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! psql -U postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "  ERROR: PostgreSQL is not running!"
  echo "  Please start PostgreSQL with one of these methods:"
  echo ""
  echo "  Using Docker:"
  echo "    docker run --name coaching-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=coaching -p 5432:5432 -d postgres:16"
  echo ""
  echo "  Or start your local PostgreSQL service"
  exit 1
fi
echo "  PostgreSQL is running"
echo ""

# Create database if it doesn't exist
echo "Ensuring database exists..."
psql -U postgres -c "CREATE DATABASE coaching;" 2>/dev/null || echo "  Database 'coaching' already exists"
echo ""

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate
echo ""

# Push schema to database
echo "Pushing Prisma schema to database..."
npm run db:push
echo ""

# Seed the database with all data (including AI features)
echo "Seeding database with sample data..."
echo "  - Services, Testimonials, Blog Posts"
echo "  - Users, Goals, Habits, Sessions"
echo "  - Decisions, Homework, Moods, Predictions"
npm run db:seed
echo ""

# Display information
echo "=========================================="
echo "  Starting development server with hot reload..."
echo "=========================================="
echo ""
echo "  Application URLs:"
echo "  -----------------------------------------"
echo "  Home:        http://localhost:3000"
echo "  Login:       http://localhost:3000/login"
echo "  Dashboard:   http://localhost:3000/dashboard"
echo "  Admin:       http://localhost:3000/admin"
echo "  -----------------------------------------"
echo ""
echo "  AI Features (after login):"
echo "  - Goal Tracker:      /dashboard/goals"
echo "  - Habit Tracker:     /dashboard/habits"
echo "  - Session Summarizer:/dashboard/sessions"
echo "  - Decision Helper:   /dashboard/decisions"
echo "  - Homework Generator:/dashboard/homework"
echo "  - Goal Setter:       /dashboard/goal-setter"
echo "  - Mood Tracker:      /dashboard/moods"
echo "  - Outcome Predictor: /dashboard/predictions"
echo ""
echo "  Demo Credentials:"
echo "  Email:    demo@example.com"
echo "  Password: demo123"
echo ""
echo "  Hot Reload: File changes will automatically reload"
echo ""
echo "  Press Ctrl+C to stop the server"
echo ""

# Start the development server with turbo for faster hot reload
npm run dev
