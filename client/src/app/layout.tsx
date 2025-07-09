'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';

interface AppSettings {
    siteName: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [siteName, setSiteName] = useState('My App');

    useEffect(() => {
        // Fetch site name from server
        const fetchSiteName = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/settings');
                const data = await response.json();
                if (data.success) {
                    setSiteName(data.data.siteName || 'My App');
                }
            } catch (error) {
                console.error('Error fetching site name:', error);
            }
        };

        fetchSiteName();
    }, []);

    return (
        <html lang="en">
            <head>
                <title>{siteName}</title>
                <meta name="description" content="Simple client app for Docker learning" />
            </head>
            <body>
                <header className="header">
                    <div className="header-container">
                        <h1>{siteName}</h1>
                        <nav className="nav">
                            <a href="/">Home</a>
                            <a href="/about">About</a>
                            <a href="/contact">Contact</a>
                        </nav>
                    </div>
                </header>
                <main className="main">{children}</main>
                <footer className="footer">
                    <div className="footer-container">
                        <p>&copy; 2025 {siteName}. All rights reserved.</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
