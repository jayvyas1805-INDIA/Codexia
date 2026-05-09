import { useState, useEffect } from "react";
import {
  Zap,
  Edit,
  Trash2,
  CheckCircle,
  Search,
  Filter,
  UserPlus,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import "../../styles/dashboard.css";

import {
  getCommunitiesApi,
  approveCommunityApi,
  getUsersApi,
  addModeratorApi,
} from "../../apis/api";

export default function Communities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("members");
  const [showFilters, setShowFilters] = useState(false);

  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addingModerator, setAddingModerator] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commRes, userRes] = await Promise.all([
        getCommunitiesApi(),
        getUsersApi(),
      ]);

      setCommunities(commRes?.data?.data || commRes?.data || []);
      setUsers(userRes?.data?.data || userRes?.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setCommunities([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (communityId) => {
    try {
      const res = await approveCommunityApi(communityId);
      const updatedCommunity = res?.data?.data || res?.data;

      if (updatedCommunity) {
        setCommunities((prev) =>
          prev.map((c) => {
            const cid = c._id || c.id;
            const updatedId = updatedCommunity._id || updatedCommunity.id;
            return cid === updatedId ? { ...c, ...updatedCommunity } : c;
          })
        );
      }
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Community approve failed");
    }
  };

  const handleAddModerator = async () => {
    if (!selectedCommunityId || !selectedUserId) {
      alert("Please select user");
      return;
    }

    try {
      setAddingModerator(true);

      await addModeratorApi(selectedCommunityId, {
        userId: selectedUserId,
        permissions: ["MANAGE_POSTS", "MANAGE_REPORTS"],
      });

      alert("Moderator added successfully");

      setSelectedCommunityId(null);
      setSelectedUserId("");

      fetchData();
    } catch (err) {
      console.error("Add moderator failed:", err);
      alert(err?.response?.data?.message || "Failed to add moderator");
    } finally {
      setAddingModerator(false);
    }
  };

  const filtered = communities
    .filter((comm) => {
      const name = comm.name || "";
      const description = comm.description || "";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        comm.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const membersA =
        a.membersCount ||
        (Array.isArray(a.members) ? a.members.length : a.members || 0);

      const membersB =
        b.membersCount ||
        (Array.isArray(b.members) ? b.members.length : b.members || 0);

      const postsA =
        a.postCount || (Array.isArray(a.posts) ? a.posts.length : a.posts || 0);

      const postsB =
        b.postCount || (Array.isArray(b.posts) ? b.posts.length : b.posts || 0);

      if (sortBy === "members") return membersB - membersA;
      if (sortBy === "name")
        return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "posts") return postsB - postsA;

      return 0;
    });

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-content">
            <h2>Loading communities...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <Zap size={24} />
              Communities Management
            </h2>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Filter size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <div style={{ fontSize: "13px", color: "#666" }}>
                Showing {filtered.length} of {communities.length} communities
              </div>
            </div>

            {showFilters && (
              <div className="card" style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Search Communities
                    </label>

                    <div style={{ position: "relative" }}>
                      <Search
                        size={16}
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#999",
                        }}
                      />

                      <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="filter-input"
                        style={{ paddingLeft: "40px", width: "100%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-input"
                      style={{ width: "100%" }}
                    >
                      <option>All</option>
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Sort By
                    </label>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="filter-input"
                      style={{ width: "100%" }}
                    >
                      <option value="members">Members High to Low</option>
                      <option value="posts">Posts High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {filtered.map((community) => {
                const cid = community._id || community.id;
                const status = community.status || "pending";

                const membersCount =
                  community.membersCount ||
                  (Array.isArray(community.members)
                    ? community.members.length
                    : community.members || 0);

                const postsCount =
                  community.postCount ||
                  (Array.isArray(community.posts)
                    ? community.posts.length
                    : community.posts || 0);

                const moderatorsCount = Array.isArray(community.moderators)
                  ? community.moderators.length
                  : community.moderators || 0;

                const requestsCount = Array.isArray(community.joinRequests)
                  ? community.joinRequests.length
                  : community.requests || 0;

                const created =
                  community.createdAt || community.createdDate
                    ? new Date(
                        community.createdAt || community.createdDate
                      ).toLocaleDateString()
                    : "-";

                return (
                  <div
                    key={cid}
                    className="card"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "12px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "#000",
                          margin: 0,
                        }}
                      >
                        {community.name}
                      </h3>

                      <span
                        className={`badge badge-${
                          status.toLowerCase() === "approved"
                            ? "success"
                            : status.toLowerCase() === "pending"
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "16px",
                        lineHeight: "1.5",
                      }}
                    >
                      {community.description}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      <StatBox title="Members" value={membersCount} />
                      <StatBox title="Posts" value={postsCount} />
                      <StatBox title="Moderators" value={moderatorsCount} />
                      <StatBox title="Requests" value={requestsCount} />
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        marginBottom: "16px",
                      }}
                    >
                      Created: {created}
                    </div>

                    {selectedCommunityId === cid && (
                      <div
                        style={{
                          marginBottom: "14px",
                          padding: "12px",
                          background: "#f8f8f8",
                          borderRadius: "10px",
                          border: "1px solid #e5e5e5",
                        }}
                      >
                        <label
                          style={{
                            display: "block",
                            fontSize: "13px",
                            fontWeight: "600",
                            marginBottom: "8px",
                          }}
                        >
                          Select User
                        </label>

                        <select
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          className="filter-input"
                          style={{ width: "100%", marginBottom: "10px" }}
                        >
                          <option value="">Choose user</option>

                          {users.map((user) => (
                            <option key={user._id || user.id} value={user._id || user.id}>
                              {user.username || user.name || user.email}
                            </option>
                          ))}
                        </select>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={handleAddModerator}
                            disabled={addingModerator}
                            className="btn btn-success btn-sm"
                            style={{ flex: 1 }}
                          >
                            <CheckCircle size={14} />
                            {addingModerator ? "Adding..." : "Confirm"}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCommunityId(null);
                              setSelectedUserId("");
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1 }}
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="action-buttons" style={{ marginTop: "auto" }}>
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                        <Edit size={14} />
                        Edit
                      </button>

                      {status.toLowerCase() === "pending" ? (
                        <button
                          onClick={() => handleApprove(cid)}
                          className="btn btn-success btn-sm"
                          style={{ flex: 1 }}
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      ) : (
                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                          <CheckCircle size={14} />
                          Requests
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedCommunityId(cid);
                          setSelectedUserId("");
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <UserPlus size={14} />
                        Moderator
                      </button>

                      <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: "30px" }}>
                No communities found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value }) {
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#667eea",
        }}
      >
        {Number(value || 0).toLocaleString()}
      </div>

      <div style={{ fontSize: "12px", color: "#666" }}>{title}</div>
    </div>
  );
}