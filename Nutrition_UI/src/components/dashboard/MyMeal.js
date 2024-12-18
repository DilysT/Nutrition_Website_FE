import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Avatar, Button, Table, DatePicker, notification } from 'antd';
import { UserOutlined, CalendarOutlined, LogoutOutlined, PieChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../../styles/MyMeal.css';
import search from '../../image/mymeal_image/search.jpg';
import moment from 'moment';

import { DateContext } from './DateContext'; // Đường dẫn đã được sửa


import deleteIcon from '../../image/mymeal_image/Delete.svg';
import editIcon from '../../image/mymeal_image/Edit.svg';
//Layout
const { Header, Content, Sider } = Layout;
//Modal
const MyMeal = () => {
  const [calendar, setCalendar] = useState(new Date().toISOString().split('T')[0]);
const { setSelectedDate } = useContext(DateContext);
  
  const [foodId, setFoodid] = useState('');
  const [mealId, setMealid] = useState('1');
  const [portion, setPortion] = useState('1');
  const [name, setName] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  // const [mealData, setMealData] = useState(null);
  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);
  const [breakfastTotal, setBreakfastTotal] = useState({ calories: 0.00, protein: 0.00, carbs: 0.00, fat: 0.00 });
  const [lunchTotal, setLunchTotal] = useState({ calories: 0.00, protein: 0.00, carbs: 0.00, fat: 0.00 });
  const [dinnerTotal, setDinnerTotal] = useState({ calories: 0.00, protein: 0.00, carbs: 0.00, fat: 0.00 });
  const [size, setServingsize] = useState('135');
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal4, setModal4] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [foodDetails, setFoodDetails] = useState([]);
  // const [mealData, setMealData] = useState(null);
  const [previousMeals, setPreviousMeals] = useState({});

  // Toggle Modal 1
  const toggleModal = () => {
    setModal(!modal);
    setModal2(false);
  };

  // Toggle Modal 2
  const toggleModal2 = (event) => {
    setModal2(!modal2);
    setModal(false);
    const foodValue = event.target.getAttribute('data-value');
    setFoodid(foodValue);
    console.log(`Giá trị của món ăn: ${foodValue}`);
  };

  const toggleModal3 = (event) => {
    setModal2(!modal2);
    setModal(false);
  };

  const toggleModal4 = () => {
    setModal4(!modal4);
  };

  const handleMealChange = (event) => {
    const mealValue = event.target.value;
    setMealid(mealValue);
    console.log(`Giá trị của bữa ăn: ${mealValue}`);
    // Thực hiện các hành động khác với mealValue, ví dụ gán vào state nếu cần
  };

  const handleServingSizeChange = (event) => {
    const servingSizeValue = event.target.value;
    setServingsize(servingSizeValue);
    console.log(`Giá trị của kích thước phục vụ: ${servingSizeValue}`);
    // Thực hiện các hành động khác với servingSizeValue, ví dụ gán vào state nếu cần
  };

  const handleNumberInputChange = (event) => {
    const inputValue = event.target.value;
    setPortion(inputValue);
    console.log(`Số lượng người dùng nhập: ${inputValue}`);
    // Thực hiện các hành động khác với inputValue, ví dụ gán vào state nếu cần
  };


  // const handleCalendarChange = (date, dateString) => {
  //   setCalendar(dateString);
  //   console.log(`Ngày người dùng nhập: ${dateString}`);
  // };

  // Apply or remove class for modal management
  if (modal || modal2) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  const handleAddfood = async () => {
    try {
      // Xác định date từ state
      // if (date) {
      //   setCalendar(dateString);
      // }
      const date = calendar;
      console.log("date:", date)
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      // Gửi yêu cầu POST để thêm thức ăn vào bữa ăn
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals/${mealId}/foods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodId, date, size, portion }),
      });

      // Kiểm tra nếu phản hồi từ server thành công
      if (response.ok) {
        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals/${mealId}/foods/${foodId}?date=${encodeURIComponent(date)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User data:', userData);

          // Đảm bảo `userData.foodNutrition` tồn tại trước khi truy cập các thuộc tính
          if (userData) {
            const newFoodData = {
              key: userData.food.food_id,
              name_food: userData.food.name_food,
              portion: userData.food.portion,
              size: userData.food.size,
              calories: userData.food.calories,
              protein: userData.food.protein,
              carbs: userData.food.carbs,
              fat: userData.food.fat,
              mealId: userData.food.meal_id,
            };

            // Thêm thức ăn vào phần ăn thích hợp dựa trên mealId
            if (mealId == 1) {
              setBreakfastData((prevData) => [...prevData, newFoodData]);
            } else if (mealId == 2) {
              setLunchData((prevData) => [...prevData, newFoodData]);
            } else if (mealId == 3) {
              setDinnerData((prevData) => [...prevData, newFoodData]);
            }

            notification.success({
              message: 'Success',
              description: 'Food added successfully!',
            });

            // Đóng modal
            setTimeout(() => setModal2(false), 500);
          } else {
            console.error('foodNutrition data is missing in the response:', userData);
          }
        } else {
          console.error('Error fetching user data:', await userResponse.json());
        }
      } else {
        console.error('Error adding food:', await response.json());
      }
    } catch (err) {
      console.error('Error during food addition process:', err);
    }
  };
  const handleAddFoodAndTotal = async () => {
    await handleAddfood();
    await handleTotal(calendar); // Thay `date` bằng giá trị ngày cần truyền
  };
  const handleDeleteAndTotal = async (mealId, foodId) => {
    await handleDelete(mealId, foodId);
    await handleTotal(calendar); // Gọi handleTotal để cập nhật tổng sau khi xóa
  };
  const handleEditAndTotal = async (mealId, foodId) => {
    await handleEdit(mealId, foodId);
    await handleTotal(calendar); // Cập nhật tổng sau khi lưu chỉnh sửa
  };
  const handleChooseButtonClick = (event) => {
    toggleModal2(event);
  };
  useEffect(() => {
    if (modal2) {
      handleShowfood();
    }
  }, [modal2]);
  const handleShowfood = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/foods/${foodId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data:', userData);

        // Đảm bảo `userData.food` tồn tại trước khi truy cập các thuộc tính
        if (userData) {
          const newFoodData = {
            calories: userData.food.calories,
            protein: userData.food.protein,
            carbs: userData.food.carbs,
            fat: userData.food.fat,
          };
          setFoodDetails(newFoodData);
        } else {
          console.error('food data is missing in the response:', userData);
        }
      } else {
        console.error('Error fetching user data:', await userResponse.json());
      }
    } catch (err) {
      console.error('Error during showing food process:', err);
    }
  };


  const handleGetcalendar = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals?date=${encodeURIComponent(date)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = await response.json();
      console.log('We have food:', userData);

      // Kiểm tra nếu dữ liệu không tồn tại
      if (!userData || !userData.food) {
        setBreakfastData([]);
        setLunchData([]);
        setDinnerData([]);
        return;
      }

      // Khởi tạo các mảng trống cho từng bữa
      const breakfastData = [];
      const lunchData = [];
      const dinnerData = [];

      // Lặp qua các mục trong mảng food và phân loại theo mealId
      userData.food.forEach(item => {
        const newFoodData = {
          key: item.food_id,
          name_food: item.name_food,
          portion: item.portion,
          size: item.size,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          mealId: item.meal_id,
        };

        // Phân loại dựa trên mealId
        if (newFoodData.mealId === 1) {
          breakfastData.push(newFoodData);
        } else if (newFoodData.mealId === 2) {
          lunchData.push(newFoodData);
        } else if (newFoodData.mealId === 3) {
          dinnerData.push(newFoodData);
        }
      });

      // Cập nhật state với các dữ liệu đã phân loại
      setBreakfastData(breakfastData);
      setLunchData(lunchData);
      setDinnerData(dinnerData);

    } catch (err) {
      console.error('Error during food addition process:', err);
    }
  };



  useEffect(() => {
    console.log("get calendar");
    handleGetcalendar(calendar);

    console.log("add new calendar for new date: ", calendar);
    handleAddcalendar(calendar);

    handleTotal(calendar);
  }, [calendar]);


  const handleAddcalendar = async (date) => {
    try {
      const token = localStorage.getItem('token');
      console.log({ 'We are running in handleAddCaledar ': date });
      const diaryresponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/diaries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });

      const userData = await diaryresponse.json();
      console.log('food details: ', userData);

    } catch (err) {
      console.error('Error during diary addition process:', err);
    }
  };


  const handleDateChange = (date) => {
    if (!date) {
      console.error("No date selected");
      return;
    }

    // Subtract one day
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() + 1);

    const formattedDate = previousDay.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    setSelectedDate(formattedDate);
    setCalendar(formattedDate); // Update the calendar state
    handleAddcalendar(formattedDate); // Pass the adjusted date to handleAddcalendar
  };

  const handleTotal = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals?date=${encodeURIComponent(date)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = await response.json();
      console.log('We are running in handleTotal', userData);

      // Initialize totals for each meal
      let breakfastTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      let lunchTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      let dinnerTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      // Loop through each food item and accumulate totals by meal type
      userData.food.forEach(item => {
        const food = {
          key: item.food_id,
          name_food: item.name_food,
          portion: item.portion,
          size: item.size,
          calories: parseFloat(item.calories) || 0,
          protein: parseFloat(item.protein) || 0,
          carbs: parseFloat(item.carbs) || 0,
          fat: parseFloat(item.fat) || 0,
          mealId: item.meal_id,
        };

        if (food.mealId === 1) {
          breakfastTotals.calories += food.calories;
          breakfastTotals.protein += food.protein;
          breakfastTotals.carbs += food.carbs;
          breakfastTotals.fat += food.fat;
        } else if (food.mealId === 2) {
          lunchTotals.calories += food.calories;
          lunchTotals.protein += food.protein;
          lunchTotals.carbs += food.carbs;
          lunchTotals.fat += food.fat;
        } else if (food.mealId === 3) {
          dinnerTotals.calories += food.calories;
          dinnerTotals.protein += food.protein;
          dinnerTotals.carbs += food.carbs;
          dinnerTotals.fat += food.fat;
        }
      });
      console.log({ breakfastTotals, lunchTotals, dinnerTotals });
      setBreakfastTotal(breakfastTotals);
      setLunchTotal(lunchTotals);
      setDinnerTotal(dinnerTotals);

    } catch (err) {
      console.error('Error during food addition process:', err);
    }
  };



  const handleEdit = async (mealId, id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const date = calendar;// Assuming `calendar` is defined elsewhere in your code
      console.log("date", date);
      console.log(`Editing food with mealId: ${mealId}, foodId: ${id}`);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals/${mealId}/foods/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, portion, size }), // Include portion and size in the body
      });

      if (response.ok) {
        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals/${mealId}/foods/${id}?date=${encodeURIComponent(date)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User data:', userData);

          // Đảm bảo `userData.food` tồn tại trước khi truy cập các thuộc tính
          if (userData && userData.food) {
            const { food_id, name_food, portion, size, calories, protein, carbs, fat, meal_id } = userData.food;

            // Update the food data within the appropriate meal array based on mealId
            const updateFoodData = (prevData) =>
              prevData.map((item) =>
                item.key === food_id
                  ? { ...item, name_food, portion, size, calories, protein, carbs, fat } // Update fields
                  : item
              );

            if (mealId === 1) {
              setBreakfastData(updateFoodData);
            } else if (mealId === 2) {
              setLunchData(updateFoodData);
            } else if (mealId === 3) {
              setDinnerData(updateFoodData);
            }
            notification.success({
              message: 'Success',
              description: 'Food updated successfully!',
            });
            setTimeout(() => setModal4(false), 500);
          }
        } else {
          console.error('Error fetching user data:', await userResponse.json());
        }
      } else {
        console.error('Error editting food:', await response.json());
      }
    } catch (err) {
      console.error('Error during food addition process:', err);
    }
  };

  const handleDelete = async (mealId, id) => {
    const token = localStorage.getItem('token');
    try {
      const date = calendar;
      console.log("date", date)
      console.log(`Deleting food with mealId: ${mealId}, foodId: ${id}`); // Chú ý ở đây, `id` nên là `record.key`
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/meals/${mealId}/foods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to delete food from meal');
      }
      // Update the UI by removing the item with the matching foodId from the correct state array.
      if (mealId == 1) {
        setBreakfastData((prevData) => prevData.filter((item) => item.key != id));
      } else if (mealId == 2) {
        setLunchData((prevData) => prevData.filter((item) => item.key != id));
      } else if (mealId == 3) {
        setDinnerData((prevData) => prevData.filter((item) => item.key != id));
      }
      // Show a success notification.
      notification.success({
        message: 'Success',
        description: 'Food deleted successfully!',
      });
    } catch (error) {
      // Show an error notification.
      notification.error({
        message: 'Error',
        description: error.message || 'An error occurred while deleting the food.',
      });
    }
  };

  // const calculateTotals = (data) => {
  //   const total = data.reduce(
  //     (acc, meal) => {
  //       acc.calories += parseFloat(meal.calories) || 0;  // Ensure it's treated as a number
  //       acc.protein += parseFloat(meal.protein) || 0;      // Ensure it's treated as a number
  //       acc.carbs += parseFloat(meal.carbs) || 0;          // Ensure it's treated as a number
  //       acc.fat += parseFloat(meal.fat) || 0;              // Ensure it's treated as a number
  //       return acc;
  //     },
  //     { calories: 0, protein: 0, carbs: 0, fat: 0 }
  //   );
  //   return total;
  // };

  // const breakfastTotal = calculateTotals(breakfastData);
  // const lunchTotal = calculateTotals(lunchData);
  // const dinnerTotal = calculateTotals(dinnerData);

  const columns = [
    { title: 'Name', dataIndex: 'name_food', key: 'name_food' },
    { title: 'Portion', dataIndex: 'portion', key: 'portion' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Calories', dataIndex: 'calories', key: 'calories' },
    { title: 'Protein (g)', dataIndex: 'protein', key: 'protein' },
    { title: 'Carbs (g)', dataIndex: 'carbs', key: 'carbs' },
    { title: 'Fat (g)', dataIndex: 'fat', key: 'fat' },
    {
      title: '',
      key: 'actions',
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <img
            src={editIcon}
            alt="Edit"
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            onClick={() => {
              setSelectedRecord(record); // Set selected record
              toggleModal4(); // Open modal
            }}
          />
          <img
            src={deleteIcon}
            alt="Delete"
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            onClick={() => handleDeleteAndTotal(record.mealId, record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <div className="logo">Nutritioners</div>
        <Menu mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            <Link to="/my-meal">My Meal</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/my-report">My Report</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: '16px 24px', backgroundColor: '#F2F5FD' }}>
          <div className='mymeal'>
            <h1 className="meal-title">My Meal</h1>
            <div className='control'>
              <DatePicker onChange={handleDateChange} />
              {/* onChange={handleCalendarChange} */} 
              <Button onClick={toggleModal} className='btn-modal' classtype="primary" Open>+ Add new food</Button>
              {/* Modal1 */}
              {modal && (<div className='modal'>
                <div onClick={toggleModal} className="overlay"></div>
                <div className='modal-content'>
                  <h2 className='food-title'>Choose your food</h2>
                  <div className='food-container'>
                    <span>Phở bò</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="1" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Bún chả</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="2" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Cơm tấm</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="3" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Bánh mì</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="4" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Gỏi cuốn</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="5" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Chả giò</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="6" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Bánh xèo</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="7" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Bún bò Huế</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="8" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Mì Quảng</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="9" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <div className='food-container'>
                    <span>Xôi gà</span>
                    <button onClick={(event) => handleChooseButtonClick(event)} data-value="10" className='choose-button' classtype="primary">Choose</button>
                  </div>
                  <Button className='close-button'
                    onClick={toggleModal} >X</Button>
                </div>
              </div>)}
              {/* Modal2 */}
              {modal2 && (<div className='modal2'>
                <div onClick={toggleModal2} className="overlay"></div>
                <div className='modal-content2'>
                  <h2>Food details</h2>
                  <div className="information">
                    <span className="kcal-info">
                      Calories: {foodDetails ? foodDetails.calories : 0}
                    </span>
                    <span className="pro-info">
                      Protein: {foodDetails ? foodDetails.protein : 0}
                    </span>
                    <span className="ca-info">
                      Carbs: {foodDetails ? foodDetails.carbs : 0}
                    </span>
                    <span className="fat-info">
                      Fat: {foodDetails ? foodDetails.fat : 0}
                    </span>
                  </div>

                  <div className='serving-size'>
                    <span>Serving size</span>
                    <div className='portion_size'>
                      <input type="number" id="number-input" name="number-input" min="1" max="50" onChange={(event) => handleNumberInputChange(event)} />
                      <select onChange={(event) => handleServingSizeChange(event)}>
                        <option value="135">large - 135g</option>
                        <option value="100">small - 100g</option>
                        <option value="50">cup</option>
                      </select>
                    </div>
                  </div>
                  <div className='meal-option'>
                    <span>Meal</span>
                    <select onChange={(event) => handleMealChange(event)}>
                      <option value="1">Breakfast</option>
                      <option value="2">Lunch</option>
                      <option value="3">Dinner</option>
                    </select>
                  </div>

                  <Button onClick={handleAddFoodAndTotal} className='add-button' classtype="primary">Add to meal</Button>
                  <Button className='close-button' classtype="secondary"
                    onClick={toggleModal3} >X</Button>
                </div>
              </div>)}
              {/* Modal4 */}
              {modal4 && (<div className='modal2'>
                <div onClick={toggleModal4} className="overlay"></div>
                <div className='modal-content2'>
                  <h2>Food details</h2>
                  <div class="information">
                    <span className='kcal-info' > calories</span>
                    <span className='pro-info'> protein</span>
                    <span className='ca-info'> carbs</span>
                    <span className='fat-info'> fat</span>
                  </div>
                  <div className='serving-size'>
                    <span>Serving size</span>
                    <div className='portion_size'>
                      <input type="number" id="number-input" name="number-input" min="1" max="50" onChange={(event) => handleNumberInputChange(event)} />
                      <select onChange={(event) => handleServingSizeChange(event)}>
                        <option value="135">large - 135g</option>
                        <option value="100">small - 100g</option>
                        <option value="50">cup</option>
                      </select>
                    </div>
                  </div>
                  <div className='meal-option'>
                    <span>Meal</span>
                    <select onChange={(event) => handleMealChange(event)}>
                      <option value="1">Breakfast</option>
                      <option value="2">Lunch</option>
                      <option value="3">Dinner</option>
                    </select>
                  </div>
                  <div className='control_modal4'>
                    <Button className='cancel-button' onClick={toggleModal4} ><span >Discard</span></Button>
                    <Button onClick={() => handleEditAndTotal(selectedRecord?.mealId, selectedRecord?.key)} className='save-button' classtype="primary">Save</Button>
                  </div>
                  <Button className='close-button' onClick={toggleModal4} >X</Button>
                </div>
              </div>)}

            </div>
            {/* Breakfast Section */}
            <div className='breakfast-header'>
              <h2 className="breakfast-title">Breakfast</h2>
              {<div className='total'>
                <span className='kcal-total'> {breakfastTotal && breakfastTotal.calories !== undefined
                  ? breakfastTotal.calories.toFixed(2)
                  : '0.00'} Calories</span>
                <span className='pro-total'> {breakfastTotal && breakfastTotal.protein !== undefined
                  ? breakfastTotal.protein.toFixed(2)
                  : '0.00'} Protein (g)</span>
                <span className='ca-total'> {breakfastTotal && breakfastTotal.carbs !== undefined
                  ? breakfastTotal.carbs.toFixed(2)
                  : '0.00'} Carbs (g)</span>
                <span className='fat-total'> {breakfastTotal && breakfastTotal.fat !== undefined
                  ? breakfastTotal.fat.toFixed(2)
                  : '0.00'} Fat (g)</span>
              </div>}
            </div>
            <div className='table'>
              <Table columns={columns} dataSource={breakfastData} pagination={false} />
            </div>

            {/* Lunch Section */}
            <div className='lunch-header'>
              <h2 className="lunch-title">Lunch</h2>
              {<div className='total'>
                <span className='kcal-total'> {lunchTotal && lunchTotal.calories !== undefined
                  ? lunchTotal.calories.toFixed(2)
                  : '0.00'} Calories</span>
                <span className='pro-total'> {lunchTotal && lunchTotal.protein !== undefined
                  ? lunchTotal.protein.toFixed(2)
                  : '0.00'} Protein (g)</span>
                <span className='ca-total'> {lunchTotal && lunchTotal.carbs !== undefined
                  ? lunchTotal.carbs.toFixed(2)
                  : '0.00'} Carbs (g)</span>
                <span className='fat-total'> {lunchTotal && lunchTotal.fat !== undefined
                  ? lunchTotal.fat.toFixed(2)
                  : '0.00'} Fat (g)</span>
              </div>}
            </div>
            <div className='table'>
              <Table columns={columns} dataSource={lunchData} pagination={false} />
            </div>

            {/* Dinner Section */}
            <div className='dinner-header'>
              <h2 className="dinner-title">Dinner</h2>
              {<div className='total'>
                <span className='kcal-total'> {dinnerTotal && dinnerTotal.calories !== undefined
                  ? dinnerTotal.calories.toFixed(2)
                  : '0.00'} Calories</span>
                <span className='pro-total'> {dinnerTotal && dinnerTotal.protein !== undefined
                  ? dinnerTotal.protein.toFixed(2)
                  : '0.00'} Protein (g)</span>
                <span className='ca-total'> {dinnerTotal && dinnerTotal.carbs !== undefined
                  ? dinnerTotal.carbs.toFixed(2)
                  : '0.00'} Carbs (g)</span>
                <span className='fat-total'>{dinnerTotal && dinnerTotal.fat !== undefined
                  ? dinnerTotal.fat.toFixed(2)
                  : '0.00'} Fat (g)</span>
              </div>}
            </div>
            <div className='table'>
              <Table columns={columns} dataSource={dinnerData} pagination={false} />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MyMeal;
