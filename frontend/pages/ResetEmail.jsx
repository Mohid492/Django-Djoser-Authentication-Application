import React, { useState ,useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ResetEmail = () => {
    const [email, setEmail] = useState('');  // This will now be the current user's email
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    // Fetch current user's email when component mounts
    fetchCurrentEmail();
  }, []);
  const fetchCurrentEmail = async () => {
    try {
      // Replace with your API endpoint to get the current user's email
      const response = await axios.get('http://localhost:8000/api/user/profile/');  
      setEmail(response.data.email);
    } catch (error) {
      setError('Could not fetch your current email. Please log in again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // POST to Djoser's password reset endpoint with the current user's email
      const response = await axios.post('http://localhost:8000/auth/users/reset_username/', {
        email: email
      });

      if (response.status === 204) {
        // Extract uid and token from the password reset link in the email (backend sends this)
        // You'll need to modify the backend to return the link directly
        const resetData = await fetchResetData(email);

        if (resetData && resetData.reset_link) {
          const url = new URL(resetData.reset_link);
          const pathParts = url.pathname.split('/');
          const uid = pathParts[pathParts.length - 2];
          const token = pathParts[pathParts.length - 1];
          
          navigate(`/reset-email/${uid}/${token}`); // Redirect to confirmation page
        } else {
          setError('Failed to get reset link.');
        }
      } else {
        setError(response.data.email[0] || 'An error occurred.'); // Extract error message
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const fetchResetData = async (email) => {
    try {
      // Assuming your backend provides a way to get the reset data
      const response = await axios.get(`http://localhost:8000/get_reset_data/?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reset data:", error); // Log for debugging
      return null; // Indicate failure
    }
  };
    return (
        <div className="container mt-5">
            <h2>Reset Email</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="newEmail">
                    <Form.Label>New Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>
    );
};

export default ResetEmail;
