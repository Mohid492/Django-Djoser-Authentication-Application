import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/auth/users/me/', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Token invalid or expired');
        }
        return response.json();
      })
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
      })
      .catch((error) => {
        console.error(error);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="text-center mt-5">
        <h1>Welcome to my website, {name}</h1>
      </div>
      <Button variant="primary" className="position-absolute top-0 end-0 m-3" onClick={handleLogout}>
        Logout
      </Button>
      <Button variant="danger" className="position-absolute bottom-0 start-0 m-3" onClick={() => navigate('/reset-password')}>
        Reset Password
      </Button>
    
    </div>
  );
};

export default Home;
