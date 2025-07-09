#!/bin/bash

echo "🚀 Testing Fullstack Docker Project"
echo "==================================="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if servers are running
echo -e "${BLUE}📋 Checking if all services are running...${NC}"
echo

# Check server
if curl -s http://localhost:5000/ping > /dev/null; then
    echo -e "${GREEN}✅ Server (port 5000) - Running${NC}"
else
    echo -e "${RED}❌ Server (port 5000) - Not running${NC}"
fi

# Check client
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Client (port 3000) - Running${NC}"
else
    echo -e "${RED}❌ Client (port 3000) - Not running${NC}"
fi

# Check admin
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Admin (port 3001) - Running${NC}"
else
    echo -e "${RED}❌ Admin (port 3001) - Not running${NC}"
fi

echo
echo -e "${BLUE}🔧 Testing Admin Controls...${NC}"
echo

# Test 1: Toggle maintenance mode ON
echo "1. Enabling maintenance mode..."
curl -s -X PUT http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"maintenanceMode": true}' | jq .success

echo "   Now refresh client (http://localhost:3000) - should show maintenance page"
echo

sleep 2

# Test 2: Disable a feature
echo "2. Disabling 'Secure' feature..."
curl -s -X PUT http://localhost:5000/api/features/2 \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}' | jq .success

echo

sleep 2

# Test 3: Deactivate a user
echo "3. Deactivating user John Doe..."
curl -s -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"active": false}' | jq .success

echo

sleep 2

# Show current stats
echo -e "${BLUE}📊 Current Stats:${NC}"
curl -s http://localhost:5000/api/stats | jq .data

echo
echo -e "${BLUE}💡 Manual Testing Steps:${NC}"
echo "1. Open http://localhost:3000 (Client) - Should show maintenance mode"
echo "2. Open http://localhost:3001 (Admin) - Control the client from here"
echo "3. In admin panel:"
echo "   - Toggle maintenance mode OFF to restore client"
echo "   - Toggle features ON/OFF and see changes in client"
echo "   - Toggle user statuses and see stats update"
echo "   - Click refresh to see real-time data"
echo
echo "4. Toggle maintenance mode OFF:"
echo "   curl -X PUT http://localhost:5000/api/settings -H 'Content-Type: application/json' -d '{\"maintenanceMode\": false}'"
echo

echo -e "${GREEN}🎉 All systems ready for testing!${NC}"
