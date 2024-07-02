import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const LoginForm = () => {
  const [loginError, setLoginError] = useState(null); // State to store error messages

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/jwt/create/', values, {
        withCredentials: true, // Important for CSRF token handling
      });

      console.log('Login successful:', response.data);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/', { state: { token: response.data.access } });
    }
     catch (error)
      {
      console.error('Login error:', error.response?.data || error);
      setLoginError(error.response?.data?.detail || 'An error occurred during login.');
      // You can display more specific error messages based on error.response.data
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          {loginError && <div className="error">{loginError}</div>} {/* Display error message */}

          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
            <br />
            <a href="/reset-password">Forgot password</a> {/* Link to ResetPassword.jsx */}
            <br />
            <a href="/register">Don't have an account? Register here</a> {/* Link to RegistrationForm.jsx */}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
