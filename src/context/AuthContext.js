// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { account } from "../appwriteConfig.js";
import storageUtil from '../utilities/storageUtil.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [sessionInfo, setSessionInfo] = useState(() => {
        // Get the session info from storage or return null
        return storageUtil.getItem("sessionInfo");
    });

    const [userInfo, setUserInfo] = useState(() => {
        // Get the user info from storage or return null
        return storageUtil.getItem("userInfo");
    });

    const handleLogin = async (sessionData, userData) => {
        const sessionDetails = {
            $id: sessionData.$id,
            userId: sessionData.userId,
            expire: sessionData.expire,
            authMethod: sessionData.provider,
        };
        setSessionInfo(sessionDetails);
        storageUtil.setItem("sessionInfo", sessionDetails);

        const userDetails = {
            userId: sessionData.userId,
            userDocId: userData.userDocId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            otherName: userData.otherName,
            phone: userData.phone,
            email: userData.email,
            gender: userData.gender,
            schoolName: userData.schoolName,
            schoolAddress: userData.schoolAddress,
            educationLevel: userData.educationLevel,
            labels: userData.labels,
            kinID: userData.kinID,
            kinFirstName: userData.kinFirstName,
            kinLastName: userData.kinLastName,
            kinEmail: userData.kinEmail,
            kinPhone: userData.kinPhone,
        };

        setUserInfo(userDetails);
        storageUtil.setItem("userInfo", userDetails);
    };

    const handleLogout = async () => {
        if (sessionInfo && sessionInfo.$id) {
            try {
                await account.deleteSession(sessionInfo.$id); //Clears the session on Client's and Appwrite's side
            } catch (error) {
                console.error("Logout failed", error);
            }
        } else {
            console.error("No session to logout");
        }

        setSessionInfo(null);
        setUserInfo(null);
        storageUtil.clear();
    };

    return (
        <AuthContext.Provider value={{ sessionInfo, userInfo, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
