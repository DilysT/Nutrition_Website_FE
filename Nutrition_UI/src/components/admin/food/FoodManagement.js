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
    const [nameFood, setNameFood] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');
    const [foodId, setFoodId] = useState('')
    const token = localStorage.getItem("token")

    //Toggle functions section
    const toggleModal = () => {
        setModal(!modal);
    };
    const toggleModalUpdate = () => {
        setModalUpdate(!modalUpdate);
    };
    const handleEditClick = (item) => {
        setFoodId(item.food_id);
        setNameFood(item.name_food);
        setServingSize(item.serving_size);
        setCalories(item.calories);
        setProtein(item.protein);
        setFat(item.fat);
        setCarbs(item.carbs);
        toggleModalUpdate();
    };
    const resetFoodParams = () => {
        setNameFood('');
        setServingSize('');
        setCalories('');
        setProtein('');
        setFat('');
        setCarbs('');
        setFoodId('')
    }
    const resetParamAndToggleModel = () => {
        toggleModal();
        resetFoodParams();
    }

    //Handle funtions section
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/foods`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const result = await response.json();
            setData(result.food);
            setAllData(result.food);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInsertFood = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/food/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nameFood,
                    servingSize,
                    calories,
                    protein,
                    fat,
                    carbs
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to insert food');
            }

            // Reset form fields and close modal after successful submission
            resetFoodParams()
            toggleModal();
            fetchData(); // Refresh list after insertion if needed

        } catch (error) {
            console.error('Error inserting food:', error);
        }
    };

    const handleDeleteFood = async (foodId) => {
        try {
            console.log("activated delete food")
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/food/delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    foodId: foodId,
                }).toString(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete food');
            }

            // Remove the deleted food from state to update UI
            setData(data.filter(food => food.food_id !== foodId)); // Update the list by removing the deleted food
        } catch (error) {
            console.error('Error deleting food:', error);
        }
    };

    const handleUpdateFood = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/food/update`, {
                method: 'POST', // Use PUT for updates; use POST if your API requires it
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded', // Use JSON for the request body
                },
                body: new URLSearchParams({
                    foodId: foodId,
                    nameFood: nameFood,
                    servingSize: servingSize,
                    calories: calories,
                    protein: protein,
                    fat: fat,
                    carbs: carbs
                }).toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update food');
            }

            // Reset form fields and close modal after successful submission
            resetFoodParams()
            toggleModalUpdate();
            fetchData(); // Refresh list after insertion if needed
        } catch (error) {
            console.error('Error updating food:', error);
            // Optionally, you can add user-facing error handling here
        }
    };

    // Throttled server-side search handler
    const handleSearchFoodServer = throttle(async (searchTerm) => {
        try {
            console.log(searchTerm)
            if (!searchTerm) {
                // If search term is empty, fetch all data
                fetchData();
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/food/search`, {
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
            <h1 className="title">Food Management</h1>
            <div className="header-container">
                <div type="button" className="btn btn-primary" onClick={() => resetParamAndToggleModel()}>Insert Food</div>
                <div className="search-wrapper">
                    <img src={searchIcon} alt="My Search Icon" style={{ width: '20px' }} />
                    <input
                        type="search"
                        placeholder="Search"
                        className="search-bar"
                        onChange={(e) => handleSearchFoodServer(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <table className="table table-hover ">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Size</th>
                            <th style={{ width: '1%' }}></th>
                            <th style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.food_id}</td>
                                <td>{item.name_food}</td>
                                <td>{item.serving_size}</td>
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
                                        onClick={() => handleDeleteFood(item.food_id)} // Pass the correct food.id
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
                        value={nameFood}
                        onChange={(e) => setNameFood(e.target.value)}
                    />
                </div>

                <div className='field-title'>Serving Size</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Serving Size'
                        value={servingSize}
                        onChange={(e) => setServingSize(e.target.value)}
                    />
                </div>

                <div className='field-title'>Kcal</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Kcal'
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                    />
                </div>

                <div className='field-title'>Protein</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Protein'
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                    />
                </div>

                <div className='field-title'>Fat</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Fat'
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                    />
                </div>

                <div className='field-title'>Carb</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Carb'
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                    />
                </div>

                <div className="btn-insert">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleInsertFood} // Trigger the insertion only on button click
                    >
                        Insert Food
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
                        value={nameFood}
                        onChange={(e) => setNameFood(e.target.value)}
                    />
                </div>

                <div className='field-title'>Serving Size</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Serving Size'
                        value={servingSize}
                        onChange={(e) => setServingSize(e.target.value)}
                    />
                </div>

                <div className='field-title'>Kcal</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Kcal'
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                    />
                </div>

                <div className='field-title'>Protein</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Protein'
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                    />
                </div>

                <div className='field-title'>Fat</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Fat'
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                    />
                </div>

                <div className='field-title'>Carb</div>
                <div>
                    <input
                        type='number'
                        className='input-box'
                        placeholder='Enter Carb'
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                    />
                </div>

                <div className="btn-insert">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUpdateFood}
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