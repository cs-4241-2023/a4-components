import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import GithubAuth from "./GithubAuth";  // import the redirect component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login.html" element={<Login />} />
        <Route path="/" element={<Main />} />
        <Route path="/auth/github" element={<GithubAuth />} />
      </Routes>
    </Router>
  );
}

export default App;