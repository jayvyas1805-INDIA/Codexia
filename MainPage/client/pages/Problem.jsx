import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import {
  getProblemByIdApi,
  createSubmissionApi,
  getSubmissionsByUserApi,
  updateSubmissionApi,
  getSubmissionsByProblemApi,
} from "../apis/api";
import Navbar from "../components/Navbar";
import "../styles/Problem.css";

export default function Problem() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userId = user?._id || user?.id;

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your solution here\n");
  const [submissions, setSubmissions] = useState([]);
  const [allProblemSubmissions, setAllProblemSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [showMoreSubmissions, setShowMoreSubmissions] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  const getStatus = (submission) => {
    return String(submission?.result || submission?.status || "").toLowerCase();
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const problemData = await getProblemByIdApi(id);
        const fetchedProblem = problemData?.data || problemData;

        if (!isMounted) return;

        if (!fetchedProblem) {
          navigate("/feed");
          return;
        }

        setProblem(fetchedProblem);

        const allProblemSubmissionsData = await getSubmissionsByProblemApi(id);
        const fetchedAllProblemSubmissions =
          allProblemSubmissionsData?.data || allProblemSubmissionsData || [];

        if (isMounted) {
          setAllProblemSubmissions(fetchedAllProblemSubmissions);
        }

        const languageKeys = Object.keys(fetchedProblem.languages || {});
        const defaultLang = languageKeys.includes("javascript")
          ? "javascript"
          : languageKeys[0];

        if (defaultLang) {
          setSelectedLanguage(defaultLang);
          setCode(
            fetchedProblem.languages?.[defaultLang]?.template ||
              "// Write your solution here\n"
          );
        }

        if (userId) {
          const submissionsData = await getSubmissionsByUserApi(userId);
          const allUserSubmissions = submissionsData?.data || submissionsData || [];

          const problemSubmissions = allUserSubmissions.filter(
            (s) =>
              String(s.problem?._id || s.problem || s.problemId) === String(id)
          );

          if (isMounted) setSubmissions(problemSubmissions);
        } else {
          if (isMounted) setSubmissions([]);
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
        navigate("/feed");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, userId, navigate]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setSelectedSubmissionId(null);
    setCode(problem.languages?.[lang]?.template || "");
  };

  const handleLoadSubmission = (submission) => {
    setCode(submission.code || "// No code found in this submission");
    setSelectedLanguage(submission.language || "javascript");
    setSelectedSubmissionId(submission._id);
  };

  const handleResetEditor = () => {
    setSelectedSubmissionId(null);
    setCode(
      problem.languages?.[selectedLanguage]?.template ||
        "// Write your solution here\n"
    );
  };

  const handleSubmit = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!code.trim()) {
      alert("Please write some code");
      return;
    }

    try {
      setSubmitting(true);

      let submission;

      if (selectedSubmissionId) {
        const response = await updateSubmissionApi(selectedSubmissionId, {
          code,
          language: selectedLanguage,
        });

        submission = response?.data || response;

        setSubmissions((prev) =>
          prev.map((s) => (s._id === selectedSubmissionId ? submission : s))
        );

        setAllProblemSubmissions((prev) =>
          prev.map((s) => (s._id === selectedSubmissionId ? submission : s))
        );

        alert("Submission updated successfully!");
      } else {
        const response = await createSubmissionApi({
          problemId: problem._id,
          code,
          language: selectedLanguage,
        });

        submission = response?.data || response;

        setSubmissions((prev) => [submission, ...prev]);
        setAllProblemSubmissions((prev) => [submission, ...prev]);
        setSelectedSubmissionId(submission._id);

        alert("Submission created successfully!");
      }
    } catch (err) {
      alert(err.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Problem not found</p>
        </div>
      </div>
    );
  }

  const difficultyClass = {
    easy: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    hard: "bg-red-100 text-red-700 border-red-300",
  };

  // TOP RIGHT WHOLE PROBLEM COUNTER
  const totalProblemAttempts = allProblemSubmissions.length;

  const totalProblemSolved = allProblemSubmissions.filter((s) => {
    const status = getStatus(s);
    return status === "accepted" || status === "approved";
  }).length;

  const totalProblemAcceptanceRate =
    totalProblemAttempts > 0
      ? ((totalProblemSolved / totalProblemAttempts) * 100).toFixed(1)
      : 0;

  // BOTTOM RIGHT USER COUNTER - unchanged logic
  const totalCount = submissions.length;

  const acceptedCount = submissions.filter((s) => {
    const status = getStatus(s);
    return status === "accepted" || status === "approved";
  }).length;

  const wrongCount = submissions.filter((s) => {
    const status = getStatus(s);
    return (
      status === "wrong answer" ||
      status === "wrong" ||
      status === "rejected" ||
      status === "reject"
    );
  }).length;

  const pendingCount = submissions.filter((s) => {
    const status = getStatus(s);
    return (
      !status ||
      status === "pending" ||
      status === "pending review" ||
      status === "submitted"
    );
  }).length;

  const acceptanceRate =
    totalCount > 0 ? ((acceptedCount / totalCount) * 100).toFixed(1) : 0;

  const languageKeys = Object.keys(problem.languages || {});
  const selectedLanguageData = problem.languages?.[selectedLanguage];

  const visibleSubmissions = showMoreSubmissions
    ? submissions
    : submissions.slice(0, 5);

  const selectedSubmission = submissions.find(
    (s) => s._id === selectedSubmissionId
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-white border border-gray-300 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              {problem.community && (
                <Link
                  to={`/community/${problem.community._id}`}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-2"
                >
                  <span>{problem.community.icon || "👥"}</span>
                  <span>{problem.community.name}</span>
                </Link>
              )}

              <h1 className="text-3xl font-bold text-gray-900">
                {problem.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    difficultyClass[problem.difficulty] ||
                    "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {problem.difficulty?.charAt(0).toUpperCase() +
                    problem.difficulty?.slice(1)}
                </span>

                {problem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 border border-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="text-lg font-bold text-gray-900">
                  {totalProblemSolved}
                </div>
                <div className="text-xs text-gray-500">Solved</div>
              </div>

              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="text-lg font-bold text-gray-900">
                  {totalProblemAttempts}
                </div>
                <div className="text-xs text-gray-500">Attempts</div>
              </div>

              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="text-lg font-bold text-gray-900">
                  {totalProblemAcceptanceRate}%
                </div>
                <div className="text-xs text-gray-500">Accept</div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card bg-white border border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Description
              </h2>

              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {problem.description}
              </p>
            </div>

            {problem.examples?.length > 0 && (
              <div className="card bg-white border border-gray-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Examples
                </h2>

                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Example {index + 1}
                      </h3>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">
                            Input:
                          </span>
                          <pre className="mt-1 bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                            {example.input}
                          </pre>
                        </div>

                        <div>
                          <span className="font-medium text-gray-900">
                            Output:
                          </span>
                          <pre className="mt-1 bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                            {example.output}
                          </pre>
                        </div>

                        {example.explanation && (
                          <div>
                            <span className="font-medium text-gray-900">
                              Explanation:
                            </span>
                            <p className="text-gray-700 mt-1">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLanguageData?.testCases?.length > 0 && (
              <div className="card bg-white border border-gray-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Test Cases - {selectedLanguage}
                </h2>

                <div className="space-y-3">
                  {selectedLanguageData.testCases.map((test, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-2">
                        Test Case {index + 1}
                      </div>

                      {test.description && (
                        <p className="text-sm text-gray-700 mb-2">
                          {test.description}
                        </p>
                      )}

                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            Input:
                          </span>
                          <pre className="mt-1 bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                            {test.input}
                          </pre>
                        </div>

                        <div>
                          <span className="font-medium text-gray-900">
                            Expected:
                          </span>
                          <pre className="mt-1 bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                            {test.expected}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {problem.constraints?.length > 0 && (
              <div className="card bg-white border border-gray-300">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Constraints
                </h2>

                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {problem.hints?.length > 0 && (
              <div className="card bg-white border border-gray-300">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Hints
                </h2>

                <div className="space-y-2">
                  {problem.hints.map((hint, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-lg p-3 text-gray-700"
                    >
                      Hint {index + 1}: {hint}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card bg-white border border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Code Editor
                </h2>

                {languageKeys.length > 0 && (
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    {languageKeys.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSubmission && (
                <div className="mb-3 bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 flex justify-between items-center">
                  <span>Editing previous submission</span>
                  <button
                    onClick={handleResetEditor}
                    className="text-black underline"
                  >
                    Reset
                  </button>
                </div>
              )}

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[360px] border border-gray-300 rounded-lg p-4 font-mono text-sm outline-none focus:border-black"
              />

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 w-full bg-black text-white rounded-lg py-3 font-medium disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : selectedSubmissionId
                  ? "Update Submission"
                  : "Submit Solution"}
              </button>
            </div>

            <div className="card bg-white border border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Stats
              </h2>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="text-lg font-bold text-gray-900">
                    {acceptedCount}
                  </div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>

                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="text-lg font-bold text-gray-900">
                    {wrongCount}
                  </div>
                  <div className="text-xs text-gray-500">Wrong</div>
                </div>

                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="text-lg font-bold text-gray-900">
                    {pendingCount}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>

                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="text-lg font-bold text-gray-900">
                    {acceptanceRate}%
                  </div>
                  <div className="text-xs text-gray-500">Rate</div>
                </div>
              </div>
            </div>

            <div className="card bg-white border border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                My Submissions
              </h2>

              {visibleSubmissions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No submissions yet for this problem.
                </p>
              ) : (
                <div className="space-y-3">
                  {visibleSubmissions.map((submission) => {
                    const status = getStatus(submission);

                    return (
                      <div
                        key={submission._id}
                        className="border border-gray-300 rounded-lg p-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {submission.language}
                          </div>

                          <div className="text-sm text-gray-500">
                            Status:{" "}
                            {status
                              ? status.charAt(0).toUpperCase() +
                                status.slice(1)
                              : "Pending"}
                          </div>

                          {submission.createdAt && (
                            <div className="text-xs text-gray-400">
                              {new Date(
                                submission.createdAt
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleLoadSubmission(submission)}
                          className="px-3 py-1 rounded bg-gray-100 border border-gray-300 text-sm hover:bg-gray-200"
                        >
                          Load
                        </button>
                      </div>
                    );
                  })}

                  {submissions.length > 5 && (
                    <button
                      onClick={() =>
                        setShowMoreSubmissions(!showMoreSubmissions)
                      }
                      className="text-sm text-black underline"
                    >
                      {showMoreSubmissions ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


