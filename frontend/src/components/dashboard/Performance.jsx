import React, { useState, useEffect } from 'react';
import { API } from '../../context/AuthContext';

function Performance() {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformance();
    }, []);

    const fetchPerformance = async () => {
        try {
            const [statsRes, historyRes] = await Promise.all([
                API.get('/interview/stats'),
                API.get('/interview/history')
            ]);
            setStats(statsRes.data);
            setHistory(historyRes.data);
        } catch (err) {
            console.error('Failed to fetch performance data:', err);
        }
        setLoading(false);
    };

    const totalSessions = stats?.totalSessions || 0;
    const avgScore = stats?.avgScore || 0;
    const bestScore = history.length > 0 ? Math.max(...history.map(s => s.overallScore)) : 0;
    const typeStats = stats?.typeStats || {};

    const skillData = Object.keys(typeStats).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        score: typeStats[key].avgScore || 0,
        count: typeStats[key].count || 0,
        color: {
            hr: '#21A4C0', technical: '#E6B800', behavioral: '#4CAF50',
            coding: '#FF5722', jam: '#9C27B0', 'group-discussion': '#2196F3',
            puzzle: '#FF9800', aptitude: '#607D8B', 'ai-interview': '#FF1744'
        }[key] || '#21A4C0'
    }));

    if (loading) {
        return <div className="performance-page"><p>Loading performance data...</p></div>;
    }

    return (
        <div className="performance-page">
            <h1 className="text-4xl font-extrabold mb-2 text-white">Performance Dashboard</h1>
            <p className="page-subtitle text-lg opacity-80 mb-10">Track your interview preparation progress</p>

            <div className="perf-stats-grid">
                <div className="perf-stat-card glass-card">
                    <div className="perf-stat-info">
                        <span className="perf-stat-value">{totalSessions}</span>
                        <span className="perf-stat-label">Total Sessions</span>
                    </div>
                </div>
                <div className="perf-stat-card glass-card">
                    <div className="perf-stat-info">
                        <span className="perf-stat-value">{avgScore || '-'}</span>
                        <span className="perf-stat-label">Average Score</span>
                    </div>
                </div>
                <div className="perf-stat-card glass-card">
                    <div className="perf-stat-info">
                        <span className="perf-stat-value">{bestScore || '-'}</span>
                        <span className="perf-stat-label">Best Score</span>
                    </div>
                </div>
                <div className="perf-stat-card glass-card">
                    <div className="perf-stat-info">
                        <span className="perf-stat-value">{skillData.length}</span>
                        <span className="perf-stat-label">Categories Practiced</span>
                    </div>
                </div>
            </div>

            {skillData.length > 0 && (
                <div className="perf-section glass-card">
                    <h3>Skill Analytics</h3>
                    <div className="skill-bars">
                        {skillData.map((skill, i) => (
                            <div className="skill-bar-item" key={i}>
                                <div className="skill-bar-header">
                                    <span>{skill.label} ({skill.count} sessions)</span>
                                    <span>{skill.score}%</span>
                                </div>
                                <div className="skill-bar-track">
                                    <div className="skill-bar-fill" style={{ width: `${skill.score}%`, background: skill.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="perf-section glass-card">
                <h3>Session History</h3>
                {history.length > 0 ? (
                    <div className="history-table-wrap">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Score</th>
                                    <th>Questions</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, i) => (
                                    <tr key={i}>
                                        <td>{new Date(item.completedAt).toLocaleDateString()}</td>
                                        <td>{item.type}{item.role ? ` - ${item.role}` : ''}</td>
                                        <td>
                                            <span className={`score-badge ${item.overallScore >= 70 ? 'high' : item.overallScore >= 50 ? 'medium' : 'low'}`}>
                                                {item.overallScore}/100
                                            </span>
                                        </td>
                                        <td>{item.totalQuestions || '-'}</td>
                                        <td><span className="status-badge">Completed</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-data-text">No sessions yet. Complete an interview to see your history.</p>
                )}
            </div>
        </div>
    );
}

export default Performance;
