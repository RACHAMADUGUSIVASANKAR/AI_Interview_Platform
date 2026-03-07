import React from 'react';
import { Link } from 'react-router-dom';

function CallToAction() {
    return (
        <section className="cta" id="cta">
            <div className="section-container">
                <div className="cta-content">
                    <h2>Ready to <span className="cta-highlight">crack</span> your next interview?</h2>
                    <p>Join thousands of candidates who are preparing smarter with AI-powered interview practice. Start your journey today -- it is free!</p>
                    <div className="cta-buttons">
                        <Link to="/signup" className="btn btn-primary btn-lg">Start Practicing Free</Link>
                        <Link to="/signup" className="btn btn-outline-light btn-lg">Create Account</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CallToAction;
