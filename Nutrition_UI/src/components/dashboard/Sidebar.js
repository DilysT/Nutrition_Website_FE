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

const SideBar = () => {
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
    <>
      {/* Hamburger button only visible on mobile */}
      {isMobile && (
        <div className="hamburger" onClick={toggleSidebar}>
          <MenuOutlined />
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile && isCollapsed ? 'collapsed' : ''}`}>

        <div className="logo">
          <img src={logoImage} alt="Logo" className="logo-img" />
          <span className="logo-text">Nutritioners</span>
        </div>

        <Menu mode="vertical" defaultSelectedKeys={['1']} className="menu"  style={{ backgroundColor: '#1F263E', color: '#1F263E!important' }} >
          <Menu.Item key="1">
            <Link to="/dashboard">
              <img src={dashboardIcon} alt="Dashboard Icon" style={{ width: '20px', marginRight: '10px' }} />
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/my-meal">
              <img src={mealIcon} alt="My Meal Icon" style={{ width: '20px', marginRight: '10px' }} />
              My Meal
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <img src={reportIcon} alt="My Report Icon" style={{ width: '20px', marginRight: '10px' }} />
            My Report
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/settings">
              <img src={settIcon} alt="My Setting Icon" style={{ width: '20px', marginRight: '10px' }} />
              Settings
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

export default SideBar;
