import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('chess-app-token', token);
            navigate('/');  
        } 
    }, [navigate]);

    return <div>Loading...</div>;
};

export default AuthRedirect;
