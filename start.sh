#!/bin/bash

# Lineup Generator - Development Startup Script

echo "🚀 Starting Lineup Generator..."
echo ""

# Check for Java
if ! command -v java &> /dev/null; then
    echo "⚠️  Java not found. Backend requires Java 17+"
    echo "   Install Java and try again, or run frontend only."
    echo ""
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check for Maven wrapper
if [ ! -f "backend/mvnw" ]; then
    echo "⚠️  Maven wrapper not found. Backend may not start."
fi

echo "Choose startup option:"
echo "  1) Frontend only (demo mode)"
echo "  2) Full stack (backend + frontend)"
echo ""
read -p "Enter choice [1/2]: " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing frontend dependencies..."
        cd frontend && npm install
        echo ""
        echo "🎨 Starting frontend..."
        npm run dev
        ;;
    2)
        echo ""
        echo "Starting full stack..."
        
        # Start backend in background
        echo "☕ Starting backend (Spring Boot)..."
        cd backend
        ./mvnw spring-boot:run &
        BACKEND_PID=$!
        cd ..
        
        # Wait for backend to start
        echo "   Waiting for backend to initialize..."
        sleep 10
        
        # Start frontend
        echo ""
        echo "📦 Installing frontend dependencies..."
        cd frontend && npm install
        echo ""
        echo "🎨 Starting frontend..."
        npm run dev
        
        # Cleanup on exit
        trap "kill $BACKEND_PID 2>/dev/null" EXIT
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac
