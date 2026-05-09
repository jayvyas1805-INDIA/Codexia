import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getProblemsApi,
  createProblemApi,
  getSubmissionsByProblemApi,
  updateSubmissionApi,
} from "../apis/api";
import "../styles/pages.css";

export default function Content() {
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (selectedProblemId) {
      fetchSubmissions(selectedProblemId);
    } else {
      setSubmissions([]);
    }
  }, [selectedProblemId]);

  const getArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.problems)) return data.problems;
    if (Array.isArray(data?.submissions)) return data.submissions;
    return [];
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const res = await getProblemsApi();
      const list = getArray(res);

      setProblems(list);
    } catch (error) {
      alert(error.message || "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (problemId) => {
    try {
      setLoading(true);

      const res = await getSubmissionsByProblemApi(problemId);
      const list = getArray(res);

      setSubmissions(list);
    } catch (error) {
      alert(error.message || "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async () => {
    if (!problemTitle.trim() || !problemDescription.trim() || !difficulty) {
      alert("Please enter title, description and difficulty");
      return;
    }

    try {
      const res = await createProblemApi({
        title: problemTitle.trim(),
        description: problemDescription.trim(),
        difficulty: difficulty.toLowerCase(),
      });

      const newProblem = res?.data || res;

      setProblems([newProblem, ...problems]);

      setProblemTitle("");
      setProblemDescription("");
      setDifficulty("easy");
      setShowProblemForm(false);
    } catch (error) {
      console.log("Create problem error:", error);
      alert(error.message || "Failed to create problem");
    }
  };

  const handleSubmissionAction = async (submissionId, status) => {
    try {
      await updateSubmissionApi(submissionId, { status });

      setSubmissions((prev) =>
        prev.map((sub) =>
          (sub._id || sub.id) === submissionId
            ? { ...sub, status }
            : sub
        )
      );
    } catch (error) {
      alert(error.message || "Failed to update submission");
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    return filterStatus === "all" || submission.status === filterStatus;
  });

  const pendingCount = submissions.filter(
    (submission) => submission.status === "pending"
  ).length;

  return (
    <DashboardLayout pendingReports={pendingCount}>
      <div className="page-container">
        <div className="page-header">
          <h2>Problem Submissions Moderation</h2>
          <p className="page-subtitle">
            {pendingCount} pending submissions
          </p>
        </div>

        <div className="filters-container">
          <select
            value={selectedProblemId}
            onChange={(e) => setSelectedProblemId(e.target.value)}
            className="filter-select"
          >
            <option value="">Select Problem</option>

            {problems.map((problem) => (
              <option
                key={problem._id || problem.id}
                value={problem._id || problem.id}
              >
                {problem.title}
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={() => setShowProblemForm(!showProblemForm)}
          >
            {showProblemForm ? "Cancel" : "Create Problem"}
          </button>
        </div>

        {showProblemForm && (
          <div className="post-card">
            <h3>Create New Problem</h3>

            <div className="post-content">
              <input
                type="text"
                placeholder="Problem title"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="filter-select"
                style={{ width: "100%", marginBottom: "12px" }}
              />

              <textarea
                placeholder="Problem description"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                rows="5"
                className="filter-select"
                style={{ width: "100%", marginBottom: "12px" }}
              />

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="filter-select"
                style={{ width: "100%", marginBottom: "12px" }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="post-actions">
              <button
                className="btn-action btn-approve"
                onClick={handleCreateProblem}
              >
                Create
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        )}

        {!loading && !selectedProblemId && (
          <div className="empty-state">
            <p>Select a problem to view user submissions.</p>
          </div>
        )}

        {!loading && selectedProblemId && (
          <div className="posts-list">
            {filteredSubmissions.map((submission) => {
              const submissionId = submission._id || submission.id;

              const user =
                submission.user?.username ||
                submission.user?.name ||
                submission.author?.username ||
                "Unknown User";

              return (
                <div
                  key={submissionId}
                  className={`post-card post-${submission.status}`}
                >
                  <div className="post-header">
                    <div>
                      <p className="post-author">{user}</p>

                      <p className="post-time">
                        {submission.createdAt
                          ? new Date(submission.createdAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <div className="post-meta">
                      <span
                        className={`post-status status-${submission.status || "pending"
                          }`}
                      >
                        {submission.status || "pending"}
                      </span>
                    </div>
                  </div>

                  <div className="post-content">
                    <p>
                      <strong>Language:</strong>{" "}
                      {submission.language || "-"}
                    </p>

                    <pre
                      style={{
                        background: "#f4f4f4",
                        padding: "12px",
                        borderRadius: "8px",
                        overflowX: "auto",
                        marginTop: "10px",
                      }}
                    >
                      {submission.code || "No code submitted"}
                    </pre>
                  </div>

                  <div className="post-actions">
                    {(submission.status || "pending") === "pending" && (
                      <>
                        <button
                          className="btn-action btn-approve"
                          onClick={() =>
                            handleSubmissionAction(submissionId, "approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn-action btn-spam"
                          onClick={() =>
                            handleSubmissionAction(submissionId, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {submission.status !== "pending" && (
                      <button
                        className="btn-action btn-approve"
                        onClick={() =>
                          handleSubmissionAction(submissionId, "pending")
                        }
                      >
                        Mark Pending
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading &&
          selectedProblemId &&
          filteredSubmissions.length === 0 && (
            <div className="empty-state">
              <p>No submissions found for this problem.</p>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}