import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Authentication.css';
import logo from '../../dashboard_image/logo.png';

const Resetpw = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the token from the URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('https://nutrition-website-be-1.onrender.com/api/users/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset successfully');
                setError('');
                navigate('/authentication');
            } else {
                setError(data.message || 'Password reset failed');
            }
        } catch (err) {
            console.error('An error occurred during the password reset process', err);
            setError('An error has occurred. Please try again.');
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
                <h2>Reset Password</h2>
                <p>Please enter your new password</p>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <button onClick={handleResetPassword}>Reset Password</button>
                {message && <p className="success">{message}</p>}

                <button onClick={() => navigate('/authentication')} className="back-to-login">
                    Back to login
                </button>
            </div>
        </div>
    );
};

export default Resetpw;
