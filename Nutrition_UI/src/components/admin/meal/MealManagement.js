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
    const [modal, setModal] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);

    //Param initiate
    const [nameMeal, setNameMeal] = useState('');
    const [mealId, setMealId] = useState('')
    const token = localStorage.getItem("token")

    //Toggle functions section
    const toggleModal = () => {
        setModal(!modal);
    };
    const toggleModalUpdate = () => {
        setModalUpdate(!modalUpdate);
    };
    const handleEditClick = (item) => {
        setMealId(item.meal_id);
        setNameMeal(item.name);
        toggleModalUpdate()
    };
    const resetMealParams = () => {
        setNameMeal('');
        setMealId('')
    }
    const resetParamAndToggleModel = () => {
        toggleModal();
        resetMealParams();
    }

    //Handle funtions section
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/meal`, {
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

    const handleInsertFood = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/meal/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: nameMeal,
                }),
            });

            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to insert food');
            }

            // Reset form fields and close modal after successful submission
            resetMealParams()
            toggleModal();
            fetchData(); // Refresh list after insertion if needed

        } catch (error) {
            console.error('Error inserting food:', error);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            console.log("activated delete food")
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/meal/delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    id: mealId,
                }).toString(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete food');
            }

            // Remove the deleted food from state to update UI
            setData(data.filter(meal => meal.meal_id !== mealId)); // Update the list by removing the deleted food
        } catch (error) {
            console.error('Error deleting food:', error);
        }
    };

    const handleUpdateMeal = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/meal/update`, {
                method: 'POST', // Use PUT for updates; use POST if your API requires it
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded', // Use JSON for the request body
                },
                body: new URLSearchParams({
                    id: mealId,
                    name: nameMeal
                }).toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update food');
            }

            // Reset form fields and close modal after successful submission
            resetMealParams()
            toggleModalUpdate();
            fetchData(); // Refresh list after insertion if needed
        } catch (error) {
            console.error('Error updating food:', error);
            // Optionally, you can add user-facing error handling here
        }
    };

    // Throttled server-side search handler
    const handleSearchMealServer = throttle(async (searchTerm) => {
        try {
            if (!searchTerm) {
                // If search term is empty, fetch all data
                fetchData();
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/meal/search`, {
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
            <h1 className="title">Meal Management</h1>
            <div className="header-container">
                <div type="button" className="btn btn-primary" onClick={() => resetParamAndToggleModel()}>Insert Meal</div>
                <div className="search-wrapper">
                    <img src={searchIcon} alt="My Search Icon" style={{ width: '20px' }} />
                    <input
                        type="search"
                        placeholder="Search"
                        className="search-bar"
                        onChange={(e) => handleSearchMealServer(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <table className="table table-hover ">
                    <thead>
                        <tr>
                            <th th style={{ width: '40%' }}>Id</th>
                            <th th style={{ width: '40%' }}>Name</th>
                            <th style={{ width: '1%' }}></th>
                            <th style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.meal_id}</td>
                                <td>{item.name}</td>
                                <td>
                                    <img
                                        src={editIcon}
                                        alt="My Edit Icon"
                                        className='edit-icon'
                                        onClick={() => handleEditClick(item)}
                                    />
                                </td>
                                <td>
                                    <img
                                        src={deleteIcon} // Replace with actual delete icon
                                        alt="Delete Food"
                                        className='delete-icon' // The CSS will handle cursor
                                        onClick={() => handleDeleteMeal(item.meal_id)} // Pass the correct food.id
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*Begin Insert food modal */}
            <Modal isOpen={modal} onClose={toggleModal} title="Insert Food Details Form">
                <div className='field-title'>Name</div>
                <div>
                    <input
                        type='text'
                        className='input-box'
                        placeholder='Enter Name'
                        value={nameMeal}
                        onChange={(e) => setNameMeal(e.target.value)}
                    />
                </div>

                <div className="btn-insert">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleInsertFood} // Trigger the insertion only on button click
                    >
                        Insert Meal
                    </button>
                </div>
            </Modal>
            {/*End Insert food modal */}

            {/*Begin Update food modal */}
            <Modal isOpen={modalUpdate} onClose={toggleModalUpdate} title="Update Food Details Form">
                <div className='field-title'>Name</div>
                <div>
                    <input
                        type='text'
                        className='input-box'
                        placeholder='Enter Name'
                        value={nameMeal}
                        onChange={(e) => setNameMeal(e.target.value)}
                    />
                </div>

                <div className="btn-insert">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUpdateMeal}
                    >
                        Update Food
                    </button>
                </div>
            </Modal>
            {/*End Update food modal */}
        </div>
    );
}
export default FoodManagement