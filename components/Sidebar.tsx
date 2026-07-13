'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: '⊞', label: 'Dashboard', href: '/' },
  { icon: '⌨', label: 'Code Workspace', href: '/workspace', badge: '3' },
  { icon: '🎓', label: 'Uni Hub', href: '/uni-hub' },
  { icon: '💼', label: 'Placement', href: '/placement' },
  { icon: '🌐', label: 'Portfolio', href: '/portfolio' },
];

const footerItems = [
  { icon: '⚙', label: 'Settings', href: '/settings' },
  { icon: '🤖', label: 'AI Assistant', href: '/ai' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <span className="logo-text">PlacementHub</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Main</span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {footerItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* User card at bottom */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px', marginTop: '6px',
          background: 'rgba(124,58,237,0.08)',
          borderRadius: '100px',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c3aed,#c026d3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 800, color: 'white', flexShrink: 0,
            position: 'relative',
          }}>
            AC
            <span style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '8px', height: '8px', background: 'var(--green)',
              borderRadius: '50%', border: '1.5px solid var(--black)',
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Anubhab C.</div>
            <div style={{ fontSize: '9px', color: 'var(--green)' }}>● online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
