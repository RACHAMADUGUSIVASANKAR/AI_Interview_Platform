import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const passwordChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password),
    };

    const isStrong = Object.values(passwordChecks).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isStrong) {
            setError('Password must be strong.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="logo-icon" style={{ color: '#00FF66' }}>AI</span>
                        <span style={{ color: '#fff' }}>Interview</span>
                    </Link>
                </div>
                <div className="auth-card">
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">Start your AI-powered interview preparation</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                required
                            />
                            {password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div
                                            className={`strength-fill ${isStrong ? 'strong' : Object.values(passwordChecks).filter(Boolean).length >= 3 ? 'medium' : 'weak'}`}
                                            style={{ width: `${(Object.values(passwordChecks).filter(Boolean).length / 5) * 100}%` }}
                                        />
                                    </div>
                                    <ul className="strength-checks">
                                        <li className={passwordChecks.length ? 'pass' : 'fail'}>✓ At least 8 characters</li>
                                        <li className={passwordChecks.upper ? 'pass' : 'fail'}>✓ One uppercase letter</li>
                                        <li className={passwordChecks.lower ? 'pass' : 'fail'}>✓ One lowercase letter</li>
                                        <li className={passwordChecks.number ? 'pass' : 'fail'}>✓ One number</li>
                                        <li className={passwordChecks.special ? 'pass' : 'fail'}>✓ One special character (!@#$%^&*)</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading || !isStrong}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
