import { useState, useEffect } from 'react';
import { AlertTriangle, Eye, Trash2, MessageSquare, Ban, Search, Filter } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import '../../styles/dashboard.css';
import { getReportsApi, resolveReportApi, dismissReportApi, deletePostApi } from '../../apis/api';
export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchReports = async () => {
      try {
        const res = await getReportsApi();
        if (!mounted) return;
        if (res?.data) setReports(res.data);
        setLoading(false);
      } catch (err) {
        setReports([]);
        setLoading(false);
      }
    };
    fetchReports();
    return () => { mounted = false; };
  }, []);

    const filtered = reports
      .filter((report) => {
      const content = (report.content || report.description || report.reason || '').toString();
      const reportedUserName = (report.reportedUser?.username || report.reportedUser?.name || report.reported_user || '').toString();
      const reporterName = (report.reporter?.username || report.reporter?.name || report.reporter || '').toString();
      const priority = (report.severity || report.priority || '').toString();
      const status = (report.status || '').toString();
      const type = (report.type || report.targetType || (report.reportedPost ? 'Post' : report.reportedComment ? 'Comment' : report.reportedUser ? 'User' : '')).toString();
      const matchesSearch = content.toLowerCase().includes(searchQuery.toLowerCase()) || reportedUserName.toLowerCase().includes(searchQuery.toLowerCase()) || reporterName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || type === typeFilter;
      const matchesStatus = statusFilter === 'All' || status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'All' || priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    })
      .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      if (sortBy === 'date')
        return dateB - dateA;
      if (sortBy === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        const pa = (a.severity || a.priority || '').toString().toLowerCase();
        const pb = (b.severity || b.priority || '').toString().toLowerCase();
        return (order[pa] || 99) - (order[pb] || 99);
      }
      return 0;
    });
    return (<div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <AlertTriangle size={24}/>
              Reports & Moderation
            </h2>

            {/* Filter Toggle Button */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setShowFilters(!showFilters)} className="btn-primary flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18}/>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Showing {filtered.length} of {reports.length} reports
              </div>
            </div>

            {/* Collapsible Filters Panel */}
            {showFilters && (<div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                      Search
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}/>
                      <input type="text" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="filter-input" style={{ paddingLeft: '40px', width: '100%' }}/>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                      Type
                    </label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option>All</option>
                      <option>Post</option>
                      <option>Comment</option>
                      <option>User</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                      Status
                    </label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option>All</option>
                      <option>Open</option>
                      <option>Under Review</option>
                      <option>Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                      Priority
                    </label>
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option>All</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                      Sort By
                    </label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option value="date">Recent First</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                </div>
              </div>)}

            {/* Reports Table */}
            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Content</th>
                      <th>Reason</th>
                      <th>Reported User</th>
                      <th>Reporter</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((report) => {
                        const id = report._id || report.id || JSON.stringify(report);
                        const type = report.type || report.targetType || (report.reportedPost ? 'Post' : report.reportedComment ? 'Comment' : report.reportedUser ? 'User' : '');
                        const content = report.content || report.description || report.reason || '';
                        const reason = report.reason || '';
                        const reportedUser = report.reportedUser?.username || report.reportedUser?.name || report.reported_user || (report.reportedUser || '');
                        const reporter = report.reporter?.username || report.reporter?.name || report.reporter || '';
                        const priority = (report.severity || report.priority || '').toString();
                        const status = (report.status || '').toString();
                        const date = report.createdAt || report.date ? new Date(report.createdAt || report.date).toLocaleString() : '';
                        return (<tr key={id}>
                        <td>
                          <span className="badge badge-info">{type}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {content}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-danger">{reason}</span>
                        </td>
                        <td>
                          <strong>{reportedUser}</strong>
                        </td>
                        <td>{reporter}</td>
                        <td>
                          <span className={`badge badge-${priority.toLowerCase() === 'critical' ? 'danger' : priority.toLowerCase() === 'high' ? 'warning' : 'secondary'}`}>
                            {priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${status.toLowerCase() === 'pending' ? 'warning' : status.toLowerCase() === 'resolved' ? 'success' : status.toLowerCase() === 'dismissed' ? 'secondary' : 'info'}`}>
                            {status}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px' }}>{date}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-secondary btn-sm" title="View">
                              <Eye size={14}/>
                            </button>
                            <button className="btn btn-danger btn-sm" title="Remove Content" onClick={() => handleRemoveContent(report)}>
                              <Trash2 size={14}/>
                            </button>
                            <button className="btn btn-secondary btn-sm" title="Warn User" onClick={() => handleResolve(id, 'warn_user')}>
                              <MessageSquare size={14}/>
                            </button>
                            <button className="btn btn-danger btn-sm" title="Ban User" onClick={() => handleResolve(id, 'suspend_user')}>
                              <Ban size={14}/>
                            </button>
                          </div>
                        </td>
                      </tr>);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

    async function handleResolve(id, action) {
        try {
            const res = await resolveReportApi(id, action);
            const updated = res?.data || res;
            setReports((prev) => prev.map((r) => {
                const rid = r._id || r.id;
                if (rid === id) return { ...r, ...updated };
                return r;
            }));
        } catch (err) {
            // ignore for now
        }
    }

    async function handleDismiss(id) {
        try {
            const res = await dismissReportApi(id);
            const updated = res?.data || res;
            setReports((prev) => prev.map((r) => {
                const rid = r._id || r.id;
                if (rid === id) return { ...r, ...updated };
                return r;
            }));
        } catch (err) {}
    }

    async function handleRemoveContent(report) {
      const id = report._id || report.id;
      const postId = report.reportedPost || report.targetId || report.reported_post || report.reported_post_id;
      try {
        if (postId) {
          // try deleting the post entirely (admins only)
          try {
            await deletePostApi(postId);
          } catch (e) {
            // fallback to marking removed via resolve
          }
          await resolveReportApi(id, 'remove_post');
          setReports((prev) => prev.filter((r) => (r._id || r.id) !== id));
        } else {
          await handleResolve(id, 'remove_post');
        }
      } catch (err) {
        try { await handleResolve(id, 'remove_post'); } catch (e) {}
      }
    }
}
