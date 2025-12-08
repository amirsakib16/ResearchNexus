// src/components/Login.jsx - Login Component

import { useState } from 'react';
import { login } from '../services/api';

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, userType);
      onLogin(response.data.user, response.data.userType);
    } catch (err) {
      setError('Login failed. User not found.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #638ECB 0%, #395886 100%)'
    }}>
      <div style={{
        background: '#F0F3FA',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#395886', marginBottom: '30px', textAlign: 'center' }}>
          File Management System
        </h2>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#395886', fontWeight: '600' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #D5DEEF',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#395886', fontWeight: '600' }}>
              User Type
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #D5DEEF',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          {error && (
            <div style={{ color: '#d9534f', marginBottom: '15px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#638ECB',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '10px',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#395886'}
            onMouseOut={(e) => e.target.style.background = '#638ECB'}
          >
            Login
          </button>

          <button
            type="button"
            onClick={onShowRegister}
            style={{
              width: '100%',
              padding: '14px',
              background: '#D5DEEF',
              color: '#395886',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#B1C9EF'}
            onMouseOut={(e) => e.target.style.background = '#D5DEEF'}
          >
            Register New User
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;