import React from 'react';

const Login = () => {
    return (
        <div>
            <form id="loginForm" action="/login" method="POST">
                <h3>Login</h3>
                <hr />
                <div className="form-spacer">
                    <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    />
                    <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    />
                    <hr />
                    <button type="submit" id="loginButton">Login</button>
                    <a href="/register">Register</a>
                    {/* <a href="/auth/google">Login with Google</a> */}
                </div>
            </form>
        </div>
    );
};

export default Login;
