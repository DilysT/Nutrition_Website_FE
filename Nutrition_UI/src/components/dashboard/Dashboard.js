import React, { useEffect, useState, useContext } from 'react';
import { Progress, Card, Row, Col, Typography } from 'antd';
import '../../styles/Dashboard.css';
import { DateContext } from './DateContext'; // Import DateContext
const { Title } = Typography;

const Dashboard = () => {
  const [diaryData, setDiaryData] = useState(null);
  const { selectedDate } = useContext(DateContext); // Lấy giá trị ngày từ DateContext

  // Hàm xác định màu sắc cho số liệu
  const getNumberColor = (value) => {
    const validValue = parseFloat(value);
    return validValue < 0 ? 'red' : 'green';  // Nếu số âm thì màu đỏ, số dương thì màu xanh lá
  };

  // Hàm trả về giá trị hợp lệ, nếu không sẽ trả về 0
  const getValidNumber = (value) => {
    return isNaN(value) || value === null || value === undefined ? 0 : parseFloat(value);
  };

  // Hàm tính phần trăm
  const calculatePercentage = (consumed, remaining) => {
    const validConsumed = getValidNumber(consumed);
    const validRemaining = getValidNumber(remaining);
    const total = validConsumed + validRemaining;
    return total === 0 ? 0 : (validConsumed / total) * 100;
  };

  // Hàm lấy dữ liệu từ API
  const getDashboardData = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/diaries/meals?date=${encodeURIComponent(date)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dữ liệu nhận từ API:', data);
        setDiaryData(data.diary);
      } else {
        console.error('Lỗi khi lấy dữ liệu:', await response.json());
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  // Gọi API khi component được render lần đầu hoặc khi selectedDate thay đổi
  useEffect(() => {
    const date = selectedDate || new Date().toISOString().split('T')[0]; // Sử dụng ngày từ context hoặc ngày hiện tại
    getDashboardData(date);
  }, [selectedDate]);

  // Nếu chưa có dữ liệu thì hiển thị loading
  if (!diaryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Title for Energy Summary */}
      <Title level={2} className="section-title">
        Energy Summary
      </Title>

      {/* Energy Summary Section */}
      <Row gutter={[16, 16]} className="energy-summary">
        <Col xs={24} sm={12}>
          <Card className="energy-card" bordered={false}>
            <div className="progress-container1">
              <Progress
                type="circle"
                percent={(getValidNumber(diaryData.calories_consumed) / (getValidNumber(diaryData.calories_consumed) + getValidNumber(diaryData.calories_remaining))) * 100}
                strokeColor="#0072FD"
                strokeWidth={12}
                format={() => (
                  <div style={{ fontSize: '16px', lineHeight: '1' }}>
                    <strong style={{ display: 'block', fontSize: '30px', fontWeight: '600', color: getNumberColor(diaryData.calories_consumed) }}>
                      {getValidNumber(diaryData.calories_consumed)}
                    </strong>
                    <span style={{ fontSize: '24px', color: '#989BA6' }}>kcal</span>
                  </div>
                )}
                width={150}
              />
              <p>Calorie Consumed</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="energy-card" bordered={false}>
            <div className="progress-container1">
              <Progress
                type="circle"
                percent={(getValidNumber(diaryData.calories_remaining) / (getValidNumber(diaryData.calories_consumed) + getValidNumber(diaryData.calories_remaining))) * 100}
                strokeColor="#00C0FD"
                strokeWidth={12}
                format={() => (
                  <div style={{ fontSize: '16px', lineHeight: '1' }}>
                    <strong style={{ display: 'block', fontSize: '30px', fontWeight: '600', color: getNumberColor(diaryData.calories_remaining) }}>
                      {getValidNumber(diaryData.calories_remaining)}
                    </strong>
                    <span style={{ fontSize: '24px', color: '#989BA6' }}>kcal</span>
                  </div>
                )}
                width={150}
              />
              <p>Calorie Remaining</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Title for Macro Targets */}
      <Title level={2} className="section-title1">
        Macro Targets
      </Title>

      {/* Macro Targets Section */}
      <Row gutter={[16, 16]} className="macro-targets">
        <Col xs={24} sm={8}>
          <Card className="macro-card" bordered={false}>
            <div className="progress-container">
              <div className="progress-info">
                <p style={{ color: getNumberColor(diaryData.protein_remaining) }}>
                  {getValidNumber(diaryData.protein_consumed)}/{getValidNumber(diaryData.protein_consumed) + getValidNumber(diaryData.protein_remaining)} (g)
                </p>
                <p>Protein</p>
              </div>
              <Progress
                type="circle"
                percent={calculatePercentage(diaryData.protein_consumed, diaryData.protein_remaining)}
                strokeColor="#1F263E"
                strokeWidth={10}
                format={(percent) => `${Math.round(percent)}%`}
                width={70}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="macro-card" bordered={false}>
            <div className="progress-container">
              <div className="progress-info">
                <p style={{ color: getNumberColor(diaryData.carbs_remaining) }}>
                  {getValidNumber(diaryData.carbs_consumed)}/{getValidNumber(diaryData.carbs_consumed) + getValidNumber(diaryData.carbs_remaining)} (g)
                </p>
                <p>Net Carb</p>
              </div>
              <Progress
                type="circle"
                percent={calculatePercentage(diaryData.carbs_consumed, diaryData.carbs_remaining)}
                strokeColor="#1F263E"
                strokeWidth={10}
                format={(percent) => `${Math.round(percent)}%`}
                width={70}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="macro-card" bordered={false}>
            <div className="progress-container">
              <div className="progress-info">
                <p style={{ color: getNumberColor(diaryData.fat_remaining) }}>
                  {getValidNumber(diaryData.fat_consumed)}/{getValidNumber(diaryData.fat_consumed) + getValidNumber(diaryData.fat_remaining)} (g)
                </p>
                <p>Fat</p>
              </div>
              <Progress
                type="circle"
                percent={calculatePercentage(diaryData.fat_consumed, diaryData.fat_remaining)}
                strokeColor="#1F263E"
                strokeWidth={10}
                format={(percent) => `${Math.round(percent)}%`}
                width={70}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
