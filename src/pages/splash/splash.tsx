// src/pages/splash/splash.tsx
import React from 'react';
import ChecklistIcon from '@mui/icons-material/PlaylistAddCheck';

import "../../styles/splash.css"
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <div className="logo">
        <ChecklistIcon style={{ fontSize: 48 }} />  {/* Adjust size as needed */}
      </div>
      <h1>Track Your Tasks Effortlessly</h1>
      <p>Organize your day, and get things done.</p>
      <button className="cta-button" onClick={() => { navigate("/auth") }}>Login/Register to Continue</button>
    </div>
  );
};

export default Splash;
