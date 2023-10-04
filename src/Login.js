import React from "react";
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import "./Login.css";


function Login() {
    const navigate = useNavigate();  // Get the navigate function
  
  const handleGitHubLogin = () => {
    navigate('/auth/github');  // Navigate to /auth/github when the button is clicked
  }
  
  return (
    <div>
      <head>
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css"
        />
        <title>Login</title>
      </head>

      <header>
        <h1>Homework Helper</h1>
      </header>

      <main style={{ boxShadow: "10px 10px 10px 10px black" }}>
        <header>
          <h2>Welcome Back!</h2>
          <p>Please login to continue.</p>
        </header>
        <section>
          <div>
          <button onClick={handleGitHubLogin} className="github-login-btn">
            Login with GitHub
          </button>          
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;