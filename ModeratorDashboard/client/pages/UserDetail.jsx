import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/user-detail.css';

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  // Mock user data
  const mockUsers = {
    1: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'member', status: 'active', joinDate: '2024-01-15', posts: 42, comments: 156, avatar: 'AJ' },
    2: { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'moderator', status: 'active', joinDate: '2023-12-20', posts: 156, comments: 342, avatar: 'BS' },
    3: { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'member', status: 'suspended', joinDate: '2024-02-10', posts: 18, comments: 45, avatar: 'CB' },
    4: { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'member', status: 'active', joinDate: '2024-01-05', posts: 87, comments: 234, avatar: 'DP' },
  };

  const mockUserPosts = {
    1: [
      { id: 1, title: 'Getting started with React', content: 'A comprehensive guide to React basics and hooks...', date: '2024-03-10', likes: 24, comments: 8 },
      { id: 2, title: 'Best practices for APIs', content: 'How to design RESTful APIs properly...', date: '2024-03-08', likes: 45, comments: 12 },
      { id: 3, title: 'JavaScript performance tips', content: 'Optimize your JavaScript code for better performance...', date: '2024-03-05', likes: 32, comments: 9 },
    ],
    2: [
      { id: 4, title: 'Community guidelines update', content: 'New rules and regulations for our community...', date: '2024-03-09', likes: 156, comments: 32 },
      { id: 5, title: 'Moderator best practices', content: 'How to moderate effectively and fairly...', date: '2024-03-07', likes: 89, comments: 24 },
    ],
    3: [
      { id: 6, title: 'Need help with coding', content: 'I am struggling with async/await...', date: '2024-03-06', likes: 5, comments: 3 },
    ],
    4: [
      { id: 7, title: 'Web development roadmap', content: 'Complete guide to learning web development...', date: '2024-03-10', likes: 78, comments: 18 },
      { id: 8, title: 'CSS grid tutorial', content: 'Mastering CSS grid layout...', date: '2024-03-09', likes: 56, comments: 14 },
      { id: 9, title: 'React hooks explained', content: 'Understanding React hooks with examples...', date: '2024-03-08', likes: 102, comments: 28 },
      { id: 10, title: 'Testing in JavaScript', content: 'Unit testing best practices...', date: '2024-03-07', likes: 43, comments: 11 },
    ],
  };

  const mockUserComments = {
    1: [
      { id: 1, postTitle: 'React Performance', content: 'Great article! I learned a lot from this.', date: '2024-03-10', likes: 5 },
      { id: 2, postTitle: 'JavaScript Tips', content: 'This is exactly what I needed!', date: '2024-03-09', likes: 12 },
      { id: 3, postTitle: 'CSS Tricks', content: 'Thanks for sharing this knowledge.', date: '2024-03-08', likes: 8 },
    ],
    2: [
      { id: 4, postTitle: 'Community Updates', content: 'Great updates! Looking forward to these changes.', date: '2024-03-09', likes: 24 },
      { id: 5, postTitle: 'Member Guidelines', content: 'Everyone should read this carefully.', date: '2024-03-08', likes: 15 },
    ],
    3: [
      { id: 6, postTitle: 'Async/Await Help', content: 'Can someone explain this to me?', date: '2024-03-06', likes: 2 },
    ],
    4: [
      { id: 7, postTitle: 'Web Dev Roadmap', content: 'This is a comprehensive guide!', date: '2024-03-10', likes: 18 },
      { id: 8, postTitle: 'CSS Grid', content: 'Perfect explanation with examples.', date: '2024-03-09', likes: 22 },
    ],
  };

  useEffect(() => {
    const currentUser = mockUsers[userId];
    setUser(currentUser);
    setUserPosts(mockUserPosts[userId] || []);
    setUserComments(mockUserComments[userId] || []);
  }, [userId]);

  const openModal = (post, action) => {
    setSelectedPost(post);
    setModalAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
    setModalAction(null);
  };

  const handlePostAction = (action) => {
    // Simulate action
    if (action === 'delete') {
      setUserPosts(userPosts.filter(p => p.id !== selectedPost.id));
    } else {
      setUserPosts(userPosts.map(p => p.id === selectedPost.id ? { ...p, status: action } : p));
    }
    closeModal();
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="loading">Loading user details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="user-detail-page">
        {/* User Header */}
        <div className="user-detail-header">
          <div className="user-card">
            <div className="user-avatar-large">{user.avatar}</div>
            <div className="user-header-content">
              <h2>{user.name}</h2>
              <p className="user-role-badge">{user.role}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="user-info-grid">
            <div className="user-info-item">
              <span className="user-info-label">Status</span>
              <span className={`status-badge status-${user.status}`}>{user.status}</span>
            </div>
            <div className="user-info-item">
              <span className="user-info-label">Posts</span>
              <span className="user-info-value">{user.posts}</span>
            </div>
            <div className="user-info-item">
              <span className="user-info-label">Comments</span>
              <span className="user-info-value">{user.comments}</span>
            </div>
            <div className="user-info-item">
              <span className="user-info-label">Joined</span>
              <span className="user-info-value">{user.joinDate}</span>
            </div>
          </div>

          <div className="user-actions">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
            <button className="btn btn-warn">⚠️ Warn</button>
            <button className="btn btn-suspend">🔒 Suspend</button>
            <button className="btn btn-ban">🚫 Ban</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="user-detail-tabs">
          <button 
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📝 Posts ({userPosts.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Comments ({userComments.length})
          </button>
        </div>

        {/* Content */}
        <div className="user-detail-content">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="posts-section">
              {userPosts.length === 0 ? (
                <div className="empty-state">
                  <p>No posts from this user</p>
                </div>
              ) : (
                <div className="posts-list">
                  {userPosts.map(post => (
                    <div key={post.id} className="post-item">
                      <div className="post-item-header">
                        <h3>{post.title}</h3>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <p className="post-item-content">{post.content}</p>
                      <div className="post-item-stats">
                        <span>❤️ {post.likes} likes</span>
                        <span>💬 {post.comments} comments</span>
                      </div>
                      <div className="post-item-actions">
                        <button 
                          className="btn-action btn-approve"
                          onClick={() => openModal(post, 'approve')}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => openModal(post, 'delete')}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="comments-section">
              {userComments.length === 0 ? (
                <div className="empty-state">
                  <p>No comments from this user</p>
                </div>
              ) : (
                <div className="comments-list">
                  {userComments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <h4>On: {comment.postTitle}</h4>
                        <span className="comment-date">{comment.date}</span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                      <div className="comment-stats">
                        <span>❤️ {comment.likes} likes</span>
                      </div>
                      <div className="comment-actions">
                        <button className="btn-action btn-delete">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <button className="modal-close" onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to <strong>{modalAction}</strong> this post?</p>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                <strong>Post:</strong> {selectedPost?.title}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handlePostAction(modalAction)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
