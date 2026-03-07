import React from 'react';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: "Basic",
        price: "Free",
        features: ["5 AI Interviews / month", "Standard AI Feedback", "HR & Behavioral Modes", "Community Support"],
        button: "Get Started",
        highlight: false
    },
    {
        name: "Pro",
        price: "$19/mo",
        features: ["Unlimited AI Interviews", "Advanced Multi-Model Feedback", "All Technical & Coding Modes", "Resume Analysis Pro", "Priority Support"],
        button: "Upgrade to Pro",
        highlight: true
    },
    {
        name: "Team",
        price: "$49/mo",
        features: ["Everything in Pro", "Custom Interview Scenarios", "Team Performance Tracking", "API Access", "Dedicated Manager"],
        button: "Contact Sales",
        highlight: false
    }
];

function Pricing() {
    return (
        <section className="pricing" id="pricing">
            <div className="section-container">
                <h2 className="section-title">Simple Pricing</h2>
                <p className="section-subtitle">Choose the plan that fits your career goals</p>
                <div className="pricing-grid">
                    {plans.map((plan, index) => (
                        <div key={index} className={`pricing-card glass-card ${plan.highlight ? 'highlighted' : ''}`}>
                            {plan.highlight && <div className="popular-tag">Most Popular</div>}
                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="plan-price">{plan.price}</div>
                            </div>
                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                            <Link to="/signup" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}>
                                {plan.button}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Pricing;
