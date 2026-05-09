import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { BestPracticeAPI, UserAPI } from '../lib/storage';
import Navbar from '../components/Navbar';
import '../styles/BestPractice.css';

function ProblemCard({ problem, solved, onClick }) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <div
      onClick={onClick}
      className="card bg-white p-4 cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 flex-1">{problem.title}</h3>
        {solved && <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">✓ SOLVED</span>}
      </div>
      <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
      <div className="flex gap-2 items-center">
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
          {problem.difficulty.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">+{problem.creditReward} credits</span>
      </div>
    </div>
  );
}

function ProblemSolver({ problem, onBack, onSubmit }) {
  const { user } = useContext(AuthContext);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(problem.languages[selectedLanguage]?.template || '');
  const [hint, setHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const currentLanguageData = problem.languages[selectedLanguage];

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setCode(problem.languages[lang]?.template || '');
    setShowHint(false);
    setFeedback(null);
    setTestResults(null);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const runTests = async () => {
    // Simulated test execution
    // In a real app, you'd send this to a backend service
    const testCases = currentLanguageData.testCases || [];
    const results = testCases.map((test, idx) => {
      // Simple check - if code contains key logic words
      const hasLogic = code.includes('if') || code.includes('for') || code.includes('while');
      return {
        name: test.description,
        passed: hasLogic && Math.random() > 0.4, // Simulated pass rate
        expected: test.expected,
      };
    });
    setTestResults(results);
    return results.some((r) => r.passed);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setFeedback({ type: 'error', message: 'Please write some code before submitting.' });
      return;
    }

    setSubmitting(true);
    try {
      const allPassed = await runTests();

      // Submit attempt and update credits
      BestPracticeAPI.submitAttempt(problem.id, user.id, selectedLanguage, code, allPassed);

      if (allPassed) {
        // Update current user in context
        const updatedUser = UserAPI.getUser(user.id);
        setFeedback({
          type: 'success',
          message: `Excellent! You earned +${problem.creditReward} credits! 🎉`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: `Not quite right. You lost ${Math.abs(problem.creditPenalty)} credits. Try again! 💪`,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
      >
        ← Back to Problems
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="card bg-white">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{problem.title}</h1>

          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 text-sm mb-4">{problem.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-2">Test Cases</h3>
            <div className="space-y-2">
              {currentLanguageData?.testCases?.map((test, idx) => (
                <div key={idx} className="bg-gray-100 p-3 rounded text-sm">
                  <p className="text-gray-700 font-medium">{test.description}</p>
                  <p className="text-gray-600">Input: <code>{test.input}</code></p>
                  <p className="text-gray-600">Expected: <code>{test.expected}</code></p>
                </div>
              ))}
            </div>
          </div>

          {/* Hint Section */}
          <div className="mb-4">
            <button
              onClick={toggleHint}
              className="w-full px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 transition-colors font-medium text-sm"
            >
              {showHint ? 'Hide Hint 💡' : 'Show Hint 💡'}
            </button>
            {showHint && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-800">
                <strong>Hint:</strong> {problem.hint}
              </div>
            )}
          </div>

          {/* Credits Info */}
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p className="text-gray-700">
              <strong>Correct Solution:</strong> <span className="text-green-600">+{problem.creditReward} credits</span>
            </p>
            <p className="text-gray-700">
              <strong>Wrong Attempt:</strong> <span className="text-red-600">{problem.creditPenalty} credits</span>
            </p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="card bg-white flex flex-col">
          {/* Language Selector */}
          <div className="mb-4 pb-4 border-b border-gray-300">
            <label className="block text-sm font-medium text-gray-900 mb-2">Language</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(problem.languages).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Your Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20"
              placeholder="Write your solution here..."
            />
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <h4 className="font-bold text-gray-900 mb-2">Test Results:</h4>
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div key={idx} className={`text-sm p-2 rounded ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.passed ? '✓' : '✗'} {result.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`mb-4 p-3 rounded text-sm font-medium ${
                feedback.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2">
            <button
              onClick={() => runTests()}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
            >
              Run Tests
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BestPractice() {
  const { user } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const allProblems = BestPracticeAPI.getAllProblems();
    const stats = BestPracticeAPI.getUserStats(user.id);
    const attempts = BestPracticeAPI.getUserAttempts(user.id);
    const solved = new Set(attempts.filter((a) => a.isCorrect).map((a) => a.problemId));

    setProblems(allProblems);
    setUserStats(stats);
    setSolvedProblems(solved);
  }, [user.id]);

  if (selectedProblem) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <ProblemSolver
          problem={selectedProblem}
          onBack={() => {
            setSelectedProblem(null);
            // Refresh stats
            const stats = BestPracticeAPI.getUserStats(user.id);
            const attempts = BestPracticeAPI.getUserAttempts(user.id);
            const solved = new Set(attempts.filter((a) => a.isCorrect).map((a) => a.problemId));
            setUserStats(stats);
            setSolvedProblems(solved);
          }}
          onSubmit={(problem, solved) => {
            if (solved) {
              setSolvedProblems(new Set([...solvedProblems, problem.id]));
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Best Practices</h1>
          <p className="text-gray-600">Solve coding problems in multiple languages and earn credits!</p>
        </div>

        {/* Stats */}
        {userStats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card bg-white text-center">
              <div className="text-3xl font-bold text-black mb-2">{userStats.solved}</div>
              <p className="text-gray-600 text-sm">Problems Solved</p>
            </div>
            <div className="card bg-white text-center">
              <div className="text-3xl font-bold text-black mb-2">{userStats.attempted}</div>
              <p className="text-gray-600 text-sm">Attempted</p>
            </div>
            <div className="card bg-white text-center">
              <div className="text-3xl font-bold text-black mb-2">{userStats.accuracy}%</div>
              <p className="text-gray-600 text-sm">Success Rate</p>
            </div>
          </div>
        )}

        {/* Problems Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Problems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                solved={solvedProblems.has(problem.id)}
                onClick={() => setSelectedProblem(problem)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
