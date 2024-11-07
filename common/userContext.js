import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../common/firebase.js';

const UserContext = createContext();

export const UserProvider = ({ email, children }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await db.collection('users').doc(email).get();
                if (userDoc.exists) {
                    setUserData({ email, ...userDoc.data() });
                } else {
                    console.log('No such user found in Firestore');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (email) {
            fetchUserData();
        }
    }, [email]);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
