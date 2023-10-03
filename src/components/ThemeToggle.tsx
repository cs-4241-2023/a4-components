// src/components/ThemeToggle.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
    );
};

export default ThemeToggle;
