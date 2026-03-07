import React from 'react';

const steps = [
    {
        step: '01',
        title: 'Choose Interview Type',
        description: 'Select from HR, Technical, Behavioral, Coding, and more interview types tailored to your career goals.'
    },
    {
        step: '02',
        title: 'Practice with AI',
        description: 'Answer AI-generated questions in a realistic interview environment with voice and text modes.'
    },
    {
        step: '03',
        title: 'Get AI Feedback',
        description: 'Receive detailed scores, strengths, improvement areas, and personalized tips from multiple AI models.'
    }
];

function HowItWorks() {
    return (
        <section className="how-it-works" id="how-it-works">
            <div className="section-container">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">Start practicing in just 3 simple steps</p>
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="step-card">
                                <div className="step-number">{step.step}</div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                            {index < steps.length - 1 && <div className="step-connector">-</div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
