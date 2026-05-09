import { useLocation } from 'react-router-dom';
import { BarChart3, Users, Zap, Shield, AlertTriangle, TrendingUp, Settings } from 'lucide-react';
import '../../styles/dashboard.css';
export default function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/dashboard/users', label: 'Users Management', icon: Users },
        { path: '/dashboard/communities', label: 'Communities', icon: Zap },
        { path: '/dashboard/moderation', label: 'Moderation', icon: Shield },
        { path: '/dashboard/reports', label: 'Reports', icon: AlertTriangle },
        { path: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
        { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];
    return (<div className="dashboard-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">
          <BarChart3 size={24}/>
          <span>Codexia Admin</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
            return (<a key={item.path} href={item.path} className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20}/>
              <span>{item.label}</span>
            </a>);
        })}
      </nav>

    </div>);
}
