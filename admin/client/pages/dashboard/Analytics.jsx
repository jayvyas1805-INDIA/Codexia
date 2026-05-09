import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { TrendingUp, Users, MessageSquare, Activity } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import '../../styles/dashboard.css';
import { getUsersApi, getPostsApi, getCommunitiesApi, getActivityLogsApi } from '../../apis/api';

const COLORS = ['#1a1a1a', '#808080', '#c0c0c0'];
const ENGAGEMENT_COLORS = ['#1a1a1a', '#505050', '#f59e0b'];

export default function Analytics() {
    const [totals, setTotals] = useState({ users: 0, posts: 0, communities: 0, activeUsers: 0 });
    const [growthData, setGrowthData] = useState([]);
    const [postsByCommunity, setPostsByCommunity] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [engagementData, setEngagementData] = useState([]);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const [uRes, pRes, cRes] = await Promise.all([
                    getUsersApi({ page: 1, limit: 10000 }),
                    getPostsApi({ page: 1, limit: 1 }),
                    getCommunitiesApi({ page: 1, limit: 100 }),
                ]);

                if (!mounted) return;

                const totalUsers = uRes?.pagination?.total ?? (uRes?.data?.length ?? 0);
                const totalPosts = pRes?.pagination?.total ?? (pRes?.data?.length ?? 0);
                const totalCommunities = cRes?.pagination?.total ?? (cRes?.data?.length ?? 0);
                const usersList = uRes?.data ?? [];
                const communitiesList = cRes?.data ?? [];

                const activeUsers = usersList.filter((u) => (u.status || '').toString().toLowerCase() === 'active').length;
                setTotals({ users: totalUsers, posts: totalPosts, communities: totalCommunities, activeUsers });

                // Roles distribution
                const roleCounts = { USERS: 0, MODERATOR: 0, ADMIN: 0 };
                usersList.forEach((u) => {
                    const r = (u.role || 'USER').toString().toUpperCase();
                    if (r === 'ADMIN') roleCounts.ADMIN += 1;
                    else if (r === 'MODERATOR') roleCounts.MODERATOR += 1;
                    else roleCounts.USERS += 1;
                });
                setRolesData([
                    { name: 'Users', value: roleCounts.USERS },
                    { name: 'Moderators', value: roleCounts.MODERATOR },
                    { name: 'Admins', value: roleCounts.ADMIN },
                ]);

                // Posts per community (top)
                const postsPerComm = communitiesList.map((c) => ({ name: c.name || 'Community', posts: c.postCount || c.posts || 0 }));
                postsPerComm.sort((a, b) => b.posts - a.posts);
                setPostsByCommunity(postsPerComm.slice(0, 6));

                // User growth (last 6 months)
                const monthKeys = [];
                const monthMap = {};
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                    monthKeys.push(key);
                    monthMap[key] = { month: d.toLocaleString('default', { month: 'short' }), users: 0, active: 0, new: 0 };
                }

                usersList.forEach((u) => {
                    const created = new Date(u.createdAt || u.joinDate || u.joinedAt || u.joinedAt || u.createdAt || u.joinDate || null);
                    if (!created || Number.isNaN(created.getTime())) return;
                    const key = `${created.getFullYear()}-${created.getMonth() + 1}`;
                    if (monthMap[key]) {
                        monthMap[key].users += 1;
                        if ((u.status || '').toString().toLowerCase() === 'active') monthMap[key].active += 1;
                        monthMap[key].new += 1;
                    }
                });

                const growth = monthKeys.map((k) => monthMap[k]);
                setGrowthData(growth);
            } catch (err) {
                // keep fallback data
                console.error('Analytics fetch failed', err);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, []);

    return (<div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid" style={{ marginBottom: '32px' }}>
            <div className="stat-card">
              <div className="stat-content">
                <h3>{totals.users.toLocaleString()}</h3>
                <p>Total Users</p>
              </div>
              <div className="stat-icon">
                <Users size={28}/>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3>{totals.posts.toLocaleString()}</h3>
                <p>Total Posts</p>
              </div>
              <div className="stat-icon">
                <MessageSquare size={28}/>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3>{totals.communities.toLocaleString()}</h3>
                <p>Communities</p>
              </div>
              <div className="stat-icon">
                <Activity size={28}/>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3>{totals.activeUsers.toLocaleString()}</h3>
                <p>Active Users</p>
              </div>
              <div className="stat-icon">
                <TrendingUp size={28}/>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">
              <TrendingUp size={24}/>
              System Analytics & Insights
            </h2>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* User Growth Chart */}
              <div className="chart-container" style={{ gridColumn: 'span 1' }}>
                <div className="card-header">User Growth Trend</div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3"/>
                    <XAxis dataKey="month"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" stroke="#1a1a1a" fillOpacity={1} fill="url(#colorUsers)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Posts Per Community Chart */}
              <div className="chart-container" style={{ gridColumn: 'span 1' }}>
                <div className="card-header">Posts Per Community</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={postsByCommunity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3"/>
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="posts" fill="#505050" radius={[8, 8, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Chart */}
              <div className="chart-container" style={{ gridColumn: 'span 1' }}>
                <div className="card-header">Weekly Engagement</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3"/>
                    <XAxis dataKey="day"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="comments" fill="#1a1a1a" radius={[8, 8, 0, 0]}/>
                    <Bar dataKey="likes" fill="#505050" radius={[8, 8, 0, 0]}/>
                    <Bar dataKey="shares" fill="#f59e0b" radius={[8, 8, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* User Roles Distribution */}
              <div className="chart-container" style={{ gridColumn: 'span 1' }}>
                <div className="card-header">User Role Distribution</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                      <Pie data={rolesData} cx="50%" cy="50%" labelLine={false} label outerRadius={100}>
                        {rolesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart - Detailed Growth */}
              <div className="chart-container" style={{ gridColumn: 'span 1' }}>
                <div className="card-header">Monthly Metrics</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3"/>
                    <XAxis dataKey="month"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#1a1a1a" strokeWidth={2}/>
                    <Line type="monotone" dataKey="active" stroke="#505050" strokeWidth={2}/>
                    <Line type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={2}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Posts Growth */}
              <div className="chart-container" style={{ gridColumn: 'span 1' }}>
                <div className="card-header">Posts Growth</div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#505050" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#505050" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3"/>
                    <XAxis dataKey="month"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="new" stroke="#505050" fillOpacity={1} fill="url(#colorPosts)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
