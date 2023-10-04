// src/pages/auth/auth.tsx
import React, { useState } from 'react';
import { Login, Register } from '../../components/auth';

import "../../styles/auth.css"
import Header from '../../components/Header';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="auth-container" >
        <div className="auth-form-container">
          {isLogin ? (
            <div>
              <Login />
              <button className='form-toggle-button' onClick={toggleForm}>Switch to Register</button>
            </div>
          ) : (
            <div>
              <Register />
              <button className='form-toggle-button' onClick={toggleForm}>Switch to Login</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Auth;
