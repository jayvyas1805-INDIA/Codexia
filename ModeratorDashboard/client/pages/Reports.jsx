import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/pages.css";
import {
  getModeratorDashboardApi,
  getModeratorCommunityReportsApi,
  resolveReportApi,
  dismissReportApi,
} from "../apis/api";

export default function Reports() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [reports, setReports] = useState([]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);

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
    const fetchReports = async () => {
      if (!selectedCommunity) return;

      try {
        setReportsLoading(true);

        const res = await getModeratorCommunityReportsApi(selectedCommunity);
        setReports(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch reports");
      } finally {
        setReportsLoading(false);
      }
    };

    fetchReports();
  }, [selectedCommunity]);

  const handleReportAction = async (reportId, action) => {
    try {
      if (action === "resolved") {
        await resolveReportApi(reportId, "resolved");
      }

      if (action === "dismissed") {
        await dismissReportApi(reportId);
      }

      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, status: action } : r
        )
      );
    } catch (err) {
      alert(err.message || "Report action failed");
    }
  };

  const filteredReports = reports.filter((report) => {
    const severity = report.severity || "medium";

    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;

    const matchesSeverity =
      filterSeverity === "all" || severity === filterSeverity;

    return matchesStatus && matchesSeverity;
  });

  const pendingCount = filteredReports.filter(
    (r) => r.status === "pending"
  ).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <h2>Loading reports...</h2>
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
    <DashboardLayout pendingReports={pendingCount}>
      <div className="page-container">
        <div className="page-header">
          <h2>Content Reports</h2>
          <p className="page-subtitle">
            {reportsLoading ? "Loading reports..." : `${pendingCount} pending reports`}
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="reports-grid">
          {filteredReports.map((report) => {
            const severity = report.severity || "medium";

            return (
              <div
                key={report._id}
                className={`report-card report-${report.status} severity-${severity}`}
              >
                <div className="report-header">
                  <div>
                    <h3>{report.reason}</h3>
                    <span className={`severity-badge severity-${severity}`}>
                      {severity}
                    </span>
                  </div>

                  <span className={`report-status status-${report.status}`}>
                    {report.status}
                  </span>
                </div>

                <div className="report-body">
                  <p>
                    <strong>Target Type:</strong> {report.targetType}
                  </p>

                  <p>
                    <strong>Target ID:</strong> {report.targetId}
                  </p>

                  <p>
                    <strong>Reporter:</strong>{" "}
                    {report.reporter?.username || "Unknown"}
                  </p>

                  <p>
                    <strong>Details:</strong> {report.details || "-"}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div className="report-actions">
                  <button
                    className="btn-action btn-approve"
                    onClick={() => handleReportAction(report._id, "resolved")}
                    disabled={report.status !== "pending"}
                  >
                    Resolve
                  </button>

                  <button
                    className="btn-action btn-reject"
                    onClick={() => handleReportAction(report._id, "dismissed")}
                    disabled={report.status !== "pending"}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="empty-state">
            <p>No reports found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}