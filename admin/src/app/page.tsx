'use client';

import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    role: string;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    enabledFeatures: number;
    maintenanceMode: boolean;
    revenue: number;
    orders: number;
    growth: {
        users: string;
        revenue: string;
        orders: string;
    };
}

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

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch data from server
    const fetchData = async () => {
        try {
            const [statsRes, usersRes, settingsRes] = await Promise.all([
                fetch('http://localhost:5000/api/stats'),
                fetch('http://localhost:5000/api/users'),
                fetch('http://localhost:5000/api/settings'),
            ]);

            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            const settingsData = await settingsRes.json();

            setStats(statsData.data);
            setUsers(usersData.data);
            setSettings(settingsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Toggle user active status
    const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (response.ok) {
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Toggle maintenance mode
    const toggleMaintenanceMode = async () => {
        if (!settings) return;

        try {
            const response = await fetch('http://localhost:5000/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ maintenanceMode: !settings.maintenanceMode }),
            });

            if (response.ok) {
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    // Toggle feature
    const toggleFeature = async (featureId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:5000/api/features/${featureId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled: !currentStatus }),
            });

            if (response.ok) {
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error updating feature:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading">Loading dashboard data...</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <button onClick={fetchData} className="refresh-btn">
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats?.totalUsers || 0}</p>
                    <span className="stat-change">{stats?.growth.users}</span>
                </div>
                <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-number">{stats?.activeUsers || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Revenue</h3>
                    <p className="stat-number">${stats?.revenue?.toLocaleString() || 0}</p>
                    <span className="stat-change">{stats?.growth.revenue}</span>
                </div>
                <div className="stat-card">
                    <h3>Orders</h3>
                    <p className="stat-number">{stats?.orders || 0}</p>
                    <span className="stat-change">{stats?.growth.orders}</span>
                </div>
            </div>

            {/* Site Controls */}
            <div className="control-section">
                <h2>Site Controls</h2>
                <div className="control-grid">
                    <div className="control-card">
                        <h3>Maintenance Mode</h3>
                        <p>
                            Currently: <strong>{settings?.maintenanceMode ? 'ON' : 'OFF'}</strong>
                        </p>
                        <button
                            onClick={toggleMaintenanceMode}
                            className={`toggle-btn ${settings?.maintenanceMode ? 'danger' : 'success'}`}>
                            {settings?.maintenanceMode ? 'Disable' : 'Enable'} Maintenance
                        </button>
                    </div>
                    <div className="control-card">
                        <h3>Site Settings</h3>
                        <p>
                            Site Name: <strong>{settings?.siteName}</strong>
                        </p>
                        <p>
                            Hero Title: <strong>{settings?.heroTitle}</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* User Management */}
            <div className="user-section">
                <h2>User Management</h2>
                <div className="user-table">
                    <div className="table-header">
                        <span>Name</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>
                    {users.map((user) => (
                        <div key={user.id} className="table-row">
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                            <span className={`role ${user.role}`}>{user.role}</span>
                            <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                                {user.active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                                onClick={() => toggleUserStatus(user.id, user.active)}
                                className={`action-btn ${user.active ? 'deactivate' : 'activate'}`}>
                                {user.active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Management */}
            <div className="feature-section">
                <h2>Feature Management</h2>
                <div className="feature-grid">
                    {settings?.featuredContent.map((feature) => (
                        <div key={feature.id} className="feature-card">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                            <div className="feature-controls">
                                <span className={`status ${feature.enabled ? 'enabled' : 'disabled'}`}>
                                    {feature.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <button
                                    onClick={() => toggleFeature(feature.id, feature.enabled)}
                                    className={`toggle-btn ${feature.enabled ? 'danger' : 'success'}`}>
                                    {feature.enabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
