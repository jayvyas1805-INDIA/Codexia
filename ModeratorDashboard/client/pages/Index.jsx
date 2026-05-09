import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/moderator-dashboard.css";
import {
  getModeratorDashboardApi,
  toggleAnnouncementPinApi,
} from "../apis/api";

export default function ModeratorOverview() {
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getModeratorDashboardApi();
      const fetchedCommunities = res?.data?.communities || [];

      setCommunities(fetchedCommunities);

      if (!selectedCommunity && fetchedCommunities.length > 0) {
        setSelectedCommunity(fetchedCommunities[0]._id);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const community = useMemo(() => {
    return (
      communities.find((item) => item._id === selectedCommunity) ||
      communities[0] ||
      null
    );
  }, [communities, selectedCommunity]);

  const activityLogs = community?.activityLogs || [];
  const announcements = community?.announcements || [];

  const stats = [
    { label: "Total Users", value: community?.membersCount || 0 },
    { label: "Active Reports", value: community?.activeReportsCount || 0 },
    { label: "Posts Today", value: community?.todayPostsCount || 0 },
    { label: "Moderators", value: community?.moderatorsCount || 0 },
  ];

  const pendingReports = community?.activeReportsCount || 0;

  const togglePinAnnouncement = async (postId) => {
    try {
      await toggleAnnouncementPinApi(community._id, postId);
      await fetchDashboard();
    } catch (err) {
      alert(err.message || "Failed to update pin");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-page">
          <h2>Loading moderator dashboard...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="dashboard-page">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!community) {
    return (
      <DashboardLayout>
        <div className="dashboard-page">
          <h2>No Moderated Community Found</h2>
          <p>You are not assigned as moderator in any community.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pendingReports={pendingReports}>
      <div className="dashboard-page">
        <div className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <p className="dashboard-eyebrow">Moderator Dashboard</p>
            <h2>Overview for {community.name}</h2>
            <p className="dashboard-subtitle">
              Track member activity, moderation workload, and community health.
            </p>
          </div>

          <div className="dashboard-hero-controls">
            <label className="dashboard-select-wrap">
              <span>Community</span>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="community-select"
              >
                {communities.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <section className="section-content">
            <h3>Recent Activity</h3>

            <div className="activity-list">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log._id} className="activity-item">
                    <div className="activity-indicator"></div>
                    <div className="activity-details">
                      <p className="activity-text">
                        <strong>{log.action}</strong> - {log.description}
                      </p>
                      <p className="activity-time">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                      {log.performedBy?.username && (
                        <p className="activity-meta">
                          By @{log.performedBy.username}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-indicator"></div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>No recent activity</strong>
                    </p>
                    <p className="activity-time">Everything is clear</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="section-content">
            <h3>Announcements</h3>

            <div className="announcements-list">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className={`announcement-item ${
                      announcement.isPinned ? "pinned" : ""
                    }`}
                  >
                    {announcement.isPinned && (
                      <span className="pinned-badge">Pinned</span>
                    )}

                    <p className="announcement-text">
                      <strong>{announcement.title}</strong>
                    </p>

                    <p className="announcement-text">
                      {announcement.content}
                    </p>

                    <p className="announcement-meta">
                      @{announcement.author?.username || "Moderator"} •{" "}
                      {new Date(announcement.createdAt).toLocaleString()}
                    </p>

                    <button
                      className="btn-action btn-secondary"
                      onClick={() => togglePinAnnouncement(announcement._id)}
                    >
                      {announcement.isPinned ? "Unpin" : "Pin"}
                    </button>
                  </div>
                ))
              ) : (
                <p>No announcements yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}