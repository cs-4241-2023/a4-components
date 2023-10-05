import React from 'react';

const Register = () => {
    return (
        <div>
            <form id="registerForm" action="/register" method="POST">
                <h3>Register</h3>
                <hr />
                <div className="form-spacer">
                    <h5>Email</h5>
                    <input type="email" id="email" placeholder="Email" name="email" />
                    <h5>Password</h5>
                    <input type="password" id="password" placeholder="Password" name="password" />
                    <hr />
                    <button type="submit" id="registerButton">Register</button>
                    <a href="/">Login</a>
                </div>
            </form>
        </div>
    );
};

export default Register;
