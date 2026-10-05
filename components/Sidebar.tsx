'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Code2,
  Building2,
  ClipboardList,
  MessageSquare,
  LineChart,
  User,
  Library,
  BookOpen,
  Settings
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', badge: null, icon: LayoutDashboard },
  { label: 'Placement Prep', href: '/prep', badge: '5', icon: GraduationCap },
  { label: 'Coding Workspace', href: '/workspace', badge: '3', icon: Code2 },
  { label: 'Companies', href: '/companies', badge: '18+', icon: Building2 },
  { label: 'Assessments', href: '/assessments', badge: null, icon: ClipboardList },
  { label: 'Interviews', href: '/interviews', badge: null, icon: MessageSquare },
  { label: 'Progress', href: '/progress', badge: null, icon: LineChart },
  { label: 'Profile', href: '/portfolio', badge: null, icon: User },
];

const footerItems = [
  { label: 'Uni Hub', href: '/uni-hub', icon: Library },
  { label: 'Virtual Lib', href: '/virtual-lib', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="sidebar-purple-container">
      {/* Top Logo Box */}
      <div className="sidebar-logo-white-pill" title="PlacementHub">
        <div className="logo-icon-purple">P</div>
        <span className="logo-text-dark">PlacementHub</span>
      </div>

      {/* User Card Profile Box */}
      <div className="sidebar-user-dark-card" title={user?.name || 'Anubhab Chakraborty'}>
        <div className="sidebar-user-avatar">{user?.avatar || 'AC'}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || 'Anubhab Chakraborty'}</div>
          <div className="sidebar-user-sub">Placement prep · Pro</div>
        </div>
      </div>

      {/* Main Nav Pills */}
      <nav className="sidebar-nav-pills">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-dark-pill ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <div className="sidebar-pill-content">
                <Icon size={18} className="sidebar-pill-icon" />
                <span className="sidebar-pill-text">{item.label}</span>
              </div>
              {item.badge && <span className="sidebar-pill-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav Pills */}
      <div className="sidebar-footer-pills">
        {footerItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-dark-pill ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <div className="sidebar-pill-content">
                <Icon size={18} className="sidebar-pill-icon" />
                <span className="sidebar-pill-text">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}



