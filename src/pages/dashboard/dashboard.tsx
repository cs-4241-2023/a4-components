// src/pages/auth/auth.tsx
import React from 'react';

import "../../styles/dashboard.css"
import Header from '../../components/Header';
import TaskCard from '../../components/dashboard/TaskCard';

const Dashboard: React.FC = () => {
    return (
        <>
            <Header />
            <div className="dashboard-container" >
                <h1>TODO Tasks:</h1>
                <div className="dashboard-tasks-container" style={{ display: 'flex', flexDirection: 'column' }}>
                    <TaskCard />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
