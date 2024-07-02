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
      const response = await axios.post('http://localhost:8000/send_reset_code/', { email });
      if (response.status === 200) {
        navigate(`/verify-reset-code/${email}`); // Redirect to verification page
      } else {
        setError('Failed to send reset code.');
      }
    } catch (error) {
      setError('An error occurred while processing the password reset request.');
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
          Send Reset Code
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
