import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { CommunityAPI } from "../lib/storage";

const ADMIN_DASHBOARD_URL = import.meta.env.VITE_ADMIN_DASHBOARD_URL || "http://localhost:5172";
const MODERATOR_DASHBOARD_URL = import.meta.env.VITE_MODERATOR_DASHBOARD_URL || "http://localhost:5174";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const allCommunities = CommunityAPI.getAllCommunities();
    setCommunities(allCommunities);
  }, []);

  // ROLE LOGIC
  const isAdmin = user?.role === "ADMIN";
  const isModerator = user?.isModerator === true;

  const dashboardUrl = isAdmin
    ? ADMIN_DASHBOARD_URL
    : isModerator
    ? MODERATOR_DASHBOARD_URL
    : null;

  const dashboardLabel = isAdmin
    ? "Admin Dashboard"
    : isModerator
    ? "Moderator Dashboard"
    : "";

  const handleLogout = () => {
    localStorage.clear(); // 🔥 IMPORTANT
    logout();
    navigate("/");
    setIsSidebarOpen(false);
  };

  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  // 🔥 FIXED FUNCTION (TOKEN PASS)
  const goToDashboard = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    if (dashboardUrl) {
      window.location.href = `${dashboardUrl}?token=${encodeURIComponent(token)}`;
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link to={user ? "/feed" : "/"} className="flex items-center gap-2">
              <span className="text-lg font-bold">Codexia</span>
            </Link>

            <div className="flex items-center gap-3">

              {/* USER INFO */}
              {user && (
                <div className="hidden sm:block text-right">
                  <div className="text-sm">@{user.username}</div>
                  <div className="text-xs text-gray-500">
                    {user.reputation} rep
                  </div>
                </div>
              )}

              {/* DASHBOARD BUTTON */}
              {user && dashboardUrl && (
                <button onClick={goToDashboard} className="btn-primary">
                  {dashboardLabel}
                </button>
              )}

              {/* ACTIONS */}
              <div className="hidden sm:flex gap-2">
                {user ? (
                  <>
                    <Link to={`/profile/${user.username}`} className="btn-secondary">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="btn-outline">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="bg-white w-72 h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4">Menu</h3>

            {user && (
              <>
                <Link to="/feed" onClick={handleNavClick} className="block mb-2">
                  Feed
                </Link>

                {/* MOBILE DASHBOARD BUTTON */}
                {dashboardUrl && (
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      goToDashboard(); // 🔥 USE SAME FUNCTION
                    }}
                    className="w-full btn-primary mb-2"
                  >
                    {dashboardLabel}
                  </button>
                )}

                <Link
                  to={`/profile/${user.username}`}
                  onClick={handleNavClick}
                  className="block mb-2"
                >
                  Profile
                </Link>

                <button onClick={handleLogout} className="w-full btn-outline">
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" className="block mb-2">
                  Login
                </Link>
                <Link to="/register" className="block">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}