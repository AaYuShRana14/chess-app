import axios from 'axios';  // Ensure axios is imported correctly
import React from 'react';  // Ensure React is imported correctly

const Signup = () => {
    const googleHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8000/googleauth',
                {}, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const { url } = response.data;  
            console.log(url);  
        } catch (error) {
            console.error('Error during Google auth:', error);
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <button onClick={googleHandler}>Google</button>
        </div>
    );
};

export default Signup;
