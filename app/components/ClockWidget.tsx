'use client';
import { useState, useEffect } from 'react';

export default function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null; // Avoid hydration mismatch

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '16px',
      padding: '1rem 1.5rem',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontFamily: 'inherit',
      pointerEvents: 'none' // Don't block clicks
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18181b' }}>{timeStr}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#71717a', marginTop: '0.25rem' }}>{dateStr}</div>
    </div>
  );
}
