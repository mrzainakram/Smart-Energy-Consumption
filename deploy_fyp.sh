#!/bin/bash

# Smart Energy AI FYP - Deployment Script
# Starts both backend and frontend servers for the LESCO energy prediction system

echo "🎓 Starting Smart Energy AI FYP System"
echo "AI-based Smart Energy Consumption Prediction with LESCO Integration"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="/Users/apple/Downloads/smart_energy_consumption"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo -e "${BLUE}📁 Project Directory: $PROJECT_DIR${NC}"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to start backend server
start_backend() {
    echo -e "\n${YELLOW}🔧 Starting Django Backend Server...${NC}"
    cd "$BACKEND_DIR"
    
    # Check if manage.py exists
    if [ ! -f "manage.py" ]; then
        echo -e "${RED}❌ manage.py not found in backend directory${NC}"
        return 1
    fi
    
    # Install dependencies if needed
    echo "📦 Installing Python dependencies..."
    python3 -m pip install -r requirements.txt python-decouple
    
    # Run migrations
    echo "🗄️  Running database migrations..."
    python3 manage.py migrate
    
    # Check if port 8000 is available
    if check_port 8000; then
        echo -e "${YELLOW}⚠️  Port 8000 is already in use. Stopping existing process...${NC}"
        pkill -f "manage.py runserver"
        sleep 2
    fi
    
    # Start Django server
    echo -e "${GREEN}🚀 Starting Django server on http://localhost:8000${NC}"
    echo -e "${BLUE}   - LESCO Billing API: http://localhost:8000/lesco/calculate-bill/${NC}"
    echo -e "${BLUE}   - Historical Prediction: http://localhost:8000/lesco/predict/${NC}"
    echo -e "${BLUE}   - Bill Scanner: http://localhost:8000/lesco/scan-bill/${NC}"
    echo -e "${BLUE}   - Energy Recommendations: http://localhost:8000/lesco/recommendations/${NC}"
    
    # Start server in background
    nohup python3 manage.py runserver 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait a moment and check if server started
    sleep 3
    if ps -p $BACKEND_PID > /dev/null; then
        echo -e "${GREEN}✅ Backend server started successfully (PID: $BACKEND_PID)${NC}"
        echo "$BACKEND_PID" > ../backend.pid
        return 0
    else
        echo -e "${RED}❌ Failed to start backend server${NC}"
        return 1
    fi
}

# Function to start frontend server
start_frontend() {
    echo -e "\n${YELLOW}🔧 Starting React Frontend Server...${NC}"
    cd "$FRONTEND_DIR"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found in frontend directory${NC}"
        return 1
    fi
    
    # Install dependencies
    echo "📦 Installing Node.js dependencies..."
    npm install
    
    # Check if port 5173 is available (Vite default)
    if check_port 5173; then
        echo -e "${YELLOW}⚠️  Port 5173 is already in use. Stopping existing process...${NC}"
        pkill -f "vite"
        sleep 2
    fi
    
    # Start Vite dev server
    echo -e "${GREEN}🚀 Starting React dev server on http://localhost:5173${NC}"
    echo -e "${BLUE}   - LESCO Prediction System${NC}"
    echo -e "${BLUE}   - Cross-platform Authentication${NC}"
    echo -e "${BLUE}   - 3D Graphics Interface${NC}"
    echo -e "${BLUE}   - Bill Scanning Component${NC}"
    
    # Start server in background
    nohup npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait a moment and check if server started
    sleep 5
    if ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${GREEN}✅ Frontend server started successfully (PID: $FRONTEND_PID)${NC}"
        echo "$FRONTEND_PID" > ../frontend.pid
        return 0
    else
        echo -e "${RED}❌ Failed to start frontend server${NC}"
        return 1
    fi
}

# Function to test system
test_system() {
    echo -e "\n${YELLOW}🧪 Testing System Endpoints...${NC}"
    
    # Test backend health
    echo "Testing backend health..."
    if curl -s http://localhost:8000/health/ > /dev/null; then
        echo -e "${GREEN}✅ Backend server responding${NC}"
    else
        echo -e "${RED}❌ Backend server not responding${NC}"
    fi
    
    # Test LESCO endpoints
    echo "Testing LESCO tariff endpoint..."
    if curl -s http://localhost:8000/lesco/tariff-info/ > /dev/null; then
        echo -e "${GREEN}✅ LESCO endpoints working${NC}"
    else
        echo -e "${RED}❌ LESCO endpoints not responding${NC}"
    fi
    
    # Test frontend
    echo "Testing frontend server..."
    if curl -s http://localhost:5173/ > /dev/null; then
        echo -e "${GREEN}✅ Frontend server responding${NC}"
    else
        echo -e "${RED}❌ Frontend server not responding${NC}"
    fi
}

# Function to show system status
show_status() {
    echo -e "\n${BLUE}📊 SYSTEM STATUS${NC}"
    echo "=================================================="
    
    # Backend status
    if [ -f "$PROJECT_DIR/backend.pid" ]; then
        BACKEND_PID=$(cat "$PROJECT_DIR/backend.pid")
        if ps -p $BACKEND_PID > /dev/null; then
            echo -e "${GREEN}✅ Backend Server: Running (PID: $BACKEND_PID)${NC}"
            echo -e "   URL: http://localhost:8000"
            echo -e "   Logs: $PROJECT_DIR/backend.log"
        else
            echo -e "${RED}❌ Backend Server: Not running${NC}"
        fi
    else
        echo -e "${RED}❌ Backend Server: Not started${NC}"
    fi
    
    # Frontend status  
    if [ -f "$PROJECT_DIR/frontend.pid" ]; then
        FRONTEND_PID=$(cat "$PROJECT_DIR/frontend.pid")
        if ps -p $FRONTEND_PID > /dev/null; then
            echo -e "${GREEN}✅ Frontend Server: Running (PID: $FRONTEND_PID)${NC}"
            echo -e "   URL: http://localhost:5173"
            echo -e "   Logs: $PROJECT_DIR/frontend.log"
        else
            echo -e "${RED}❌ Frontend Server: Not running${NC}"
        fi
    else
        echo -e "${RED}❌ Frontend Server: Not started${NC}"
    fi
    
    echo -e "\n${BLUE}🔧 Available Commands:${NC}"
    echo "  ./deploy_fyp.sh start    - Start both servers"
    echo "  ./deploy_fyp.sh stop     - Stop both servers"  
    echo "  ./deploy_fyp.sh restart  - Restart both servers"
    echo "  ./deploy_fyp.sh status   - Show system status"
    echo "  ./deploy_fyp.sh test     - Test system endpoints"
}

# Function to stop servers
stop_servers() {
    echo -e "\n${YELLOW}🛑 Stopping FYP System Servers...${NC}"
    
    # Stop backend
    if [ -f "$PROJECT_DIR/backend.pid" ]; then
        BACKEND_PID=$(cat "$PROJECT_DIR/backend.pid")
        if ps -p $BACKEND_PID > /dev/null; then
            kill $BACKEND_PID
            echo -e "${GREEN}✅ Backend server stopped${NC}"
        fi
        rm -f "$PROJECT_DIR/backend.pid"
    fi
    
    # Stop frontend
    if [ -f "$PROJECT_DIR/frontend.pid" ]; then
        FRONTEND_PID=$(cat "$PROJECT_DIR/frontend.pid")
        if ps -p $FRONTEND_PID > /dev/null; then
            kill $FRONTEND_PID
            echo -e "${GREEN}✅ Frontend server stopped${NC}"
        fi
        rm -f "$PROJECT_DIR/frontend.pid"
    fi
    
    # Kill any remaining processes
    pkill -f "manage.py runserver"
    pkill -f "vite"
    
    echo -e "${GREEN}✅ All servers stopped${NC}"
}

# Main script logic
case "$1" in
    "start")
        echo -e "${GREEN}🚀 Starting FYP System...${NC}"
        start_backend
        if [ $? -eq 0 ]; then
            start_frontend
            if [ $? -eq 0 ]; then
                echo -e "\n${GREEN}🎉 FYP System Started Successfully!${NC}"
                echo -e "${BLUE}📖 Access your system:${NC}"
                echo -e "   Frontend: http://localhost:5173"
                echo -e "   Backend API: http://localhost:8000"
                echo -e "   LESCO Prediction: http://localhost:5173 (after login)"
                test_system
                show_status
            fi
        fi
        ;;
    "stop")
        stop_servers
        ;;
    "restart")
        stop_servers
        sleep 2
        $0 start
        ;;
    "status")
        show_status
        ;;
    "test")
        test_system
        ;;
    *)
        echo -e "${BLUE}🎓 Smart Energy AI FYP - Deployment Script${NC}"
        echo "Usage: $0 {start|stop|restart|status|test}"
        echo ""
        echo "Commands:"
        echo "  start   - Start backend and frontend servers"
        echo "  stop    - Stop all running servers"
        echo "  restart - Restart all servers"
        echo "  status  - Show current system status"
        echo "  test    - Test system endpoints"
        echo ""
        echo -e "${GREEN}Example: $0 start${NC}"
        ;;
esac
