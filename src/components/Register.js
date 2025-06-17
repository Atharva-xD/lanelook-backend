import React, { useState } from 'react';
import './Signin.css';
import { Form, Button } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ({ close, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

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

      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.message || 'An error occurred during registration'
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
            <h2>Register</h2>
            <FaTimes
              className="cancel-icon"
              onClick={close}
              style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            />
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </Form.Group>

            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <div className="error">{errors.username}</div>}
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            </Form.Group>

            {errors.submit && <div className="error mb-3">{errors.submit}</div>}

            <div className="text-center">
              <Button 
                variant="primary" 
                type="submit" 
                className="signin-button"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>

            <div className="forgot-password mt-3">
              <span>Already have an account? </span>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                if (typeof close === 'function') {
                  close();
                }
              }}>Sign In</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register; 