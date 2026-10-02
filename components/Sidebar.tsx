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
    <aside className="sidebar-purple-container">
      {/* Top Logo White Pill */}
      <div className="sidebar-logo-white-pill">
        <div className="logo-icon-purple">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B46F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="logo-text-dark">PlacementHub</span>
      </div>

      {/* User Card Profile Box inside Purple Sidebar */}
      <div className="sidebar-user-dark-card">
        <div className="sidebar-user-avatar">{user?.avatar || 'AC'}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || 'Anubhab Chakraborty'}</div>
          <div className="sidebar-user-sub">Placement prep · Pro</div>
        </div>
      </div>

      {/* Main Nav Pills */}
      <nav className="sidebar-nav-pills">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-dark-pill ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-pill-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav Pills */}
      <div className="sidebar-footer-pills">
        {footerItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-dark-pill ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

