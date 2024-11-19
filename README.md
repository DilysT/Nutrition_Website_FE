# 📱 **Nutritioners: Nutrition Tracking Website**

## 1️⃣ **Project Description**

**Nutritioners** is a user-friendly web application designed to help users monitor their nutrition intake and track progress towards their weight goals. Built using **ReactJS**, the app offers tools for effective meal management, calorie tracking, and personalized meal suggestions.

The project consists of three main components:

- **Onboard** (Registration)
- **Authentication** (Login)
- **Dashboard** (Main Interface)

---

## 2️⃣ **Table of Contents**

1. [Project Description](#1️⃣-project-description)
2. [Table of Contents](#2️⃣-table-of-contents)
3. [Features](#3️⃣-features)
4. [Installation](#4️⃣-installation)
5. [How to Run the Project](#5️⃣-how-to-run-the-project)
6. [Usage Guide](#6️⃣-usage-guide)
7. [License](#7️⃣-license)

---

## 3️⃣ **Features**

### **Onboard (Registration)**
- User registration includes providing:
  - **Height**, **Weight**, **Birth Date**, and **Fitness Goals** (e.g., weight gain or weight loss).
- Calculates the expected timeline for achieving the user’s defined goals.
- Stores user data for personalized tracking and meal suggestions.

### **Authentication (Login)**
- Allows users to log in with their registered account.
- Supports **Forgot Password** feature for resetting the password via email.

### **Dashboard**
- **Main Dashboard**:
  - Displays key nutrition metrics, including **daily calorie intake**, **remaining calories**, and macro breakdown (e.g., fat, carbs, protein).
  - Visualized using **interactive charts** for better understanding.
- **MyMeal**:
  - Users can plan daily meals from a predefined list of dishes.
  - Helps control calorie intake based on user-selected meals.
- **Settings**:
  - Enables users to update their personal information, such as weight, height, and fitness goals.

---

## 4️⃣ **Installation**

To get started with the project, clone the repository and install the required dependencies:

# Clone this repository
git clone (https://github.com/DilysT/Nutrition_Website_FE)

# Navigate to the project directory
cd Nutrition_UI

# Install required packages
npm install
npm install moment
npm install antd
## 5️⃣ **How to Run the Project**

You have two options for running the project:

### **Option 1: Frontend Only**

1. Open the `App.js` file and **clear out the authentication check**. This will allow you to access the Dashboard directly without logging in.
   
3. Start the application using the command below:
   npm start
   
5. Open http://localhost:3000 in your web browser to view the app.

### **Option 2: Full Project with Backend**
1. Clone the backend with the same name in my repository and follow its setup instructions.
   
2. Set up a MySQL database, then update the database connection settings in the backend project.

3. Run both the frontend and backend projects with the following commands:
   
# Start the Backend first
npm start

# Start the Frontend 
npm run 

- Access the app at http://localhost:3001 to use the full functionality, including user registration and login.

## 6️⃣ **Usage Guide**

This section provides a detailed guide on how to use the key features of the Nutritioners app.

### **Onboard Page** 📝

- The Onboard page is where users register their account and input essential personal details.
- Users need to fill in information such as:
  - **Height** (in cm)
  - **Weight** (in kg)
  - **Birth Date**
  - **Fitness Goal** (Weight Gain, Weight Loss, or Maintenance)
- Once the information is submitted, the system automatically calculates and generates:
  - An estimated **timeline** for achieving the set goal based on the user's inputs.
  - Personalized suggestions for nutrition and calorie intake.
- All the collected data is stored securely for personalized tracking and meal recommendations.

### **Login Page (Authentication)** 🔐

- Users can log in using their registered **email** and **password**.
- If a user forgets their password, the app provides a **Forgot Password** feature:
  - Users can reset their password via a secure link sent to their registered email.
- Upon successful login, users are redirected to the main Dashboard.

### **Dashboard** 📊

- The Dashboard is the main interface where users can track their daily nutrition metrics. Key features include:
  - **Daily Calorie Tracking**: Displays the total calories consumed and the remaining calories based on the user's goal.
  - **Macro Breakdown**: Shows a detailed breakdown of daily intake for **fat**, **carbs**, and **protein**.
  - Interactive **charts and graphs** provide a visual representation of the user's progress.

### **MyMeal Page** 🍽️

- The MyMeal page helps users plan their meals effectively by selecting dishes from a predefined list.
- Users can create a daily menu for:
  - **Breakfast**
  - **Lunch**
  - **Dinner**
- Each dish is displayed with its corresponding **calorie count**, making it easier for users to control their intake.
- The planned menu helps users meet their calorie goals and maintain a balanced diet.

### **Settings Page** ⚙️

- The Settings page allows users to update their profile information, including:
  - **Height**
  - **Weight**
  - **Fitness Goals**
- Users can make adjustments to their data as their preferences or goals change over time.
- The updated information is used to recalibrate the personalized meal recommendations and timeline for achieving goals.
  
---

### 📌 **Additional Notes**

- For demo purposes, you can bypass the authentication step by commenting out the login check in the `App.js` file. This allows direct access to the Dashboard without logging in.
- The backend project, including API endpoints and database configurations, is located in a separate repository. Please contact me if you need further guidance on setting up the backend or integrating it with this front-end project.
- Feel free to reach out if you encounter any issues or have questions regarding the project setup and usage.

---

### 💬 **Contact Information**

If you have any questions or feedback, don't hesitate to get in touch with me at:

- **Email**: Thienngo21122003@gmail.com
- **GitHub**: [DilysT][(https://github.com/DilysT)]

Thank you for checking out my project! 🚀
