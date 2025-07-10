#!/bin/bash

echo "🐳 Docker Full-Stack Application"
echo "================================"
echo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to check if ports are available
check_ports() {
    echo -e "${BLUE}🔍 Checking if ports are available...${NC}"
    
    for port in 3000 3001 5000 27017; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  Port $port is in use. Stopping existing process...${NC}"
            # Kill process using the port
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
    echo -e "${GREEN}✅ All ports are available${NC}"
}

# Function to build and start containers
start_containers() {
    echo -e "${BLUE}🔨 Building and starting containers...${NC}"
    
    # Build and start all services
    docker-compose down -v 2>/dev/null || true
    docker-compose build --no-cache
    docker-compose up -d
    
    echo -e "${GREEN}✅ Containers started${NC}"
}

# Function to check container health
check_health() {
    echo -e "${BLUE}🏥 Checking container health...${NC}"
    
    # Wait for containers to be healthy
    echo "Waiting for services to be ready..."
    sleep 10
    
    # Check each service
    services=("mongo" "server" "client" "admin")
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            echo -e "${GREEN}✅ $service is running${NC}"
        else
            echo -e "${RED}❌ $service failed to start${NC}"
            docker-compose logs $service
        fi
    done
}

# Function to show application URLs
show_urls() {
    echo
    echo -e "${BLUE}🌐 Application URLs:${NC}"
    echo -e "${GREEN}📱 Client App:    http://localhost:3000${NC}"
    echo -e "${GREEN}🛠️  Admin Panel:  http://localhost:3001${NC}"
    echo -e "${GREEN}🔧 API Server:    http://localhost:5000${NC}"
    echo -e "${GREEN}🗄️  MongoDB:      mongodb://localhost:27017${NC}"
    echo
    echo -e "${BLUE}📊 Health Checks:${NC}"
    echo -e "${GREEN}🔍 Server Ping:   http://localhost:5000/ping${NC}"
    echo -e "${GREEN}🏥 Server Health: http://localhost:5000/health${NC}"
    echo
}

# Function to show useful commands
show_commands() {
    echo -e "${BLUE}💡 Useful Commands:${NC}"
    echo -e "${YELLOW}View logs:        docker-compose logs -f [service]${NC}"
    echo -e "${YELLOW}Stop containers:  docker-compose down${NC}"
    echo -e "${YELLOW}Restart service:  docker-compose restart [service]${NC}"
    echo -e "${YELLOW}View containers:  docker-compose ps${NC}"
    echo -e "${YELLOW}Clean up:         docker-compose down -v --rmi all${NC}"
    echo
}

# Main execution
main() {
    echo -e "${BLUE}Starting Docker setup...${NC}"
    echo
    
    check_docker
    check_ports
    start_containers
    check_health
    show_urls
    show_commands
    
    echo -e "${GREEN}🎉 Docker setup complete!${NC}"
    echo -e "${BLUE}📝 Check the applications in your browser${NC}"
    echo
    echo -e "${YELLOW}To stop all containers: docker-compose down${NC}"
}

# Run main function
main
