import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../styles/dashboard.css';

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="dashboard-topbar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        ☰
                    </button>
                    <h2 className="page-title">AI Interview Platform</h2>
                </div>
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
