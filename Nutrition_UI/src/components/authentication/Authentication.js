import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Authentication.css';
import logo from '../../dashboard_image/logo.png';
import gg_logo from '../../image/Icon/gg_icon.png';

const Authentication = ({ onComplete }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('login'); // "login", "forgotPassword", or "resetPassword"

    const navigate = useNavigate();

    // Utility function to check if email contains any special characters
    const isEmailValid = (email) => /^[a-zA-Z0-9@.]+$/.test(email);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (!isEmailValid(email)) {
            setError('Email cannot contain special characters');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                
                // Fetch user data to get userId
                const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/users`, {
                    method: 'GET',
                    headers: {  
                        'Authorization': `Bearer ${data.token}`,
                    },
                });

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    localStorage.setItem('userId', userData.user.id); // Store userId in localStorage
                    localStorage.setItem('userName', userData.user.name); // Optional: Store userName if needed
                    setMessage(data.message);
                    setError('');
                    onComplete();
                    navigate('/dashboard');
                } else {
                    console.error('Error fetching user data:', userData);
                    setError('Failed to retrieve user information');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error during login', err);
            setError('An error has occurred. Please try again.');
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        try {
            const response = await fetch('https://nutrition-website-be-1.onrender.com/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset email sent successfully! Please check your email.');
                setError('');
            } else {
                setError(data.message || 'Failed to send reset email');
            }
        } catch (err) {
            console.error('Error sending reset email:', err);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="authentication-container">
            <div className="header-logo">
                <img src={logo} alt="Nutritioners Logo" />
                <h1 className="logo-title">Nutritioners</h1>
            </div>

            <div className="background"></div>

            <div className="auth-popup">
                {mode === 'login' && (
                    <>
                        <h2>Welcome back</h2>
                        <p>
                            You haven't had an account? &nbsp;
                            <Link to="/onboard"><span>Sign up</span></Link>
                        </p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} // Removes spaces
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="error">{error}</p>}

                        <p className="forgot-password" onClick={() => setMode('forgotPassword')}>
                            Forgot password
                        </p>

                        <button onClick={handleLogin}>Login</button>
                        <div className="divider">
                            <span>or</span>
                        </div>

                        <button className="google-signup1">
                            <img src={gg_logo} alt="Google icon" />
                            Continue with Google
                        </button>
                        {message && <p className="success">{message}</p>}
                    </>
                )}

                {mode === 'forgotPassword' && (
                    <>
                        <h2>Forgot password</h2>
                        <p>
                            Enter the email you used to create your account so we can send you instructions on how to reset your password.
                        </p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <p className="error">{error}</p>}
                        <button onClick={handleForgotPassword}>Send Email</button>
                        {message && <p className="success">{message}</p>}

                        <button onClick={() => setMode('login')} className="back-to-login">
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Authentication;
