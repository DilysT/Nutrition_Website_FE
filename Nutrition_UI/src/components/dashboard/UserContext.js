import React, { createContext, useState } from 'react';

// Tạo context
export const UserContext = createContext();

// Tạo provider
export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState('');

    return (
        <UserContext.Provider value={{ userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};
