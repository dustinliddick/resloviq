#!/bin/bash

# ResolvIQ Management Script
# Usage: ./start.sh [command] [options]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ResolvIQ"
DOCKER_IMAGE="resolviq:latest"
CONTAINER_NAME="resolviq-app"
PORT=1337

show_help() {
    echo -e "${BLUE}${APP_NAME} Management Script${NC}"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build      Build the Docker image"
    echo "  deploy     Deploy the application with Docker Compose"
    echo "  dev        Start in development mode (local Python)"
    echo "  stop       Stop running containers"
    echo "  restart    Restart the application"
    echo "  logs       Show application logs"
    echo "  clean      Clean up containers and images"
    echo "  status     Show running status"
    echo "  help       Show this help message"
    echo ""
    echo "Options:"
    echo "  --force    Force rebuild/restart"
    echo "  --prod     Use production configuration"
    echo "  --detach   Run in background (default for deploy)"
    echo ""
    echo "Examples:"
    echo "  $0 build                # Build Docker image"
    echo "  $0 deploy               # Deploy with Docker Compose"
    echo "  $0 deploy --prod        # Deploy in production mode"
    echo "  $0 dev                  # Start development server"
    echo "  $0 restart --force      # Force restart"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
        exit 1
    fi
}

check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not available${NC}"
        exit 1
    fi
}

build_image() {
    echo -e "${BLUE}🔨 Building ${APP_NAME} Docker image...${NC}"
    check_docker
    
    # Build the Docker image
    docker build -t ${DOCKER_IMAGE} .
    
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
}

deploy_app() {
    local PROD_MODE=false
    local FORCE=false
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --prod)
                PROD_MODE=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            *)
                shift
                ;;
        esac
    done
    
    echo -e "${BLUE}🐳 Deploying ${APP_NAME}...${NC}"
    check_docker
    check_docker_compose
    
    # Set environment variables
    if [ "$PROD_MODE" = true ]; then
        export FLASK_ENV=production
        export FLASK_DEBUG=0
        echo -e "${YELLOW}🏭 Production mode enabled${NC}"
    else
        export FLASK_ENV=development
        export FLASK_DEBUG=1
        echo -e "${YELLOW}🛠️  Development mode enabled${NC}"
    fi
    
    # Deploy with Docker Compose
    if [ "$FORCE" = true ]; then
        echo -e "${YELLOW}🔄 Force rebuilding containers...${NC}"
        docker-compose down
        docker-compose up -d --build --force-recreate
    else
        docker-compose up -d --build
    fi
    
    echo -e "${GREEN}✅ ${APP_NAME} is now running at http://localhost:${PORT}${NC}"
}

dev_mode() {
    echo -e "${BLUE}🛠️  Starting ${APP_NAME} in development mode...${NC}"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
        python3 -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    source venv/bin/activate
    pip install -r requirements.txt
    
    # Start development server
    echo -e "${GREEN}🚀 Starting development server on http://localhost:${PORT}${NC}"
    python run.py
}

stop_app() {
    echo -e "${BLUE}🛑 Stopping ${APP_NAME}...${NC}"
    check_docker_compose
    
    docker-compose down
    echo -e "${GREEN}✅ ${APP_NAME} stopped${NC}"
}

restart_app() {
    local FORCE=false
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force)
                FORCE=true
                shift
                ;;
            *)
                shift
                ;;
        esac
    done
    
    echo -e "${BLUE}🔄 Restarting ${APP_NAME}...${NC}"
    
    if [ "$FORCE" = true ]; then
        stop_app
        deploy_app --force
    else
        check_docker_compose
        docker-compose restart
        echo -e "${GREEN}✅ ${APP_NAME} restarted${NC}"
    fi
}

show_logs() {
    echo -e "${BLUE}📋 Showing ${APP_NAME} logs...${NC}"
    check_docker_compose
    
    docker-compose logs -f
}

clean_up() {
    echo -e "${BLUE}🧹 Cleaning up ${APP_NAME} containers and images...${NC}"
    check_docker
    
    # Stop and remove containers
    docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true
    
    # Remove dangling images
    docker image prune -f
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

show_status() {
    echo -e "${BLUE}📊 ${APP_NAME} Status${NC}"
    echo ""
    
    check_docker
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        echo -e "${GREEN}✅ Application is running${NC}"
        docker-compose ps
        echo ""
        echo -e "${BLUE}📡 Access URL: http://localhost:${PORT}${NC}"
    else
        echo -e "${YELLOW}⚠️  Application is not running${NC}"
        echo "Use '$0 deploy' to start the application"
    fi
}

# Main command processing
case "${1:-help}" in
    build)
        shift
        build_image "$@"
        ;;
    deploy)
        shift
        deploy_app "$@"
        ;;
    dev)
        shift
        dev_mode "$@"
        ;;
    stop)
        shift
        stop_app "$@"
        ;;
    restart)
        shift
        restart_app "$@"
        ;;
    logs)
        shift
        show_logs "$@"
        ;;
    clean)
        shift
        clean_up "$@"
        ;;
    status)
        shift
        show_status "$@"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
