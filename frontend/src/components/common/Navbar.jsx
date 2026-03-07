import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

function Navbar() {
    return (
        <nav className="navbar" id="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">AI</span>
                    <span className="logo-text">Interview</span>
                </Link>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#advantages">Advantages</a>
                    <Link to="/login" className="nav-btn nav-btn-outline">Log In</Link>
                    <Link to="/signup" className="nav-btn nav-btn-primary">Get Started</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
