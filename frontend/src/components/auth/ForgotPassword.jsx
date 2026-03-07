import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await forgotPassword(email);
            setMessage(res.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Try again.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="logo-icon">🤖</span>
                        <span>AI Interview</span>
                    </Link>
                </div>
                <div className="auth-card">
                    <h2>Forgot Password</h2>
                    <p className="auth-subtitle">Enter your email to receive a reset link</p>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Remember your password? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
