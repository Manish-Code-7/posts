import React, { useState, useEffect } from 'react';

const RealTimeStatus = () => {
    const [status, setStatus] = useState({ online: true, latency: 45 });

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate changing latency and occasional hiccups
            const newLatency = Math.floor(Math.random() * 80) + 20;
            const isOnline = Math.random() > 0.05; // 95% chance to be online

            setStatus({
                online: isOnline,
                latency: isOnline ? newLatency : 0
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        if (!status.online) return 'red';
        if (status.latency < 50) return 'green';
        return 'orange';
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.85rem',
            padding: '5px 10px',
            borderRadius: '15px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            marginLeft: 'auto'
        }}>
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(),
                marginRight: '8px',
                boxShadow: `0 0 5px ${getStatusColor()}`
            }}></div>
            <span style={{ fontWeight: '500', color: '#333' }}>
                {status.online ? `System Operational (${status.latency}ms)` : 'Connecting...'}
            </span>
        </div>
    );
};

export default RealTimeStatus;
