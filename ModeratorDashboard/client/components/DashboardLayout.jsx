import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/dashboard-layout.css";

const MAIN_APP_URL = import.meta.env.VITE_main_url || "http://localhost:5173/feed";

export default function DashboardLayout({ children, pendingReports = 0 }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const location = useLocation();

  const moderatorRole = "senior";

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Users", icon: "👥" },
    {
      path: "/reports",
      label: "Reports",
      icon: "📋",
      badge: pendingReports > 0 ? pendingReports : null,
    },
    { path: "/content", label: "Content", icon: "📄" },
    { path: "/announcements", label: "Announcements", icon: "📢" },
    { path: "/community", label: "Community", icon: "🏢" },
    // { path: "/profile", label: "Profile", icon: "👤" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  // 🔥 MAIN APP REDIRECT
  const goToMainApp = () => {
    window.location.href = MAIN_APP_URL;
  };

  return (
    <div className="dashboard-layout">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* 🔥 CLICKABLE TITLE */}
          <h1
            className="header-title"
            onClick={goToMainApp}
            style={{ cursor: "pointer" }}
          >
            Codexia 
          </h1>
        </div>

        <div className="header-right">
          <div className="notification-badge">
            {pendingReports > 0 && <span className="badge">{pendingReports}</span>}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>

          <div className="moderator-info">
            <span className={`role-badge moderator-role role-${moderatorRole}`}>
              {moderatorRole} mod
            </span>
          </div>

          <div
            className="profile-section"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar">CD</div>
            <div className="profile-info">
              <p className="profile-name">Codexia Moderator</p>
              <p className="profile-role">Community Manager</p>
            </div>
          </div>
        </div>
      </header>

      <div className="layout-container">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => handleNavClick(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}