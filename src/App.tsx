import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./pages/main/main"
import Auth from "./pages/auth/auth"

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </Router>
    );
};

export default App;
