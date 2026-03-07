import React from 'react';

const features = [
    {
        title: 'AI Mock Interviews',
        description: 'Practice real interview questions with AI interviewers. Get instant, personalized feedback on your responses.'
    },
    {
        title: 'Multi-Model Evaluation',
        description: 'Multiple AI models analyze your responses for clarity, confidence, technical accuracy, and communication.'
    },
    {
        title: 'Instant Feedback',
        description: 'Receive detailed improvement suggestions instantly after each answer. Know your strengths and areas to improve.'
    },
    {
        title: 'Progress Tracking',
        description: 'Monitor your interview performance and growth over time with detailed analytics and skill tracking.'
    }
];

function Features() {
    return (
        <section className="features" id="features">
            <div className="section-container">
                <h2 className="section-title">Powerful Features</h2>
                <p className="section-subtitle">Everything you need to ace your next interview</p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
