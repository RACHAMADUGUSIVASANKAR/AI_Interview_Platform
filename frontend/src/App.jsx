import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Landing
import LandingPage from './components/landing/LandingPage';

// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import Profile from './components/dashboard/Profile';
import Performance from './components/dashboard/Performance';
import InterviewHub from './components/dashboard/interviews/InterviewHub';
import HRInterview from './components/dashboard/interviews/HRInterview';
import TechnicalInterview from './components/dashboard/interviews/TechnicalInterview';
import BehavioralInterview from './components/dashboard/interviews/BehavioralInterview';
import CodingInterview from './components/dashboard/interviews/CodingInterview';
import JAMSession from './components/dashboard/interviews/JAMSession';
import GroupDiscussion from './components/dashboard/interviews/GroupDiscussion';
import PuzzleGames from './components/dashboard/interviews/PuzzleGames';
import AptitudeRound from './components/dashboard/interviews/AptitudeRound';
import ResumeAnalyzer from './components/dashboard/interviews/ResumeAnalyzer';
import AIResources from './components/dashboard/interviews/AIResources';
import AIInterviewMode from './components/dashboard/interviews/AIInterviewMode';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-screen">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                        <Route index element={<Overview />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="performance" element={<Performance />} />
                        <Route path="interviews" element={<InterviewHub />} />
                        <Route path="hr-interview" element={<HRInterview />} />
                        <Route path="technical-interview" element={<TechnicalInterview />} />
                        <Route path="behavioral-interview" element={<BehavioralInterview />} />
                        <Route path="coding-interview" element={<CodingInterview />} />
                        <Route path="jam-session" element={<JAMSession />} />
                        <Route path="group-discussion" element={<GroupDiscussion />} />
                        <Route path="puzzle-games" element={<PuzzleGames />} />
                        <Route path="aptitude" element={<AptitudeRound />} />
                        <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
                        <Route path="ai-resources" element={<AIResources />} />
                        <Route path="ai-interview" element={<AIInterviewMode />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
