import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            // Redirect to login if no token
            navigate('/login');
            return;
        }

        fetch('http://localhost:8000/auth/users/me/', {
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token invalid or expired');
            }
            return response.json();
        })
        .then(data => setName(data.name))
        .catch(error => {
            console.log(error);
            // Redirect to login on error
            navigate('/login');
        });
    }, [navigate]);

    const handleResetEmail = () => {
        navigate('/reset-email'); 
    };
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token'); // Also remove refresh token
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
            <Button variant="secondary" className="position-absolute top-0 start-0 m-3" onClick={handleResetEmail}>
                Reset Email
            </Button>
            <Button variant="danger" className="position-absolute bottom-0 start-0 m-3" onClick={() => navigate('/reset-password')}>
                Reset Password
            </Button>
        </div>
    );
};

export default Home;
