import React, { useState, useEffect } from 'react';
import '../../styles/Sidebar.css'; // Import your CSS styles
import { Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import logoImage from '../../dashboard_image/logo.png';
import dashboardIcon from '../../dashboard_image/Dashboard.svg';
import mealIcon from '../../dashboard_image/mymeal_icon.png';
import reportIcon from '../../dashboard_image/MyReport_icon.png';
import settIcon from '../../dashboard_image/Settings.svg';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AdminSideBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar is visible initially
    const [isMobile, setIsMobile] = useState(false); // Mobile detection

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed); // Toggle sidebar state
    };

    // Listen for window resize events to determine if we are in mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Check if screen width is 768px or less
            if (window.innerWidth > 768) {
                setIsCollapsed(false); // Sidebar always visible on larger screens
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check on component mount

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            {/* Hamburger button only visible on mobile */}
            {isMobile && (
                <div className="hamburger" onClick={toggleSidebar}>
                    <MenuOutlined />
                </div>
            )}

            {/* Sidebar */}
            <div className={`sidebar ${isMobile && isCollapsed ? 'collapsed' : ''}`}>
                {/* Logo and text */}
                <div className="logo">
                    <img src={logoImage} alt="Logo" className="logo-img" />
                    <span className="logo-text">Admin</span>
                </div>

                {/* Menu */}
                <Menu mode="vertical" defaultSelectedKeys={['1']} className="menu" style={{ backgroundColor: '#1F263E', color: '#1F263E!important' }}>
                    <Menu.Item key="1">
                        <Link to="/admin/food">
                            <img src={reportIcon} alt="My Report Icon" style={{ width: '20px', marginRight: '10px' }} />
                            Food
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/admin/meal">
                            <img src={mealIcon} alt="My Meal Icon" style={{ width: '20px', marginRight: '10px' }} />
                            Meal
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/admin/user-account">
                            <img src={settIcon} alt="My Setting Icon" style={{ width: '20px', marginRight: '10px' }} />
                            User Account
                        </Link>
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );
};

export default AdminSideBar;
