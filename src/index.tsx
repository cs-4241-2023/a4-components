import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeContext, ThemeProvider } from './ThemeContext'
import "./styles/index.css"

const Root = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="app-container" data-theme={theme}>
      <IconButton color="primary" aria-label="Toggle theme" onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      <App />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </React.StrictMode>,
)