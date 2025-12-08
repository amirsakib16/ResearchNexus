// src/components/Register.jsx - Registration Component

import { useState } from 'react';
import { registerSupervisor, registerStudent } from '../services/api';

function Register({ onBackToLogin }) {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    Name: '',
    Gmail: '',
    Interest: '',
    groups: '',
    SuperVisor: '',
    Group_id: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (userType === 'supervisor') {
        const data = {
          Name: formData.Name,
          Gmail: formData.Gmail,
          Interest: formData.Interest,
          groups: formData.groups.split(',').map(g => parseInt(g.trim()))
        };
        await registerSupervisor(data);
        setMessage('Supervisor registered successfully! You can now login.');
      } else {
        const data = {
          Name: formData.Name,
          Gmail: formData.Gmail,
          SuperVisor: formData.SuperVisor,
          Group_id: parseInt(formData.Group_id)
        };
        await registerStudent(data);
        setMessage('Student registered successfully! You can now login.');
      }
      
      // Clear form
      setFormData({
        Name: '',
        Gmail: '',
        Interest: '',
        groups: '',
        SuperVisor: '',
        Group_id: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        maxWidth: '450px'
      }}>
        <h2 style={{ color: '#395886', marginBottom: '30px', textAlign: 'center' }}>
          Register New User
        </h2>
        
        <form onSubmit={handleSubmit}>
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#395886', fontWeight: '600' }}>
              Name
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
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
              Email (Gmail)
            </label>
            <input
              type="email"
              name="Gmail"
              value={formData.Gmail}
              onChange={handleChange}
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

          {userType === 'supervisor' ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#395886', fontWeight: '600' }}>
                  Research Interest
                </label>
                <input
                  type="text"
                  name="Interest"
                  value={formData.Interest}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Machine Learning"
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
                  Groups (comma separated numbers)
                </label>
                <input
                  type="text"
                  name="groups"
                  value={formData.groups}
                  onChange={handleChange}
                  placeholder="e.g., 101, 102, 103"
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
            </>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#395886', fontWeight: '600' }}>
                  Supervisor Name
                </label>
                <input
                  type="text"
                  name="SuperVisor"
                  value={formData.SuperVisor}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Dr. Smith"
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
                  Group ID
                </label>
                <input
                  type="number"
                  name="Group_id"
                  value={formData.Group_id}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1"
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
            </>
          )}

          {message && (
            <div style={{ 
              color: '#28a745', 
              marginBottom: '15px', 
              fontSize: '14px',
              padding: '10px',
              background: '#d4edda',
              borderRadius: '6px'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ 
              color: '#d9534f', 
              marginBottom: '15px', 
              fontSize: '14px',
              padding: '10px',
              background: '#f8d7da',
              borderRadius: '6px'
            }}>
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
            Register
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
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
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;