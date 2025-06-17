import React, { useState } from 'react';
import './Signin.css';
import { Form, Button, Container } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signin = ({ close, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      errors.email = 'Invalid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      console.log('Login response data:', JSON.stringify(response.data, null, 2));

      // Call the login function from AuthContext
      login(response.data);

      // Call the onLogin callback if provided
      if (typeof onLogin === 'function') {
        onLogin(response.data);
      }

      // Close the modal if provided
      if (typeof close === 'function') {
        close();
      }

      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      setEmail('');
      setPassword('');
      setErrors({});
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.message || 'An error occurred during sign in'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-open">
      <div className="signin-overlay">
        <div className="signin-form">
          <div className="signin-header">
            <h2>Sign In</h2>
            <FaTimes
              className="cancel-icon"
              onClick={close}
              style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            />
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </Form.Group>

            {errors.submit && <div className="error mb-3">{errors.submit}</div>}

            <div className="text-center">
              <Button 
                variant="primary" 
                type="submit" 
                className="signin-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>

            <div className="forgot-password mt-3">
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signin;