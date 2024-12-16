import React, { useState, useEffect } from 'react';
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
    const [data, setData] = useState([]); // Store data from API
    const [newEntry, setNewEntry] = useState({ name: "", age: "" });
    const [editEntry, setEditEntry] = useState(null); // Edit data entry
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    };

    // Fetch data from API when component mounts


    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/data`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleAdd = async () => {
        if (newEntry.name && newEntry.age) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/data`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newEntry),
                });
                if (!response.ok) throw new Error('Failed to add data');
                fetchData(); // Refresh data after adding
                setNewEntry({ name: "", age: "" }); // Clear form after submission
            } catch (error) {
                console.error("Error adding data:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/data/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error('Failed to delete data');
            fetchData(); // Refresh data after deletion
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/data/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editEntry),
            });
            if (!response.ok) throw new Error('Failed to update data');
            fetchData(); // Refresh data after update
            setEditEntry(null); // Reset edit entry
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div className='content'>
            <h1 className="title">Food Management</h1>
            <div className="header-container">
                <div type="button" className="btn btn-primary" onClick={toggleModal}>Insert Food</div>
                <div className="search-wrapper">
                    <img src={searchIcon} alt="My Search Icon" style={{ width: '20px' }} />
                    <input type="search" placeholder="Search" className="search-bar" />
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
                        <tr>
                            <td>John</td>
                            <td>Doe</td>
                            <td>john@example.com<br />asdsa</td>
                            <td><img src={editIcon} alt="My Edit Icon" className='edit-icon' /></td>
                            <td><img src={deleteIcon} alt="My Delete Icon" className='delete-icon' /></td>
                        </tr>
                        <tr>
                            <td>Mary</td>
                            <td>Moe</td>
                            <td>john@example.com<br />asdsa</td>
                            <td><img src={editIcon} alt="My Edit Icon" className='edit-icon' /></td>
                            <td><img src={deleteIcon} alt="My Delete Icon" className='delete-icon' /></td>
                        </tr>
                        <tr>
                            <td>July</td>
                            <td>Dooley</td>
                            <td>john@example.com<br />asdsa</td>
                            <td><img src={editIcon} alt="My Edit Icon" className='edit-icon' /></td>
                            <td><img src={deleteIcon} alt="My Delete Icon" className='delete-icon' /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modal} onClose={toggleModal} title="Food Details">
                <div className='field-title'>
                    Name
                </div>
                <div>
                    <input type='text' className='input-box' placeholder='Enter Name'></input>
                </div>
                <div className='field-title'>
                    Serving size
                </div>
                <div>
                    <input type='number' className='input-box' placeholder='Enter Serving Size'></input>
                </div><div className='field-title'>
                    Kcal
                </div>
                <div>
                    <input type='number' className='input-box' placeholder='Enter Protein'></input>
                </div><div className='field-title'>
                    Protein
                </div>
                <div>
                    <input type='number' className='input-box' placeholder='Enter Fat'></input>
                </div><div className='field-title'>
                    Fat
                </div>
                <div>
                    <input type='number' className='input-box' placeholder='Enter Fat'></input>
                </div>
                <div className='field-title'>
                    Carb
                </div>
                <div>
                    <input type='number' className='input-box' placeholder='Enter Carb'></input>
                </div>
                <div className="btn-insert">
                    <button type="button" className="btn btn-primary">
                        Insert food
                    </button>
                </div>
            </Modal>
        </div>
    );
}
export default FoodManagement