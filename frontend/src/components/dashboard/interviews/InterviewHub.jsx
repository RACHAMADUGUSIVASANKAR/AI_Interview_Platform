import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
    { path: '/dashboard/ai-interview', title: 'AI Interview Mode', desc: 'Live AI interview with voice, video, and facial analysis - 10 min session', color: '#FF1744' },
    { path: '/dashboard/hr-interview', title: 'HR Interview', desc: 'Practice 25 common HR questions with AI evaluation', color: '#21A4C0' },
    { path: '/dashboard/technical-interview', title: 'Technical Interview', desc: '10 IT roles with 20+ role-specific technical questions', color: '#E6B800' },
    { path: '/dashboard/behavioral-interview', title: 'Behavioral Interview', desc: '22 situational questions evaluated for leadership and problem-solving', color: '#4CAF50' },
    { path: '/dashboard/coding-interview', title: 'Coding Interview', desc: 'Solve coding problems with integrated editor and test cases', color: '#FF5722' },
    { path: '/dashboard/jam-session', title: 'JAM Session', desc: 'Speak on a topic for 1 minute - AI evaluates fluency and confidence', color: '#9C27B0' },
    { path: '/dashboard/group-discussion', title: 'Group Discussion', desc: 'Simulate group discussions with AI participants', color: '#2196F3' },
    { path: '/dashboard/puzzle-games', title: 'Puzzle Games', desc: 'Logical puzzles and lateral thinking challenges', color: '#FF9800' },
    { path: '/dashboard/aptitude', title: 'Aptitude Round', desc: '60+ questions - quantitative, logical reasoning, verbal ability', color: '#607D8B' },
    { path: '/dashboard/resume-analyzer', title: 'Resume Analyzer', desc: 'Upload resume for ATS scoring and AI-powered suggestions', color: '#E91E63' },
    { path: '/dashboard/ai-resources', title: 'AI Resources', desc: 'Personalized learning resources based on your weak areas', color: '#00BCD4' },
];

function InterviewHub() {
    return (
        <div className="interview-hub">
            <h1 className="text-4xl font-semibold text-white uppercase mb-4">Interview Practice Hub</h1>
            <p className="page-subtitle text-xl text-white font-normal mb-12">Choose a module to start practicing</p>
            <div className="modules-grid">
                {modules.map((mod, index) => (
                    <Link to={mod.path} className="module-card" key={index} style={{ borderTop: `3px solid ${mod.color}` }}>
                        <h3>{mod.title}</h3>
                        <p>{mod.desc}</p>
                        <span className="module-cta" style={{ color: mod.color }}>Start Practice &rarr;</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default InterviewHub;
