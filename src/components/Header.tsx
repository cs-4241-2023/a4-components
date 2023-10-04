// Header.js
import React from 'react';
import ChecklistIcon from '@mui/icons-material/PlaylistAddCheck';
import '../styles/header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="header-container">
      <div className="logo" onClick={() => navigate('/')}>
        <ChecklistIcon style={{ fontSize: 48 }} />
      </div>
      {/* Other header content, if any */}
    </header>
  );
}

export default Header;
