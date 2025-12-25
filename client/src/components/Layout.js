import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="app-container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>Compegence App</h1>
                    <nav>
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: location.pathname === '/' ? '#3498db' : '#666',
                                fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                                marginRight: '15px'
                            }}
                        >
                            Home
                        </Link>
                    </nav>
                </div>
            </header>
            <main style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
