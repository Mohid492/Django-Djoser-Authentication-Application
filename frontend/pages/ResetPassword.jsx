import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/auth/users/reset_password/', { email });
      if (response.status === 204) {
        // Automatically fetch UID and token
        const resetData = await fetchResetData(email);

        if (resetData && resetData.uid && resetData.token) {
          navigate(`/reset-password-confirm/${resetData.uid}/${resetData.token}`); // Redirect to confirmation page
        } else {
          setError('Failed to get reset link.');
        }
      } else {
        setError('An error occurred.');
      }
    } catch (error) {
      setError('An error occurred while processing the password reset request.');
    }
  };

  const fetchResetData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8000/get_reset_data/?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reset data:", error); // Log for debugging
      return null; // Indicate failure
    }
  };


  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
