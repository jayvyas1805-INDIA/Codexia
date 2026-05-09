import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/pages.css";
import {
  getModeratorDashboardApi,
  getModeratorCommunityUsersApi,
  moderateCommunityUserApi
} from "../apis/api";

export default function Users() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [users, setUsers] = useState([]);
  const [moderators, setModerators] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const [banDuration, setBanDuration] = useState("temporary");
  const [banDays, setBanDays] = useState(7);
  const [warningReason, setWarningReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getModeratorDashboardApi();
        const fetchedCommunities = res.data.communities || [];

        setCommunities(fetchedCommunities);

        if (fetchedCommunities.length > 0) {
          setSelectedCommunity(fetchedCommunities[0]._id);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch communities");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const fetchCommunityUsers = async () => {
      if (!selectedCommunity) return;

      try {
        setUsersLoading(true);
        setError("");

        const res = await getModeratorCommunityUsersApi(selectedCommunity);

        setUsers(res.data.users || []);
        setModerators(res.data.moderators || []);
      } catch (err) {
        setError(err.message || "Failed to fetch community users");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchCommunityUsers();
  }, [selectedCommunity]);

  const currentCommunity = useMemo(() => {
    return communities.find((c) => c._id === selectedCommunity) || null;
  }, [communities, selectedCommunity]);

  const getCommunityRole = (user) => {
    if (!user) return "member";

    if (user.role === "ADMIN") return "admin";

    const isModerator = moderators.some((mod) => {
      const modId = typeof mod === "string" ? mod : mod._id;
      return modId?.toString() === user._id?.toString();
    });

    return isModerator ? "moderator" : "member";
  };

  const openModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setModalAction(null);
    setBanDuration("temporary");
    setBanDays(7);
    setWarningReason("");
  };

  const handleUserAction = async () => {
  if (!selectedUser || !selectedCommunity) return;

  try {
    const payload = {
      action: modalAction,
    };

    if (modalAction === "ban") {
      payload.banType = banDuration;
      payload.banDays = banDays;
    }

    if (modalAction === "warn") {
      payload.warningReason = warningReason;
    }

    const res = await moderateCommunityUserApi(
      selectedCommunity,
      selectedUser._id,
      payload
    );

    // update UI with backend response
    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? res.data : u
      )
    );

    closeModal();
  } catch (err) {
    console.log(err);
    alert(err.message || "Action failed");
  }
};


  

  const filteredUsers = users.filter((user) => {
    const name = user.username || "";
    const email = user.email || "";
    const communityRole = getCommunityRole(user);

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || communityRole === filterRole;

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <h2>Loading users...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h2>User Management</h2>
          <p className="page-subtitle">
            {usersLoading ? "Loading users..." : `${filteredUsers.length} users found`}
          </p>
        </div>

        <div className="filters-container">
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="filter-select"
          >
            {communities.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}
          </select>

          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
            <option value="all">All Roles</option>
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Warnings</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const role = getCommunityRole(user);

                return (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${role}`}>
                        {role}
                      </span>
                    </td>
                    <td>
                      {(user.warnings || 0) > 0 ? (
                        <span className="warning-badge">{user.warnings} ⚠️</span>
                      ) : (
                        <span className="status-badge status-active">0</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status}
                        {user.banStatus?.type === "temporary" &&
                          ` (until ${user.banStatus.expiresAt})`}
                      </span>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : user.joinDate
                        ? new Date(user.joinDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-warn" onClick={() => openModal(user, "warn")}>
                          Warn
                        </button>

                        {user.status !== "suspended" && (
                          <button className="btn-action btn-suspend" onClick={() => openModal(user, "suspend")}>
                            Suspend
                          </button>
                        )}

                        {user.status !== "banned" && (
                          <button className="btn-action btn-ban" onClick={() => openModal(user, "ban")}>
                            Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalAction === "ban"
                  ? "Ban User"
                  : modalAction === "suspend"
                  ? "Suspend User"
                  : modalAction === "warn"
                  ? "Warn User"
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
                    Ban <strong>{selectedUser?.username}</strong> from this community?
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
                        onChange={(e) => setBanDays(parseInt(e.target.value))}
                        className="form-input"
                      />
                    </div>
                  )}
                </>
              )}

              {modalAction === "warn" && (
                <>
                  <p>
                    Issue a warning to <strong>{selectedUser?.username}</strong>
                  </p>

                  <div className="form-group">
                    <label>Reason for Warning</label>
                    <textarea
                      value={warningReason}
                      onChange={(e) => setWarningReason(e.target.value)}
                      className="form-input"
                      placeholder="Describe the reason for this warning..."
                      rows="3"
                    ></textarea>
                  </div>
                </>
              )}

              {modalAction === "suspend" && (
                <p>
                  Suspend <strong>{selectedUser?.username}</strong> for 7 days?
                </p>
              )}

              <p style={{ marginTop: "16px", fontSize: "13px", color: "#666" }}>
                This action is currently updating frontend state only.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUserAction}>
                Confirm {modalAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}