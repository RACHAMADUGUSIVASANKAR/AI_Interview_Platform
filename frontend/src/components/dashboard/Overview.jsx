import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../context/AuthContext';

function Overview() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, historyRes] = await Promise.all([
                API.get('/interview/stats'),
                API.get('/interview/history')
            ]);
            setStats(statsRes.data);
            setRecentActivity(historyRes.data.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch overview data:', err);
        }
        setLoading(false);
    };

    const totalSessions = stats?.totalSessions || 0;
    const avgScore = stats?.avgScore || 0;
    const totalQuestions = stats?.recentSessions?.reduce((sum, s) => sum + (s.totalQuestions || 0), 0) || 0;

    const quickActions = [
        { path: '/dashboard/ai-interview', label: 'AI Interview', color: '#00FF66' },
        { path: '/dashboard/hr-interview', label: 'HR Interview', color: '#00D556' },
        { path: '/dashboard/technical-interview', label: 'Technical', color: '#00AB45' },
        { path: '/dashboard/coding-interview', label: 'Coding', color: '#008134' },
    ];

    const statCards = [
        { label: 'Total Sessions', value: totalSessions, color: '#00FF66' },
        { label: 'Avg Score', value: avgScore ? `${avgScore}%` : '-', color: '#00D556' },
        { label: 'Questions Answered', value: totalQuestions, color: '#00AB45' },
        { label: 'Best Score', value: stats?.recentSessions?.length > 0 ? Math.max(...stats.recentSessions.map(s => s.overallScore)) + '%' : '-', color: '#008134' },
    ];

    return (
        <div className="overview-page">
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h1>Welcome back, {user?.name || 'User'}!</h1>
                    <p>Ready to ace your next interview? Practice with AI and improve your skills.</p>
                </div>
                <Link to="/dashboard/interviews" className="btn btn-primary">Start Practice</Link>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div className="stat-card glass-card" key={index}>
                        <div className="stat-info">
                            <span className="stat-value">{loading ? '...' : stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="section-header">
                <h3>Quick Start</h3>
                <Link to="/dashboard/interviews" className="view-all">View All &rarr;</Link>
            </div>
            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <Link to={action.path} className="quick-action-card glass-card" key={index}>
                        <span className="quick-label">{action.label}</span>
                    </Link>
                ))}
            </div>

            <div className="section-header">
                <h3>Recent Activity</h3>
            </div>
            {recentActivity.length > 0 ? (
                <div className="recent-activity-list">
                    {recentActivity.map((item, i) => (
                        <div className="activity-item glass-card" key={i}>
                            <div className="activity-info">
                                <span className="activity-type">{item.type} Interview</span>
                                <span className="activity-date">{new Date(item.completedAt).toLocaleDateString()}</span>
                            </div>
                            <span className={`score-badge ${item.overallScore >= 70 ? 'high' : item.overallScore >= 50 ? 'medium' : 'low'}`}>
                                {item.overallScore}%
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <img src="file:///C:/Users/sivasankar/.gemini/antigravity/brain/173977b7-d5d9-4b4c-ae6d-4d4a1c1f2bd7/interview_hero_cartoon_1772885901165.png" alt="No data" className="empty-cartoon" />
                    <p>No interview sessions yet. Start your first practice to see activity here!</p>
                    <Link to="/dashboard/interviews" className="btn btn-primary btn-sm">Begin Practice</Link>
                </div>
            )}
        </div>
    );
}

export default Overview;
