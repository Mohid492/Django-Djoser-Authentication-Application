import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyResetCode = () => {
  const { email } = useParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/verify_reset_code/', { email, code });
      if (response.status === 200) {
        const { uid, token } = response.data;
        setSuccess(true);
        setError('');
        setTimeout(() => navigate(`/reset-password-confirm/${uid}/${token}`), 2000);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        setError(error.response.data.non_field_errors?.[0] || 'An error occurred while verifying the code.');
      } else {
        setError('An error occurred while verifying the code.');
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Verify Reset Code</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Code verified successfully. Redirecting to reset password form...</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="code">
          <h3>An Email has been sent to you for verification code ! </h3>
          <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Verify Code
        </Button>
      </Form>
    </div>
  );
};

export default VerifyResetCode;
