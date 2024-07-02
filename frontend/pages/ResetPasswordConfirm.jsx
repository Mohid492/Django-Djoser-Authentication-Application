import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [success, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/auth/users/reset_password_confirm/`, {
        uid,
        token,
        new_password: newPassword,
        re_new_password: confirmPassword,
      });
      if (response.status === 204) {
        setSuccess(true);
        setError('');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while processing your request.');
    }
  };



  return (
    <div className="container mt-5">
      <h2>Reset Your Password</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Password reset successfully. Redirecting to Home page...</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPasswordConfirm;