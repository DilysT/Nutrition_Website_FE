import React, { useState, useEffect } from 'react';
import '../../styles/Header.css';
import { Avatar } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import maskImage from '../../dashboard_image/Mask.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };

    const handleMenuClick = (option) => {
        if (option === 'manageAccount') {
            navigate('/settings');
        } else if (option === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/authentication');
        }
        setDropdownVisible(false);
    };

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            console.error('User ID or token does not exist in local storage');
            return;
        }

        try {
            const response = await fetch(`https://nutrition-website-be-1.onrender.com/api/auth/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const userData = await response.json();

            if (response.ok && userData.user) {
                setUserName(userData.user.name);
            } else {
                console.error("Error retrieving user information:", userData.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        if (userId && token) {
            fetchUserData();
        }
    }, []);

    return (
        <div className="header">
            <div className="hamburger-container">
                <div className="hamburger" />
                <div className="header-title">Nutritioners</div>
            </div>

            <div className="avatar-container" onClick={toggleDropdown}>
                <Avatar size={40} src={maskImage} icon={<UserOutlined />} />
                <span className="avatar-name">{userName}</span>
                <div className="dropdown-toggle">
                    <DownOutlined />
                </div>

                {isDropdownVisible && (
                    <div className="dropdown-menu" onClick={handleDropdownClick}>
                        <div className="dropdown-item" onClick={() => handleMenuClick('manageAccount')}>Manage Account</div>
                        <div className="dropdown-item" onClick={() => handleMenuClick('logout')}>Log out</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
