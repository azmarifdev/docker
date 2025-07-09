import React from 'react';
import './globals.css';

export const metadata = {
    title: 'Admin Panel',
    description: 'Simple admin panel for Docker learning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <nav className="navbar">
                    <div className="nav-container">
                        <h1>Admin Panel</h1>
                        <div className="nav-links">
                            <a href="/">Dashboard</a>
                            <a href="/users">Users</a>
                            <a href="/settings">Settings</a>
                        </div>
                    </div>
                </nav>
                <main className="main-content">{children}</main>
            </body>
        </html>
    );
}
