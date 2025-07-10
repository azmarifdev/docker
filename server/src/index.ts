import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
    try {
        const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dockerapp';
        await mongoose.connect(DB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        // Don't exit process in development - allow server to run without DB
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

// Connect to database
connectDB();

// In-memory data store for demo (would be database in real app)
let appSettings = {
    siteName: 'My App',
    heroTitle: 'Welcome to My App',
    heroSubtitle: 'A simple and modern web application built for Docker learning.',
    maintenanceMode: false,
    featuredContent: [
        { id: 1, title: '🚀 Fast', description: 'Built with Next.js for optimal performance', enabled: true },
        { id: 2, title: '🔒 Secure', description: 'Enterprise-grade security features', enabled: true },
        { id: 3, title: '📱 Responsive', description: 'Works perfectly on all devices', enabled: true },
        { id: 4, title: '🛠️ Scalable', description: 'Ready to grow with your business', enabled: true },
    ],
};

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true, role: 'user', createdAt: '2025-01-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true, role: 'admin', createdAt: '2025-01-02' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: false, role: 'user', createdAt: '2025-01-03' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', active: true, role: 'user', createdAt: '2025-01-04' },
];

// Routes

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Docker App API',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
  


app.get('/ping', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
        success: true,
        server: 'healthy',
        database: dbStatus,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users,
    });
});

// Admin endpoint to update user status
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { active } = req.body;

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    users[userIndex].active = active;

    res.json({
        success: true,
        message: 'User updated successfully',
        data: users[userIndex],
    });
});

// Get app settings for client
app.get('/api/settings', (req, res) => {
    res.json({
        success: true,
        data: appSettings,
    });
});

// Admin endpoint to update app settings
app.put('/api/settings', (req, res) => {
    const { siteName, heroTitle, heroSubtitle, maintenanceMode } = req.body;

    if (siteName) appSettings.siteName = siteName;
    if (heroTitle) appSettings.heroTitle = heroTitle;
    if (heroSubtitle) appSettings.heroSubtitle = heroSubtitle;
    if (maintenanceMode !== undefined) appSettings.maintenanceMode = maintenanceMode;

    res.json({
        success: true,
        message: 'Settings updated successfully',
        data: appSettings,
    });
});

// Admin endpoint to toggle feature
app.put('/api/features/:id', (req, res) => {
    const featureId = parseInt(req.params.id);
    const { enabled } = req.body;

    const featureIndex = appSettings.featuredContent.findIndex((f) => f.id === featureId);
    if (featureIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Feature not found',
        });
    }

    appSettings.featuredContent[featureIndex].enabled = enabled;

    res.json({
        success: true,
        message: 'Feature updated successfully',
        data: appSettings.featuredContent[featureIndex],
    });
});

app.get('/api/stats', (req, res) => {
    // Calculate real stats from our data
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.active).length;
    const adminUsers = users.filter((u) => u.role === 'admin').length;
    const enabledFeatures = appSettings.featuredContent.filter((f) => f.enabled).length;

    const stats = {
        totalUsers,
        activeUsers,
        adminUsers,
        enabledFeatures,
        maintenanceMode: appSettings.maintenanceMode,
        revenue: 12345,
        orders: 567,
        growth: {
            users: '+12%',
            revenue: '+8%',
            orders: '+15%',
        },
    };

    res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 Ping endpoint: http://localhost:${PORT}/ping`);
    console.log(`📍 API Users: http://localhost:${PORT}/api/users`);
    console.log(`📍 API Stats: http://localhost:${PORT}/api/stats`);
});

export default app;
