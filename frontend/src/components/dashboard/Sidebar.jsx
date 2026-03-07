import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LiquidGlassCard } from '../ui/liquid-glass';
const IconHome = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IconUser = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IconActivity = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const IconLayoutDashboard = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
const IconLogOut = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>;

function Sidebar({ isOpen, onToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const mainNav = [
        { path: '/dashboard', label: 'Overview', icon: IconHome, end: true },
        { path: '/dashboard/profile', label: 'My Profile', icon: IconUser },
        { path: '/dashboard/performance', label: 'Performance', icon: IconActivity },
        { path: '/dashboard/interviews', label: 'Interview Hub', icon: IconLayoutDashboard },
    ];

    return (
        <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-wrapper h-full flex w-full items-center justify-center p-4 py-8">
                <LiquidGlassCard
                    glowIntensity="md"
                    shadowIntensity="lg"
                    borderRadius="24px"
                    blurIntensity="lg"
                    className="w-[300px] h-full flex flex-col p-4 relative"
                >
                    <div className="sidebar-header flex items-center justify-between px-2 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF66] to-[#00993D] flex items-center justify-center font-medium text-black text-lg shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                                AI
                            </div>
                            <span className="font-semibold text-white text-xl tracking-tight">Interview</span>
                        </div>
                    </div>

                    <div className="sidebar-scrollable flex-1 overflow-y-auto space-y-6 pr-2 pb-20 custom-scrollbar">
                        <div className="space-y-2 w-full relative z-30">
                            {mainNav.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={idx}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) => `
                                            w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300
                                            ${isActive
                                                ? 'bg-[#00FF66] text-black shadow-[0_8px_24px_rgba(0,255,102,0.4)] scale-[1.05]'
                                                : 'text-white hover:bg-[#00FF66]/20 hover:text-[#00FF66] hover:translate-x-1'}
                                        `}
                                        onClick={() => { if (window.innerWidth < 768) onToggle(); }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Icon className="w-5 h-5" />
                                            <span className="text-base">{item.label}</span>
                                        </div>
                                    </NavLink>
                                )
                            })}
                        </div>
                    </div>

                    <div className="absolute w-full bottom-0 left-0 p-3 bg-gradient-to-t from-black/80 to-transparent pt-10 z-40 rounded-b-[24px]">
                        <button
                            onClick={handleLogout}
                            className="btn btn-primary hover:scale-[1.02]"
                        >
                            <span>Logout Session</span>

                            <IconLogOut className="w-5 h-5" />
                        </button>
                    </div>
                </LiquidGlassCard>
            </div>
        </aside>
    );
}

export default Sidebar;
