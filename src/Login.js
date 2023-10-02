// Login.js
import React from 'react';
import './Login.css'; // Import the CSS

function Login() {
    return (
        <div>
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
                        <a href="/auth/github" className="github-login-btn"> 
                            {/* Notice class changed to className */}
                            Login with GitHub
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Login;
