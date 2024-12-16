import React, {createContext, useState} from 'react';

const DataContext = createContext();

export const DataProvider = ({children}) => {
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState('freakingcoding404@gmail.com');
  const [selectedParking, setSelectedParking] = useState(null); //get leer / set escribir

  return (
    <DataContext.Provider
      value={{
        userData,
        setUserData,
        email,
        setEmail,
        selectedParking,
        setSelectedParking,
      }}>
      {children}
    </DataContext.Provider>
  );
};
export const useData = () => React.useContext(DataContext);
