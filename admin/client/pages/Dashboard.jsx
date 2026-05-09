import { useState, useEffect } from 'react';
import { Users, FileText, Zap, TrendingUp, CheckCircle, MessageSquare, } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import '../styles/dashboard.css';
import { getUsersApi, getPostsApi, getCommunitiesApi, getActivityLogsApi, getReportsApi } from '../apis/api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#0088FE'];

function normalizeResponse(res) {
  // api functions may return { data: [...] } or the array directly
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data)) return res.data;
  return res.data || [];
}

export default function Dashboard() {
  const [totals, setTotals] = useState({ users: 0, posts: 0, communities: 0, activeUsers: 0 });
  const [activityLogs, setActivityLogs] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [postsByCommunity, setPostsByCommunity] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          getUsersApi(),
          getPostsApi(),
          getCommunitiesApi(),
          getActivityLogsApi({ limit: 5 }),
          getReportsApi({ limit: 5 }),
        ]);

        if (!mounted) return;

        const usersRes = results[0];
        const postsRes = results[1];
        const commRes = results[2];
        const activityRes = results[3];
        const reportsRes = results[4];

        const usersData = usersRes.status === 'fulfilled' ? normalizeResponse(usersRes.value) : [];
        const postsData = postsRes.status === 'fulfilled' ? normalizeResponse(postsRes.value) : [];
        const commData = commRes.status === 'fulfilled' ? normalizeResponse(commRes.value) : [];
        const activityData = activityRes.status === 'fulfilled' ? normalizeResponse(activityRes.value) : [];
        const reportsData = reportsRes.status === 'fulfilled' ? normalizeResponse(reportsRes.value) : [];

        setUsers(usersData);
        setPosts(postsData);
        setCommunities(commData);
        setActivityLogs(activityData.slice(0, 5));
        setRecentReports(reportsData.slice(0, 5));

        setTotals({
          users: usersData.length || (usersRes.value?.pagination?.total ?? 0),
          posts: postsData.length || (postsRes.value?.pagination?.total ?? 0),
          communities: commData.length || (commRes.value?.pagination?.total ?? 0),
          activeUsers: usersData.filter((u) => (u.status || '').toLowerCase() === 'active').length,
        });

        // Build growth data by month
        const monthKey = (d) => {
          const dt = new Date(d);
          if (Number.isNaN(dt.getTime())) return null;
          return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        };

        const usersByMonth = {};
        usersData.forEach((u) => {
          const key = monthKey(u.createdAt || u.joinDate || Date.now());
          if (!key) return;
          usersByMonth[key] = (usersByMonth[key] || 0) + 1;
        });

        const postsByMonth = {};
        postsData.forEach((p) => {
          const key = monthKey(p.createdAt || p.createdAt || Date.now());
          if (!key) return;
          postsByMonth[key] = (postsByMonth[key] || 0) + 1;
        });

        const months = Array.from(new Set([...Object.keys(usersByMonth), ...Object.keys(postsByMonth)])).sort();
        setGrowthData(months.map((m) => ({ month: m, users: usersByMonth[m] || 0, posts: postsByMonth[m] || 0 })));

        // posts per community
        const postsByCommMap = {};
        postsData.forEach((p) => {
          const name = p.community?.name || p.communityName || p.communityId || 'Unknown';
          postsByCommMap[name] = (postsByCommMap[name] || 0) + 1;
        });
        setPostsByCommunity(Object.entries(postsByCommMap).map(([name, count]) => ({ name, posts: count })));

        const roleCounts = {};
        usersData.forEach((u) => {
          const r = (u.role || 'User').toString();
          roleCounts[r] = (roleCounts[r] || 0) + 1;
        });
        setRolesData(Object.entries(roleCounts).map(([name, value]) => ({ name, value })));

      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="grid-main">
              <div className="dashboard-section stats-row">
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>{totals.users.toLocaleString()}</h3>
                    <p>Total Users</p>
                  </div>
                  <div className="stat-icon stat-icon-users">
                    <Users size={28} />
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>{totals.posts.toLocaleString()}</h3>
                    <p>Total Posts</p>
                  </div>
                  <div className="stat-icon stat-icon-posts">
                    <FileText size={28} />
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>{totals.communities.toLocaleString()}</h3>
                    <p>Total Communities</p>
                  </div>
                  <div className="stat-icon stat-icon-communities">
                    <Zap size={28} />
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>{totals.activeUsers.toLocaleString()}</h3>
                    <p>Active Users</p>
                  </div>
                  <div className="stat-icon stat-icon-active">
                    <TrendingUp size={28} />
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">
                  <TrendingUp size={24} />
                  System Analytics
                </h2>
                <div className="charts-grid">
                  <div className="chart-container">
                    <div className="card-header">User Growth Trend</div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#000" strokeWidth={2} />
                        <Line type="monotone" dataKey="posts" stroke="#666" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-container">
                    <div className="card-header">Posts Per Community</div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={postsByCommunity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="posts" fill="#000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-container">
                    <div className="card-header">User Role Distribution</div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={rolesData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} dataKey="value">
                          {rolesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">
                  <FileText size={24} />
                  Latest Posts
                </h2>
                <div className="card">
                  {posts.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">No posts available</div>
                  ) : (
                    posts.slice(0, 6).map((p) => (
                      <div key={p._id || p.id} className="py-3 border-b last:border-b-0">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-gray-600">By {p.author?.username || p.authorName || 'Unknown'}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="grid-side">
              <div className="card calendar-card">
                <div className="card-header">Calendar</div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</div>
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {['S','M','T','W','T','F','S'].map((d) => (<div key={d} style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>{d}</div>))}
                    {Array.from({ length: 35 }).map((_, i) => (<div key={i} style={{ height: 28, borderRadius: 6, background: i === new Date().getDate()-1 ? 'linear-gradient(135deg,#e6f9f0,#d1fae5)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === new Date().getDate()-1 ? '#065f46' : '#444' }}>{i+1}</div>))}
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">Schedule</div>
                {(posts || []).slice(0,3).map((p) => (<div key={p._id || p.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : 'TBA'}</div>
                </div>))}
                {(posts || []).length === 0 && <div style={{ padding: 12, color: '#666' }}>No scheduled items</div>}
              </div>

              <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">Recent Activities</div>
                {(activityLogs || []).slice(0,6).map((log, idx) => (
                  <div key={log._id || log.id || idx} className="activity-item">
                    <div className="activity-icon"><CheckCircle size={18} /></div>
                    <div className="activity-content">
                      <strong>{log.action || log.title || 'Activity'}</strong>
                      <p style={{ marginTop: 6 }}>{log.description || log.message || ''}</p>
                      <div className="activity-time">{log.timestamp || log.createdAt || ''}</div>
                    </div>
                  </div>
                ))}
                {(activityLogs || []).length === 0 && <div style={{ padding: 12, color: '#666' }}>No recent activity</div>}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
