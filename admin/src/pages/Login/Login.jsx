import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../config/axiosInstance';
import { toast } from 'react-toastify';
import './Login.css';
import logo from '../../assets/logo.png';

export const Login = ({ setToken }) => {
  const [currState, setCurrState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currState === 'Login') {
        const response = await axiosInstance.post('/admin/login', { email, password });
        if (response.data.success) {
          toast.success(response.data.message || 'Login successful!');
          // The backend sets the cookie, but we also save the token in localStorage for header fallback
          const token = response.data.token || 'authenticated';
          localStorage.setItem('adminToken', token);
          setToken(token);
          navigate('/dashboard');
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      } else {
        const response = await axiosInstance.post('/admin/signup', {
          name,
          email,
          password,
          phone
        });
        if (response.data.success) {
          toast.success(response.data.message || 'Registration successful!');
          setCurrState('Login');
        } else {
          toast.error(response.data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-glow-bubble-1'></div>
      <div className='login-glow-bubble-2'></div>
      
      <div className='login-container'>
        <div className='login-header-section'>
          <img src={logo} alt='Flave Me Logo' className='login-logo' />
          <h2>Admin Control Center</h2>
          <p>{currState === 'Login' ? 'Please log in to manage your system' : 'Create an administrative account'}</p>
        </div>

        <form onSubmit={onSubmitHandler} className='login-form'>
          {currState === 'Sign Up' && (
            <div className='form-group'>
              <label>Full Name</label>
              <input
                type='text'
                placeholder='Admin Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className='form-group'>
            <label>Email Address</label>
            <input
              type='email'
              placeholder='admin@flaveme.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {currState === 'Sign Up' && (
            <div className='form-group'>
              <label>Phone Number</label>
              <input
                type='text'
                placeholder='10-digit number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern='^[0-9]{10}$'
                title='Please enter a valid 10-digit phone number'
              />
            </div>
          )}

          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              placeholder='Min 8 characters'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type='submit' className='login-submit-btn' disabled={isLoading}>
            {isLoading ? 'Processing...' : currState === 'Login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className='login-footer-section'>
          {currState === 'Login' ? (
            <p>
              New administrator?{' '}
              <span onClick={() => setCurrState('Sign Up')} className='toggle-auth-state'>
                Request account setup
              </span>
            </p>
          ) : (
            <p>
              Already verified?{' '}
              <span onClick={() => setCurrState('Login')} className='toggle-auth-state'>
                Back to Sign In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
