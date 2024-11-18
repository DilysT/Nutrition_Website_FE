import React, { useState } from 'react';
import Header from './components/dashboard/Header';
import SideBar from './components/dashboard/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Onboard from './components/onboarding/Onboard';
import MyMeal from './components/dashboard/MyMeal';
import Setting from './components/dashboard/Setting';
import Authentication from './components/authentication/Authentication';
import Resetpw from './components/authentication/Resetpw';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { DateProvider } from './components/dashboard/DateContext';
import { UserProvider } from './components/dashboard/UserContext';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [isResetpwComplete, setIsResetpwComplete] = useState(false);

    const completeResetpw = () => {
        setIsResetpwComplete(true);
    };

    const completeAuthentication = () => {
        setIsAuthenticated(true);
    };

    const completeOnboarding = () => {
        setIsOnboardingComplete(true);
    };

    return (
        <Router>
            <div className="app">
                <UserProvider>
                    <Routes>
                        <Route 
                            path="/authentication" 
                            element={<Authentication onComplete={completeAuthentication} />} 
                        />
                        <Route
                            path="/resetpw"
                            element={<Resetpw onComplete={completeResetpw} />}
                        />
                        <Route 
                            path="/onboard" 
                            element={<Onboard onComplete={completeOnboarding} />} 
                        />
                        <Route 
                            path="/" 
                            element={
                                !isOnboardingComplete ? (
                                    <Navigate to="/onboard" />
                                ) : !isAuthenticated ? (
                                    <Navigate to="/authentication" />
                                ) : (
                                    <Navigate to="/dashboard" />
                                )
                            } 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                isAuthenticated ? (
                                    <>
                                        <SideBar />
                                        <Header />
                                        <DateProvider>
                                            <Dashboard />
                                        </DateProvider>
                                    </>
                                ) : (
                                    <Navigate to="/authentication" />
                                )
                            }
                        />
                        <Route 
                            path="/my-meal" 
                            element={
                                isAuthenticated ? (
                                    <>
                                        <SideBar />
                                        <Header />
                                        <DateProvider>
                                            <MyMeal />
                                        </DateProvider>
                                    </>
                                ) : (
                                    <Navigate to="/authentication" />
                                )
                            } 
                        />
                        <Route 
                            path="/settings" 
                            element={
                                isAuthenticated ? (
                                    <>
                                        <SideBar />
                                        <Header />
                                        <Setting />
                                    </>
                                ) : (
                                    <Navigate to="/authentication" />
                                )
                            } 
                        />
                    </Routes>
                </UserProvider>
            </div>
        </Router>
    );
};

export default App;
