import React from 'react';

const advantages = [
    { title: 'Realistic AI Interview Simulation', description: 'Experience interview scenarios that feel like the real thing with AI-powered questioning.' },
    { title: 'Multi-AI Model Analysis', description: 'Your answers are evaluated by multiple AI models for comprehensive, unbiased feedback.' },
    { title: 'Performance Analytics Dashboard', description: 'Track your progress with detailed charts, scores, and skill-level analytics.' },
    { title: 'Personalized Improvement Tips', description: 'Get AI-curated learning resources and tips based on your weak areas.' }
];

function Advantages() {
    return (
        <section className="advantages" id="advantages">
            <div className="section-container">
                <div className="advantages-layout">
                    <div className="advantages-text">
                        <h2 className="section-title">Why Choose Our Platform?</h2>
                        <p className="section-subtitle">Powered by cutting-edge AI for the best preparation experience</p>
                        <div className="advantages-list">
                            {advantages.map((adv, index) => (
                                <div className="advantage-item" key={index}>
                                    <span className="advantage-icon">{String(index + 1).padStart(2, '0')}</span>
                                    <div>
                                        <h4>{adv.title}</h4>
                                        <p>{adv.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="advantages-visual">
                        <div className="dashboard-preview">
                            <div className="preview-header">
                                <div className="preview-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <span className="preview-title">AI Dashboard</span>
                            </div>
                            <div className="preview-body">
                                <div className="preview-stat-row">
                                    <div className="preview-stat">
                                        <span className="preview-stat-num">92%</span>
                                        <span className="preview-stat-label">Accuracy</span>
                                    </div>
                                    <div className="preview-stat">
                                        <span className="preview-stat-num">8.5</span>
                                        <span className="preview-stat-label">Avg Score</span>
                                    </div>
                                    <div className="preview-stat">
                                        <span className="preview-stat-num">24</span>
                                        <span className="preview-stat-label">Sessions</span>
                                    </div>
                                </div>
                                <div className="preview-chart">
                                    <div className="chart-bar" style={{ height: '60%' }}></div>
                                    <div className="chart-bar" style={{ height: '75%' }}></div>
                                    <div className="chart-bar" style={{ height: '45%' }}></div>
                                    <div className="chart-bar" style={{ height: '90%' }}></div>
                                    <div className="chart-bar" style={{ height: '70%' }}></div>
                                    <div className="chart-bar" style={{ height: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Advantages;
