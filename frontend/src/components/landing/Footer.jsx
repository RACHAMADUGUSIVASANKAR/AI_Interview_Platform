import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="section-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">AI</span>
                            <span>Interview Platform</span>
                        </Link>
                        <p>AI-Powered Multi-Model Interview Preparation and Practice Platform. Practice smarter, perform better.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#advantages">Advantages</a></li>
                            <li><Link to="/signup">Get Started</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Connect</h4>
                        <ul>
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="mailto:contact@aiinterview.com">Email Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AI Interview Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
