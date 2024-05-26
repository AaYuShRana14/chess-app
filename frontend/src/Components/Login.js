import axios from 'axios';
const Login=()=>{
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
            window.location.href = url;
        } catch (error) {
            console.error('Error during Google auth:', error);
        }
    };

    return (
        <div>
            <h1>login</h1>
            <button onClick={googleHandler}>Google</button>
        </div>
    );
}
export default Login;