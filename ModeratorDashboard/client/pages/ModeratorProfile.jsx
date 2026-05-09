import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/profile.css';

export default function ModeratorProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [editNameMode, setEditNameMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [moderatorData, setModeratorData] = useState({
    name: 'Codexia Moderator',
    email: 'moderator@codexia.com',
    role: 'Senior Moderator',
    joinDate: '2023-11-20',
    community: 'Tech Hub',
    bio: 'Passionate about maintaining a healthy and respectful community. Experience in content moderation and user management.',
    phone: '+1 (555) 123-4567',
    initials: 'CD',
  });

  const [formData, setFormData] = useState(moderatorData);
  const [tempName, setTempName] = useState(moderatorData.name);
  const [passwordChange, setPasswordChange] = useState({ current: '', new: '', confirm: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [communitiesManaged, setCommunitiesManaged] = useState([
    { id: 'tech-hub', name: 'Tech Hub', members: 1243, posts: 2847, role: 'Senior Moderator', icon: '💻', status: 'active' },
    { id: 'design-lab', name: 'Design Lab', members: 856, posts: 1456, role: 'Moderator', icon: '🎨', status: 'active' },
    { id: 'marketing', name: 'Marketing', members: 567, posts: 892, role: 'Junior Moderator', icon: '📈', status: 'suspended' },
  ]);

  const [communityStats, setCommunityStats] = useState({
    totalMembers: 1243,
    activeToday: 342,
    postsToday: 156,
    reportsThisWeek: 24,
    bannedUsers: 12,
    suspendedUsers: 8,
  });

  const stats = [
    { label: 'Actions Taken', value: 247, icon: '⚡' },
    { label: 'Users Managed', value: 1243, icon: '👥' },
    { label: 'Reports Resolved', value: 156, icon: '✅' },
    { label: 'Community Posts', value: 2847, icon: '📝' },
  ];

  const recentActions = [
    { action: 'Banned user', user: 'John_Doe', date: '2024-03-10' },
    { action: 'Resolved report', count: 3, date: '2024-03-10' },
    { action: 'Approved content', count: 12, date: '2024-03-09' },
    { action: 'Suspended user', user: 'Jane_Smith', date: '2024-03-09' },
    { action: 'Posted announcement', date: '2024-03-08' },
  ];

  const permissions = [
    { name: 'View User Reports', enabled: true },
    { name: 'Ban Users', enabled: true },
    { name: 'Suspend Users', enabled: true },
    { name: 'Approve Content', enabled: true },
    { name: 'Delete Posts', enabled: true },
    { name: 'Manage Announcements', enabled: true },
    { name: 'View Activity Logs', enabled: true },
    { name: 'Export Community Data', enabled: true },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileImage = () => {
    if (profileImage) {
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Reset file input
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveProfile = () => {
    setModeratorData(formData);
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = () => {
    if (passwordChange.new !== passwordChange.confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordChange.new.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setPasswordChange({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
  };

  const handleModerateCommunity = () => {
    navigate('/community');
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setModeratorData({ ...moderatorData, name: tempName });
      setFormData({ ...formData, name: tempName });
      setEditNameMode(false);
      setSuccessMessage('Name updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const displayInitials = imagePreview ? null : (formData.initials || getInitials(formData.name));

  const filteredCommunities = communitiesManaged.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || community.role === filterRole;
    const matchesStatus = filterStatus === 'all' || community.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="profile-page">
        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <span>✓ {successMessage}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-card">
            <div className="profile-avatar-container">
              <div className="profile-avatar-large">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="avatar-image" />
                ) : (
                  <span className="avatar-initials">{displayInitials}</span>
                )}
              </div>
              <div className="avatar-upload-menu">
                <button 
                  className="btn-icon"
                  onClick={() => fileInputRef.current.click()}
                  title="Change profile picture"
                >
                  📷
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="profile-header-content">
              {editNameMode ? (
                <div className="name-edit-inline">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="name-input-inline"
                    autoFocus
                  />
                  <div className="name-edit-buttons">
                    <button
                      className="btn btn-small btn-primary"
                      onClick={handleSaveName}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => {
                        setEditNameMode(false);
                        setTempName(moderatorData.name);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="name-display-inline">
                  <h2>{moderatorData.name}</h2>
                  <button
                    className="btn-edit-name"
                    onClick={() => setEditNameMode(true)}
                    title="Edit name"
                  >
                    ✎
                  </button>
                </div>
              )}
              <p className="profile-role-badge">{moderatorData.role}</p>
              <p className="profile-email">{moderatorData.email}</p>
            </div>
          </div>

          <div className="profile-actions">
            {imagePreview && (
              <button 
                className="btn btn-secondary"
                onClick={handleSaveProfileImage}
              >
                Save Picture
              </button>
            )}
            <button 
              className="btn btn-primary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            {editMode && (
              <button 
                className="btn btn-secondary"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            )}
            <button 
              className="btn btn-moderate"
              onClick={handleModerateCommunity}
            >
              🏢 Manage Community
            </button>
          </div>
        </div>

        <div className="profile-content">
          {/* Stats Grid */}
          <div className="stats-section">
            <h3>Your Statistics</h3>
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card-small">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="community-stats-section">
            <h3>Community Statistics</h3>
            <div className="community-stats-grid">
              <div className="community-stat-card">
                <p className="community-stat-label">Total Members</p>
                <p className="community-stat-value">{communityStats.totalMembers}</p>
              </div>
              <div className="community-stat-card">
                <p className="community-stat-label">Active Today</p>
                <p className="community-stat-value">{communityStats.activeToday}</p>
              </div>
              <div className="community-stat-card">
                <p className="community-stat-label">Posts Today</p>
                <p className="community-stat-value">{communityStats.postsToday}</p>
              </div>
              <div className="community-stat-card">
                <p className="community-stat-label">Reports (Week)</p>
                <p className="community-stat-value">{communityStats.reportsThisWeek}</p>
              </div>
              <div className="community-stat-card warning">
                <p className="community-stat-label">Banned Users</p>
                <p className="community-stat-value">{communityStats.bannedUsers}</p>
              </div>
              <div className="community-stat-card warning">
                <p className="community-stat-label">Suspended Users</p>
                <p className="community-stat-value">{communityStats.suspendedUsers}</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="profile-grid">
            {/* Left Column */}
            <div className="profile-column">
              {/* Profile Information */}
              <div className="profile-section">
                <h3>Profile Information</h3>
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="form-input"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{moderatorData.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{moderatorData.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{moderatorData.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bio</span>
                      <span className="detail-value">{moderatorData.bio}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Communities Managed */}
              <div className="profile-section">
                <h3>Communities I Manage</h3>
                <div className="filters-container" style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                  <div className="search-box" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="filter-select"
                    style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', cursor: 'pointer' }}
                  >
                    <option value="all">All Roles</option>
                    <option value="Senior Moderator">Senior Moderator</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Junior Moderator">Junior Moderator</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                    style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', cursor: 'pointer' }}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div className="communities-list">
                  {filteredCommunities.map(community => (
                    <div key={community.id} className="community-item">
                      <div className="community-icon">{community.icon}</div>
                      <div className="community-item-info">
                        <p className="community-item-name">{community.name}</p>
                        <p className="community-item-role">{community.role}</p>
                        <p className="community-item-stats">
                          <span>{community.members} members</span>
                          <span>{community.posts} posts</span>
                        </p>
                      </div>
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => navigate(`/community/${community.id}`)}
                      >
                        Manage →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Actions */}
              <div className="profile-section">
                <h3>Recent Actions</h3>
                <div className="actions-list">
                  {recentActions.map((action, idx) => (
                    <div key={idx} className="action-item">
                      <div className="action-bullet"></div>
                      <div className="action-info">
                        <p className="action-text">
                          {action.user ? `${action.action}: ${action.user}` : action.count ? `${action.action} (${action.count})` : action.action}
                        </p>
                        <p className="action-date">{action.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="profile-column">
              {/* Permissions */}
              <div className="profile-section">
                <h3>Your Permissions</h3>
                <div className="permissions-list">
                  {permissions.map((perm, idx) => (
                    <div key={idx} className={`permission-item ${perm.enabled ? 'enabled' : 'disabled'}`}>
                      <div className="permission-indicator"></div>
                      <span className="permission-name">{perm.name}</span>
                      {perm.enabled && <span className="permission-check">✓</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Moderation Quick Actions */}
              <div className="profile-section">
                <h3>Quick Moderation Actions</h3>
                <div className="quick-actions">
                  <button className="quick-action-btn" onClick={handleModerateCommunity}>
                    <span className="action-icon">👥</span>
                    <span className="action-label">Manage Users</span>
                    <span className="action-desc">Ban/Suspend users</span>
                  </button>
                  <button className="quick-action-btn" onClick={handleModerateCommunity}>
                    <span className="action-icon">📋</span>
                    <span className="action-label">Review Reports</span>
                    <span className="action-desc">Handle reported content</span>
                  </button>
                  <button className="quick-action-btn" onClick={handleModerateCommunity}>
                    <span className="action-icon">📝</span>
                    <span className="action-label">Moderate Posts</span>
                    <span className="action-desc">Approve/Remove posts</span>
                  </button>
                  <button className="quick-action-btn" onClick={handleModerateCommunity}>
                    <span className="action-icon">📢</span>
                    <span className="action-label">Post Updates</span>
                    <span className="action-desc">Community announcements</span>
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="profile-section">
                <h3>Security</h3>
                <div className="security-settings">
                  {!showPasswordForm ? (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className="password-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={passwordChange.current}
                          onChange={(e) => setPasswordChange({ ...passwordChange, current: e.target.value })}
                          className="form-input"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={passwordChange.new}
                          onChange={(e) => setPasswordChange({ ...passwordChange, new: e.target.value })}
                          className="form-input"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          value={passwordChange.confirm}
                          onChange={(e) => setPasswordChange({ ...passwordChange, confirm: e.target.value })}
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="button-group">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => setShowPasswordForm(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={handlePasswordChange}
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="profile-section">
                <h3>Two-Factor Authentication</h3>
                <div className="tfa-settings">
                  <p className="tfa-status">Status: <strong>Not Enabled</strong></p>
                  <button className="btn btn-secondary">Enable 2FA</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
