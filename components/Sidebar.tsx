'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard',      href: '/',         badge: null },
  { label: 'Code Workspace', href: '/workspace', badge: '3' },
  { label: 'Uni Hub',        href: '/uni-hub',   badge: null },
  { label: 'Placement',      href: '/placement', badge: null },
  { label: 'Portfolio',      href: '/portfolio', badge: null },
  { label: 'Library',        href: '/library',   badge: '2' },
];

const footerItems = [
  { label: 'Settings',     href: '/settings' },
  { label: 'AI Assistant',  href: '/ai' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      {/* ── Top Header Glowing Violet Card ── */}
      <div className="sidebar-brand-card">
        <div className="brand-header-row">
          <div className="brand-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="brand-title">PlacementHub</span>
        </div>

        {/* User Card Profile inside Header */}
        <div className="brand-user-box">
          <div className="brand-avatar">{user?.avatar || 'AC'}</div>
          <div className="brand-user-details">
            <div className="brand-user-name">{user?.name || 'Anubhab Chakraborty'}</div>
            <div className="brand-user-sub">Placement prep · Pro</div>
          </div>
        </div>
      </div>

      {/* ── Main Nav Pills ── */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-pill-item ${isActive ? 'active' : ''}`}
            >
              <span className="pill-item-label">{item.label}</span>
              {item.badge && <span className="pill-item-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer Nav Pills ── */}
      <div className="sidebar-footer-nav">
        {footerItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-pill-item ${isActive ? 'active' : ''}`}
            >
              <span className="pill-item-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
