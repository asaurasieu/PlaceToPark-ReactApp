import React, { createContext, useState } from 'react';


const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState('freakingcoding404@gmail.com');


    return (
        <DataContext.Provider value={{ userData, setUserData, email, setEmail }}>
            {children}
        </DataContext.Provider>
    );
};
export const useData = () => React.useContext(DataContext);
