import React, { createContext, useState, useEffect } from 'react';

export const ToastContext = createContext();

const ToastContextProvider = ({ children }) => {
    const defaultValue = { active: false, type: 'info', message: '' };
    const [toast, setToast] = useState(defaultValue);

    useEffect(() => {
        if (toast.active) {
            setTimeout(() => {
                setToast(prevValue => ({ ...prevValue, active: false }));
            }, 2000);
        }
    }, [toast.active]);

    return (
        <ToastContext.Provider value={{ toast, setToast }}>
            {children}
        </ToastContext.Provider>
    )
};

export default ToastContextProvider;
