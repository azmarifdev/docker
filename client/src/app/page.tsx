'use client';

import { useState, useEffect } from 'react';

interface AppSettings {
    siteName: string;
    heroTitle: string;
    heroSubtitle: string;
    maintenanceMode: boolean;
    featuredContent: Array<{
        id: number;
        title: string;
        description: string;
        enabled: boolean;
    }>;
}

interface Stats {
    totalUsers: number;
    activeUsers: number;
    orders: number;
}

export default function HomePage() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch data from server
    const fetchData = async () => {
        try {
            const [settingsRes, statsRes] = await Promise.all([
                fetch('http://localhost:5000/api/settings'),
                fetch('http://localhost:5000/api/stats'),
            ]);

            const settingsData = await settingsRes.json();
            const statsData = await statsRes.json();

            setSettings(settingsData.data);
            setStats(statsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Set fallback data if server is not available
            setSettings({
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
            });
            setStats({
                totalUsers: 1000,
                activeUsers: 850,
                orders: 500,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Refresh data every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Show maintenance mode if enabled
    if (settings?.maintenanceMode) {
        return (
            <div className="maintenance-page">
                <div className="maintenance-content">
                    <h1>🚧 Maintenance Mode</h1>
                    <p>We're currently performing some maintenance. Please check back soon!</p>
                    <div className="maintenance-spinner"></div>
                </div>
            </div>
        );
    }

    // Filter enabled features
    const enabledFeatures = settings?.featuredContent.filter((feature) => feature.enabled) || [];

    return (
        <div className="homepage">
            <section className="hero">
                <div className="hero-content">
                    <h1>{settings?.heroTitle || 'Welcome to My App'}</h1>
                    <p>{settings?.heroSubtitle || 'A simple and modern web application built for Docker learning.'}</p>
                    <button className="cta-button">Get Started</button>
                </div>
            </section>

            {enabledFeatures.length > 0 && (
                <section className="features">
                    <h2>Features</h2>
                    <div className="features-grid">
                        {enabledFeatures.map((feature) => (
                            <div key={feature.id} className="feature-card">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="stats">
                <h2>Our Impact</h2>
                <div className="stats-container">
                    <div className="stat">
                        <h3>{stats?.totalUsers?.toLocaleString() || '10K+'}+</h3>
                        <p>Total Users</p>
                    </div>
                    <div className="stat">
                        <h3>{stats?.activeUsers?.toLocaleString() || '8.5K+'}+</h3>
                        <p>Active Users</p>
                    </div>
                    <div className="stat">
                        <h3>{stats?.orders?.toLocaleString() || '500+'}+</h3>
                        <p>Orders Completed</p>
                    </div>
                </div>
            </section>

            {/* Real-time status indicator */}
            <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Live Data from Server</span>
            </div>
        </div>
    );
}
