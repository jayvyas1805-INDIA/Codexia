import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/pages.css";
import {
  getModeratorDashboardApi,
  createAnnouncementApi,
  toggleAnnouncementPinApi,
} from "../apis/api";

export default function Announcements() {
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [communities, setCommunities] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await getModeratorDashboardApi();
      const fetchedCommunities = res?.data?.communities || [];

      setCommunities(fetchedCommunities);

      if (!selectedCommunity && fetchedCommunities.length > 0) {
        setSelectedCommunity(fetchedCommunities[0]._id);
      }
    } catch (err) {
      alert(err.message || "Failed to fetch announcements");
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

  const announcements = community?.announcements || [];

  const postAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementText.trim()) {
      alert("Title and announcement text required");
      return;
    }

    try {
      await createAnnouncementApi(selectedCommunity, {
        title: announcementTitle,
        content: announcementText,
        isPinned: false,
      });

      setAnnouncementTitle("");
      setAnnouncementText("");

      await fetchDashboard();
    } catch (err) {
      alert(err.message || "Failed to post announcement");
    }
  };

  const togglePinAnnouncement = async (postId) => {
    try {
      await toggleAnnouncementPinApi(selectedCommunity, postId);
      await fetchDashboard();
    } catch (err) {
      alert(err.message || "Failed to update pin");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <h2>Loading announcements...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (!community) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <h2>No Moderated Community Found</h2>
          <p>You are not moderator in any community.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h2>Community Announcements</h2>
          <p className="page-subtitle">
            Post updates for the selected community
          </p>

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
        </div>

        <div className="announcement-form">
          <input
            placeholder="Announcement title"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            className="announcement-input"
          />

          <textarea
            placeholder="Write an announcement for the community..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="announcement-input"
            rows="3"
          />

          <button className="btn btn-primary" onClick={postAnnouncement}>
            Post Announcement
          </button>
        </div>

        <div className="announcements-list-full">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div
                key={ann._id}
                className={`announcement-card ${
                  ann.isPinned ? "pinned" : ""
                }`}
              >
                {ann.isPinned && <span className="pinned-badge">📌 Pinned</span>}

                <p className="announcement-text">
                  <strong>{ann.title}</strong>
                </p>

                <p className="announcement-text">{ann.content}</p>

                <p className="announcement-meta">
                  @{ann.author?.username || "Moderator"} •{" "}
                  {new Date(ann.createdAt).toLocaleString()}
                </p>

                <div className="announcement-actions">
                  <button
                    className="btn-action btn-secondary"
                    onClick={() => togglePinAnnouncement(ann._id)}
                  >
                    {ann.isPinned ? "Unpin" : "Pin"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No announcements yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}