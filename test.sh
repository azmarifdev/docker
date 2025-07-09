#!/bin/bash

echo "🐳 Docker Learning Project - Quick Test Script"
echo "=============================================="
echo

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

echo "📋 Checking ports..."
check_port 3000
check_port 3001
check_port 5000
echo

echo "📦 Installing dependencies..."
echo "Installing admin dependencies..."
cd admin && npm install --silent
echo "Installing client dependencies..."
cd ../client && npm install --silent
echo "Installing server dependencies..."
cd ../server && npm install --silent
cd ..
echo "✅ All dependencies installed"
echo

echo "🚀 Testing server..."
cd server
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3

# Test server endpoints
echo "Testing /ping endpoint..."
PING_RESPONSE=$(curl -s http://localhost:5000/ping)
if [[ $PING_RESPONSE == *"success":true* ]]; then
    echo "✅ Server /ping endpoint working"
else
    echo "❌ Server /ping endpoint failed"
fi

echo "Testing /health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/health)
if [[ $HEALTH_RESPONSE == *"success":true* ]]; then
    echo "✅ Server /health endpoint working"
else
    echo "❌ Server /health endpoint failed"
fi

# Stop server
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null
cd ..

echo
echo "🎉 Quick test completed!"
echo
echo "Next steps:"
echo "1. Start the server: cd server && npm run dev"
echo "2. Start the client: cd client && npm run dev"
echo "3. Start the admin: cd admin && npm run dev"
echo
echo "URLs:"
echo "- Client: http://localhost:3000"
echo "- Admin: http://localhost:3001"
echo "- Server: http://localhost:5000"
echo
echo "Ready for Docker containerization! 🐳"
