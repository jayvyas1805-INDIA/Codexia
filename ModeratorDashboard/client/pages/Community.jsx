import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  getModeratorDashboardApi,
  getModeratorCommunityDashboardApi,
  getModeratorCommunityUsersApi,
  getModeratorCommunityPostsApi,
  moderateCommunityUserApi,
  createAnnouncementApi,
} from "../apis/api";
import "../styles/community.css";

export default function Community() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [moderatorCommunities, setModeratorCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState(id || "");

  const [communityData, setCommunityData] = useState(null);
  const [members, setMembers] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const [postText, setPostText] = useState("");
  const [banDuration, setBanDuration] = useState("temporary");
  const [banDays, setBanDays] = useState(7);
  const [activeTab, setActiveTab] = useState("members");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModeratorCommunities();
  }, []);

  useEffect(() => {
    setSelectedCommunityId(id || "");

    if (id) {
      fetchCommunityData(id);
    } else {
      setCommunityData(null);
      setMembers([]);
      setCommunityPosts([]);
    }
  }, [id]);

  const getArray = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.communities)) return value.communities;
    if (Array.isArray(value?.moderatedCommunities)) {
      return value.moderatedCommunities;
    }
    if (Array.isArray(value?.myCommunities)) return value.myCommunities;
    if (Array.isArray(value?.users)) return value.users;
    if (Array.isArray(value?.members)) return value.members;
    if (Array.isArray(value?.posts)) return value.posts;
    return [];
  };

  const fetchModeratorCommunities = async () => {
    try {
      const res = await getModeratorDashboardApi();
      const data = res?.data || res || {};

      const communities =
        data?.communities ||
        data?.moderatedCommunities ||
        data?.myCommunities ||
        data?.data?.communities ||
        data?.data?.moderatedCommunities ||
        data?.data?.myCommunities ||
        getArray(data);

      setModeratorCommunities(communities);
    } catch (error) {
      console.error("Moderator communities fetch error:", error);
      alert(error.message || "Failed to fetch moderator communities");
    }
  };

  const fetchCommunityData = async (communityId) => {
    try {
      setLoading(true);

      const [dashboardRes, usersRes, postsRes] = await Promise.all([
        getModeratorCommunityDashboardApi(communityId),
        getModeratorCommunityUsersApi(communityId),
        getModeratorCommunityPostsApi(communityId),
      ]);

      const dashboardData = dashboardRes?.data || dashboardRes || {};
      const usersData = usersRes?.data || usersRes || {};
      const postsData = postsRes?.data || postsRes || {};

      const community =
        dashboardData?.community ||
        dashboardData?.data?.community ||
        dashboardData;

      const usersArray =
        usersData?.users ||
        usersData?.members ||
        usersData?.communityUsers ||
        usersData?.data?.users ||
        usersData?.data?.members ||
        getArray(usersData);

      const postsArray =
        postsData?.posts || postsData?.data?.posts || getArray(postsData);

      setCommunityData({
        id: community?._id || community?.id || communityId,
        name: community?.name || "Community",
        description: community?.description || "Community dashboard",
        moderators: community?.moderators?.length || 0,
        created: community?.createdAt
          ? new Date(community.createdAt).toLocaleDateString()
          : "-",
        rules: community?.rules || [],
      });

      setMembers(
        usersArray.map((item) => {
          const u = item.user || item;

          return {
            id: u._id || u.id,
            name: u.username || u.name || "Unknown User",
            role: String(u.role || "member").toLowerCase(),
            status: item.status || u.status || "active",
            joinDate:
              item.joinedAt || u.createdAt
                ? new Date(item.joinedAt || u.createdAt).toLocaleDateString()
                : "-",
            posts: item.postCount || u.postCount || 0,
          };
        })
      );

      setCommunityPosts(
        postsArray.map((post) => ({
          id: post._id || post.id,
          author:
            post.author?.username ||
            post.author?.name ||
            post.user?.username ||
            "Unknown",
          title: post.title || "Untitled Post",
          content: post.content || "",
          date: post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "-",
          likes: post.upvotes || post.likes || post.voteCount || 0,
          isAnnouncement: post.isAnnouncement || false,
        }))
      );
    } catch (error) {
      console.error("Community fetch error:", error);
      alert(error.message || "Failed to fetch community data");
      setCommunityData(null);
      setMembers([]);
      setCommunityPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityChange = (e) => {
    const communityId = e.target.value;
    setSelectedCommunityId(communityId);

    if (communityId) {
      navigate(`/community/${communityId}`);
    } else {
      navigate("/community");
    }
  };

  const openModal = (member, action) => {
    setSelectedMember(member);
    setModalAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setModalAction(null);
    setModalOpen(false);
  };

  const handleMemberAction = async () => {
    if (!selectedMember || !modalAction || !id) return;

    try {
      await moderateCommunityUserApi(id, selectedMember.id, modalAction);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? {
                ...m,
                status: modalAction === "ban" ? "banned" : "suspended",
              }
            : m
        )
      );

      closeModal();
    } catch (error) {
      alert(error.message || "Action failed");
    }
  };

  const handlePostCommunityUpdate = async () => {
    if (!postText.trim() || !id) return;

    try {
      const res = await createAnnouncementApi(id, {
        title: "Community Update",
        content: postText,
      });

      const newPost = res?.data || res || {};

      setCommunityPosts([
        {
          id: newPost?._id || Date.now(),
          author: "Moderator",
          title: newPost?.title || "Community Update",
          content: newPost?.content || postText,
          date: newPost?.createdAt
            ? new Date(newPost.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          likes: 0,
          isAnnouncement: true,
        },
        ...communityPosts,
      ]);

      setPostText("");
    } catch (error) {
      alert(error.message || "Failed to post announcement");
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="community-page">
        <div className="community-header">
          <div className="community-info-card">
            <div className="community-icon">🏢</div>

            <div className="community-header-content">
              <h2>Moderator Community</h2>
              <p>Select a community to manage members, posts, and rules.</p>

              <div style={{ marginTop: "16px" }}>
                <select
                  value={selectedCommunityId}
                  onChange={handleCommunityChange}
                  className="filter-select"
                >
                  <option value="">Select Community</option>

                  {moderatorCommunities.map((community) => {
                    const communityId = community._id || community.id;

                    return (
                      <option key={communityId} value={communityId}>
                        {community.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>

        {!id && (
          <div className="community-content">
            <div className="rules-section">
              <h3>Select Community</h3>
              <p>Please select one community from dropdown to manage it.</p>
            </div>
          </div>
        )}

        {id && loading && (
          <div className="community-content">
            <div>Loading community data...</div>
          </div>
        )}

        {id && !loading && !communityData && (
          <div className="community-content">
            <div>Community not found or failed to load.</div>
            <button
              className="btn btn-primary"
              onClick={() => fetchCommunityData(id)}
            >
              Retry
            </button>
          </div>
        )}

        {id && !loading && communityData && (
          <>
            <div className="community-header">
              <div className="community-info-card">
                <div className="community-icon">👥</div>

                <div className="community-header-content">
                  <h2>{communityData?.name || "Community"}</h2>
                  <p>{communityData?.description || "Community dashboard"}</p>

                  <div className="community-stats">
                    <span>
                      <strong>{members.length}</strong> Members
                    </span>

                    <span>
                      <strong>{communityPosts.length}</strong> Posts
                    </span>

                    <span>
                      <strong>{communityData?.moderators || 0}</strong>{" "}
                      Moderators
                    </span>

                    <span>Created {communityData?.created || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="community-tabs">
              <button
                className={`tab-button ${
                  activeTab === "members" ? "active" : ""
                }`}
                onClick={() => setActiveTab("members")}
              >
                👥 Members ({members.length})
              </button>

              <button
                className={`tab-button ${
                  activeTab === "posts" ? "active" : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                📝 Community Posts
              </button>

              <button
                className={`tab-button ${
                  activeTab === "rules" ? "active" : ""
                }`}
                onClick={() => setActiveTab("rules")}
              >
                📋 Rules & Guidelines
              </button>
            </div>

            <div className="community-content">
              {activeTab === "members" && (
                <div className="members-section">
                  <div className="filters-container">
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Roles</option>
                      <option value="member">Member</option>
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>

                  <div className="table-container">
                    <table className="members-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Posts</th>
                          <th>Join Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredMembers.length > 0 ? (
                          filteredMembers.map((member) => (
                            <tr
                              key={member.id}
                              onClick={() => navigate(`/user/${member.id}`)}
                              style={{ cursor: "pointer" }}
                            >
                              <td>{member.name}</td>

                              <td>
                                <span
                                  className={`role-badge role-${member.role}`}
                                >
                                  {member.role}
                                </span>
                              </td>

                              <td>
                                <span
                                  className={`status-badge status-${member.status}`}
                                >
                                  {member.status}
                                </span>
                              </td>

                              <td>{member?.posts.length || 0}</td>
                              <td>{member.joinDate}</td>

                              <td onClick={(e) => e.stopPropagation()}>
                                <div className="action-buttons">
                                  {member.status !== "suspended" && (
                                    <button
                                      className="btn-action btn-suspend"
                                      onClick={() =>
                                        openModal(member, "suspend")
                                      }
                                    >
                                      Suspend
                                    </button>
                                  )}

                                  {member.status !== "banned" && (
                                    <button
                                      className="btn-action btn-ban"
                                      onClick={() => openModal(member, "ban")}
                                    >
                                      Ban
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                              No members found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "posts" && (
                <div className="posts-section">
                  <div className="post-form-card">
                    <h3>Post Community Update</h3>

                    <textarea
                      placeholder="Share an update with your community members..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      className="post-input"
                      rows="3"
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePostCommunityUpdate}
                    >
                      Post Update
                    </button>
                  </div>

                  <div className="posts-list">
                    {communityPosts.length > 0 ? (
                      communityPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`post-card ${
                            post.isAnnouncement ? "announcement" : ""
                          }`}
                        >
                          <div className="post-header">
                            <div>
                              <h4>{post.title}</h4>
                              <p className="post-author">by {post.author}</p>
                            </div>

                            {post.isAnnouncement && (
                              <span className="announcement-label">
                                📢 Announcement
                              </span>
                            )}
                          </div>

                          <p className="post-content">{post.content}</p>

                          <div className="post-footer">
                            <span className="post-date">{post.date}</span>
                            <span className="post-likes">❤️ {post.likes}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No posts found</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "rules" && (
                <div className="rules-section">
                  <h3>Community Rules & Guidelines</h3>

                  <div className="rules-list">
                    {communityData?.rules?.length > 0 ? (
                      communityData.rules.map((rule, idx) => (
                        <div key={idx} className="rule-item">
                          <span className="rule-number">{idx + 1}</span>

                          <p className="rule-text">
                            {typeof rule === "string"
                              ? rule
                              : rule.title || rule.text || "Rule"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No rules added.</p>
                    )}
                  </div>

                  <div className="rules-note">
                    <p>
                      <strong>Note:</strong> Ensure all members follow these
                      rules. Violations may result in warnings, suspensions, or
                      bans.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {modalOpen && selectedMember && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {modalAction === "ban"
                    ? "Ban Member"
                    : modalAction === "suspend"
                    ? "Suspend Member"
                    : "Confirm Action"}
                </h3>

                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {modalAction === "ban" && (
                  <>
                    <p>
                      Ban <strong>{selectedMember.name}</strong> from{" "}
                      {communityData?.name || "this community"}?
                    </p>

                    <div className="form-group">
                      <label>Ban Type</label>

                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            value="temporary"
                            checked={banDuration === "temporary"}
                            onChange={(e) => setBanDuration(e.target.value)}
                          />
                          Temporary Ban
                        </label>

                        <label>
                          <input
                            type="radio"
                            value="permanent"
                            checked={banDuration === "permanent"}
                            onChange={(e) => setBanDuration(e.target.value)}
                          />
                          Permanent Ban
                        </label>
                      </div>
                    </div>

                    {banDuration === "temporary" && (
                      <div className="form-group">
                        <label>Duration (days)</label>

                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={banDays}
                          onChange={(e) => setBanDays(Number(e.target.value))}
                          className="form-input"
                        />
                      </div>
                    )}
                  </>
                )}

                {modalAction === "suspend" && (
                  <p>
                    Suspend <strong>{selectedMember.name}</strong> from{" "}
                    {communityData?.name || "this community"}?
                  </p>
                )}

                <p
                  style={{
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  This action will be logged and the member will be notified.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleMemberAction}
                >
                  Confirm {modalAction}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}