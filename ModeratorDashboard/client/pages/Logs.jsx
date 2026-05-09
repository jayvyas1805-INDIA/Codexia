import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/pages.css';

export default function Logs() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const mockActivityLogs = [
    { id: 1, action: 'User banned', target: 'Frank Castle', timestamp: '2024-03-10 15:45', type: 'ban', details: 'Permanent ban for violation of community guidelines' },
    { id: 2, action: 'User warned', target: 'Charlie Brown', timestamp: '2024-03-10 14:20', type: 'warn', details: 'Warning #2: Inappropriate language' },
    { id: 3, action: 'Post deleted', target: 'Post #1520', timestamp: '2024-03-10 13:15', type: 'delete', details: 'Spam content removed' },
    { id: 4, action: 'Report resolved', target: 'Report #3', timestamp: '2024-03-10 12:30', type: 'resolve', details: 'Content action taken' },
    { id: 5, action: 'User suspended', target: 'Alice Johnson', timestamp: '2024-03-09 10:45', type: 'suspend', details: '7-day temporary suspension' },
    { id: 6, action: 'User promoted', target: 'Bob Smith', timestamp: '2024-03-08 09:30', type: 'promote', details: 'Promoted to Moderator role' },
  ];

  useEffect(() => {
    setActivityLogs(mockActivityLogs);
  }, []);

  const filteredLogs = activityLogs.filter(log => {
    return filterType === 'all' || log.type === filterType;
  });

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h2>Activity Logs</h2>
          <p className="page-subtitle">Complete history of moderation actions</p>
        </div>

        {/* Filter */}
        <div className="filters-container">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="all">All Actions</option>
            <option value="ban">Bans</option>
            <option value="warn">Warnings</option>
            <option value="suspend">Suspensions</option>
            <option value="promote">Promotions</option>
            <option value="delete">Deletions</option>
            <option value="resolve">Resolutions</option>
          </select>
        </div>

        {/* Logs List */}
        <div className="logs-list">
          {filteredLogs.map(log => (
            <div key={log.id} className={`log-entry log-${log.type}`}>
              <div className="log-indicator"></div>
              <div className="log-content">
                <div className="log-header">
                  <p className="log-action"><strong>{log.action}</strong></p>
                  <span className={`action-type action-${log.type}`}>{log.type}</span>
                </div>
                <p className="log-target">Target: <strong>{log.target}</strong></p>
                <p className="log-details">{log.details}</p>
                <p className="log-time">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <p>No activity logs found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
