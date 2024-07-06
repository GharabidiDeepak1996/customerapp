// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationData, setNotificationData] = useState(null);

    const setNotification = (data) => {
        setNotificationData(data);
    };

    return (
        <NotificationContext.Provider value={{ notificationData, setNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};
