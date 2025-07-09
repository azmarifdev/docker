# Docker Learning Project - Full Integration

A complete fullstack application with **real-time admin controls** designed for learning Docker containerization. The admin panel can control the client app in real-time through a shared API server.

## 🎯 **Key Features**

-   **Real-time Control**: Admin panel controls client app content dynamically
-   **Maintenance Mode**: Admin can enable/disable maintenance mode for client
-   **Feature Management**: Toggle individual features on/off from admin
-   **User Management**: Activate/deactivate users and see live stats
-   **Live Data**: All data flows through the central API server
-   **Responsive Design**: Works on all devices

## 📁 Project Structure

```
project-root/
├── admin/          → Next.js + TypeScript (Admin panel)
├── client/         → Next.js + TypeScript (User frontend)
├── server/         → Node.js + Express + MongoDB (API server)
└── README.md       → This file
```

## 🚀 Components

### 1. Admin Panel (`/admin`)

-   **Framework**: Next.js 14 with TypeScript
-   **Port**: 3001
-   **Features**: Simple admin dashboard with navigation and stats
-   **Purpose**: Administrative interface for managing the application

### 2. Client App (`/client`)

-   **Framework**: Next.js 14 with TypeScript
-   **Port**: 3000
-   **Features**: Modern landing page with hero section, features, and stats
-   **Purpose**: Public-facing user interface

### 3. Server API (`/server`)

-   **Framework**: Node.js with Express and TypeScript
-   **Database**: MongoDB with Mongoose
-   **Port**: 5000
-   **Features**: RESTful API with health checks and mock data endpoints
-   **Purpose**: Backend API serving both frontend applications

## 📋 Available Scripts

### Admin Panel

```bash
cd admin
npm install
npm run dev    # Development server on port 3001
npm run build  # Production build
npm start      # Production server
```

### Client App

```bash
cd client
npm install
npm run dev    # Development server on port 3000
npm run build  # Production build
npm start      # Production server
```

### Server API

```bash
cd server
npm install
npm run dev    # Development server with hot reload
npm run build  # Compile TypeScript to JavaScript
npm start      # Production server
```

## 🔗 API Endpoints

The server provides several endpoints for testing:

-   **GET** `/ping` - Simple ping response
-   **GET** `/health` - Health check with system info
-   **GET** `/api/users` - Mock user data
-   **GET** `/api/stats` - Mock statistics data

## 🌐 Local Development URLs

-   **Client App**: http://localhost:3000
-   **Admin Panel**: http://localhost:3001
-   **Server API**: http://localhost:5000
-   **Health Check**: http://localhost:5000/health

## 🗄️ Database Configuration

The server is configured to connect to MongoDB with the following default settings:

-   **URI**: `mongodb://localhost:27017/dockerapp`
-   **Database**: `dockerapp`

You can modify the connection string in `/server/.env`:

```env
DB_URI=mongodb://localhost:27017/dockerapp
```

## 🐳 Docker Ready

This project structure is prepared for Docker containerization:

1. Each component (`admin`, `client`, `server`) can be containerized separately
2. The server includes environment variable configuration
3. Next.js apps are configured with `output: 'standalone'` for optimal Docker builds
4. All necessary dependencies and scripts are properly configured

## 🛠️ Development Setup

1. **Clone or create the project structure**
2. **Install dependencies for each component**:

    ```bash
    # Install admin dependencies
    cd admin && npm install

    # Install client dependencies
    cd ../client && npm install

    # Install server dependencies
    cd ../server && npm install
    ```

3. **Start MongoDB** (if using local instance):

    ```bash
    mongod
    ```

4. **Run each component** in separate terminals:

    ```bash
    # Terminal 1: Server
    cd server && npm run dev

    # Terminal 2: Client
    cd client && npm run dev

    # Terminal 3: Admin
    cd admin && npm run dev
    ```

## 📝 Notes

-   The server will start even if MongoDB is not available (development mode)
-   All components use TypeScript for better development experience
-   CORS is enabled on the server for cross-origin requests
-   Environment variables are configured but can be customized
-   Mock data is provided for testing without a real database

## 🎯 Next Steps

This structure is ready for Docker learning exercises:

-   Create Dockerfiles for each component
-   Set up docker-compose for orchestration
-   Configure container networking
-   Implement volume mounting for development
-   Set up production optimizations

Happy Docker learning! 🐳
