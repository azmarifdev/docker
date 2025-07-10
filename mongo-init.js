// MongoDB initialization script for Docker
db = db.getSiblingDB('dockerapp');

// Create collections
db.createCollection('users');
db.createCollection('settings');

// Insert initial data
db.users.insertMany([
    {
        _id: ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
        role: 'user',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
    },
    {
        _id: ObjectId(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        active: true,
        role: 'admin',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date(),
    },
    {
        _id: ObjectId(),
        name: 'Bob Johnson',
        email: 'bob@example.com',
        active: false,
        role: 'user',
        createdAt: new Date('2025-01-03'),
        updatedAt: new Date(),
    },
    {
        _id: ObjectId(),
        name: 'Alice Brown',
        email: 'alice@example.com',
        active: true,
        role: 'user',
        createdAt: new Date('2025-01-04'),
        updatedAt: new Date(),
    },
]);

db.settings.insertOne({
    _id: ObjectId(),
    siteName: 'My Docker App',
    heroTitle: 'Welcome to Dockerized App',
    heroSubtitle: 'A fully containerized application for learning Docker',
    maintenanceMode: false,
    featuredContent: [
        {
            id: 1,
            title: '🐳 Dockerized',
            description: 'Fully containerized with Docker & docker-compose',
            enabled: true,
        },
        {
            id: 2,
            title: '🔒 Secure',
            description: 'Enterprise-grade security features',
            enabled: true,
        },
        {
            id: 3,
            title: '📱 Responsive',
            description: 'Works perfectly on all devices',
            enabled: true,
        },
        {
            id: 4,
            title: '🛠️ Scalable',
            description: 'Ready to grow with your business',
            enabled: true,
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
});

print('Database initialized successfully!');
print('Collections created: users, settings');
print('Sample data inserted.');
