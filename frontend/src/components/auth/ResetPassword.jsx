import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
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
        setMessage('');

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
            const res = await resetPassword(token, password);
            setMessage(res.message + ' Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
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
                    <h2>Reset Password</h2>
                    <p className="auth-subtitle">Enter your new password</p>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
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
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading || !isStrong}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        <Link to="/login">Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
