import React, { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';
import '../../../styles/ContentPage.css'; // Import your CSS styles
import searchIcon from '../../../image/Icon/search-icon.svg';
import deleteIcon from '../../../image/mymeal_image/Delete.svg';
import editIcon from '../../../image/mymeal_image/Edit.svg';
import Modal from '../../modal/Modal.js';
const FoodManagement = () => {
    useEffect(() => {
        import('bootstrap/dist/css/bootstrap.min.css');
    }, []);
    useEffect(() => {
        fetchData();
    }, []);
    //Modal initiate
    const [allData, setAllData] = useState([]);
    const [data, setData] = useState([]);

    //Param initiate
    const token = localStorage.getItem("token")

    //Toggle functions section
    //Handle funtions section
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const result = await response.json();
            setData(result);
            setAllData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            console.log("activated delete food")
            console.log(userId)
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/user/delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    id: userId,
                }).toString(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete food');
            }

            // Remove the deleted food from state to update UI
            setData(data.filter(user => user.user_id !== userId)); // Update the list by removing the deleted food
        } catch (error) {
            console.error('Error deleting food:', error);
        }
    };
    // Throttled server-side search handler
    const handleSearchUserServer = throttle(async (searchTerm) => {
        try {
            if (!searchTerm) {
                // If search term is empty, fetch all data
                fetchData();
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/user/search`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    string: searchTerm
                }).toString(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const result = await response.json();
            console.log('Search Results:', result);
            setData(result || []);
        } catch (error) {
            console.error('Error searching food:', error);
            // Optionally, handle errors (e.g., show a notification to the user)
        }
    }, 2000);

    return (
        <div className='content'>
            <h1 className="title">User Management</h1>
            <div className="header-container">
                <div>User Details</div>
                <div className="search-wrapper">
                    <img src={searchIcon} alt="My Search Icon" style={{ width: '20px' }} />
                    <input
                        type="search"
                        placeholder="Search"
                        className="search-bar"
                        onChange={(e) => handleSearchUserServer(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <table className="table table-hover ">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Birthday</th>
                            <th>Height</th>
                            <th>Weight</th>
                            <th>Weight Goal</th>
                            <th>Activity Level</th>
                            <th style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.user_id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.gender}</td>
                                <td>{item.birthday}</td>
                                <td>{item.height}</td>
                                <td>{item.weight}</td>
                                <td>{item.weight_goal}</td>
                                <td>{item.activity_level}</td>
                                <td>
                                    <img
                                        src={deleteIcon} // Replace with actual delete icon
                                        alt="Delete Food"
                                        className='delete-icon' // The CSS will handle cursor
                                        onClick={() => handleDeleteUser(item.user_id)} // Pass the correct food.id
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default FoodManagement