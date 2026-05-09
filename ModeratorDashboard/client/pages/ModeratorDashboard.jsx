import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getModeratorDashboardApi } from "../apis/api";
import "../styles/moderator-dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ModeratorDashboard() {
  const navigate = useNavigate();
  const { communityId } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [communityData, setCommunityData] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const data = await getModeratorDashboardApi(communityId);

      setCommunityData(data.data.community);
      setUsers(data.data.members || []);
      setReports(data.data.reports || []);
      setPosts(data.data.posts || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (communityId) {
    fetchDashboard();
  }
}, [communityId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setModalAction(null);
  };

  const handleUserAction = (action) => {
    console.log(`${action} user:`, selectedUser);
    closeModal();
  };

  const handleReportAction = (reportId, action) => {
    setReports(
      reports.map((r) => (r._id === reportId ? { ...r, status: action } : r))
    );
  };

  const handlePostAction = (postId, action) => {
    if (action === "delete") {
      setPosts(posts.filter((p) => p._id !== postId));
    } else {
      setPosts(
        posts.map((p) => (p._id === postId ? { ...p, status: action } : p))
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const username = user.username || user.name || "";
    const email = user.email || "";

    const matchesSearch =
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === "all" || user.role?.toLowerCase() === filterRole;

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    { label: "Total Users", value: users.length, icon: "👥" },
    {
      label: "Active Reports",
      value: reports.filter((r) => r.status === "pending").length,
      icon: "📋",
    },
    {
      label: "Flagged Posts",
      value: posts.filter((p) => p.status === "pending").length,
      icon: "🚩",
    },
    {
      label: "Moderators",
      value: communityData?.moderators?.length || 0,
      icon: "🛡️",
    },
  ];

  const userRoleData = {
    labels: ["User", "Admin"],
    datasets: [
      {
        label: "Users by Role",
        data: [
          users.filter((u) => u.role === "USER").length,
          users.filter((u) => u.role === "ADMIN").length,
        ],
        backgroundColor: ["#ffffff", "#000000"],
        borderColor: ["#000000", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const userStatusData = {
    labels: ["Active", "Suspended", "Banned"],
    datasets: [
      {
        data: [
          users.filter((u) => u.status === "active").length,
          users.filter((u) => u.status === "suspended").length,
          users.filter((u) => u.status === "banned").length,
        ],
        backgroundColor: ["#c0c0c0", "#808080", "#000000"],
        hoverBackgroundColor: ["#ffffff", "#c0c0c0", "#ffffff"],
      },
    ],
  };

  const reportStatusData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Reports",
        data: [
          reports.filter((r) => r.status === "pending").length,
          reports.filter((r) => r.status === "approved").length,
          reports.filter((r) => r.status === "rejected").length,
        ],
        backgroundColor: ["#ffffff", "#c0c0c0", "#000000"],
        borderColor: ["#000000", "#000000", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const postStatusData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        label: "Posts",
        data: [
          posts.filter((p) => p.status === "approved").length,
          posts.filter((p) => p.status === "pending").length,
          posts.filter((p) => p.status === "rejected").length,
        ],
        backgroundColor: ["#c0c0c0", "#ffffff", "#000000"],
        borderColor: ["#000000", "#000000", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const reportTimeData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Reports Over Time",
        data: [0, 0, 0, reports.length],
        borderColor: "#000000",
        backgroundColor: "#c0c0c0",
        tension: 0.1,
      },
    ],
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Dashboard Overview</h2>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-section">
          <h3>Analytics</h3>

          <div className="charts-grid">
            <div className="chart-container">
              <h4>Users by Role</h4>
              <Bar
                data={userRoleData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            <div className="chart-container">
              <h4>User Status Distribution</h4>
              <Pie data={userStatusData} options={{ responsive: true }} />
            </div>

            <div className="chart-container">
              <h4>Report Status</h4>
              <Bar
                data={reportStatusData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            <div className="chart-container">
              <h4>Post Status</h4>
              <Bar
                data={postStatusData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            <div className="chart-container full-width">
              <h4>Reports Over Time</h4>
              <Line data={reportTimeData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        <div className="section-content">
          <h3>Recent Activity</h3>

          <div className="activity-list">
            {reports.slice(0, 3).length > 0 ? (
              reports.slice(0, 3).map((report) => (
                <div className="activity-item" key={report._id}>
                  <div className="activity-indicator"></div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>New report</strong>{" "}
                      {report.reason || "submitted for review"}
                    </p>
                    <p className="activity-time">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="activity-item">
                  <div className="activity-indicator"></div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>No recent reports</strong>
                    </p>
                    <p className="activity-time">Everything is clear</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}