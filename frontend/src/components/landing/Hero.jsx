import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="hero" id="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h1>
                        <span className="hero-highlight">Ace every interview</span> with AI-powered practice and smart feedback.
                    </h1>
                    <p className="hero-description">
                        Practice HR, technical, behavioral, and coding interviews with advanced AI models.
                        Get personalized feedback, track your progress, and build confidence before the big day.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/signup" className="btn btn-primary">Start Practicing Free</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Interview Modes</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">200+</span>
                            <span className="stat-label">AI Questions</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">AI</span>
                            <span className="stat-label">Smart Feedback</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
