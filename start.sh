#!/bin/bash

# Start both backend and frontend servers
echo "Starting Text Annotation Tool..."
echo "Backend will run on http://localhost:8000"
echo "Frontend will run on http://localhost:3000"

# Start backend server
cd /Users/punzueta/software/text-annotation-tool/backend
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
cd /Users/punzueta/software/text-annotation-tool
npx webpack serve --mode development &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Register the cleanup function for when script is terminated
trap cleanup SIGINT SIGTERM

echo "Servers are running. Press Ctrl+C to stop."
wait
