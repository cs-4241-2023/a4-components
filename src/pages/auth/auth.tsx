// src/pages/auth/auth.tsx
import React, { useState } from 'react';
import { Login, Register } from '../../components/auth';

import "../../styles/auth.css"

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth-container" >
      <div className="auth-form-container">
        {isLogin ? (
          <div>
            <Login />
            <button onClick={toggleForm}>Switch to Register</button>
          </div>
        ) : (
          <div>
            <Register />
            <button onClick={toggleForm}>Switch to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
