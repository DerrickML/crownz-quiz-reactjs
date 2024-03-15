// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    client,
    account,
    databases,
    database_id,
    studentTable_id,
    nextOfKinTable_id,
    studentMarksTable_id,
    sstTablePLE_id,
    couponTable_id,
    transactionTable_id,
    pointsTable_id,
    pointsBatchTable_id,
    Permission,
    Role,
    Query,
} from "../appwriteConfig.js";
import storageUtil from '../utilities/storageUtil.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [sessionInfo, setSessionInfo] = useState(storageUtil.getItem("sessionInfo"));
    const [userInfo, setUserInfo] = useState(storageUtil.getItem("userInfo"));
    const [userPoints, setUserPoints] = useState(storageUtil.getItem("userPoints") || 0);

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

        // Fetch userPoints from the database after login
        // This is an example, replace it with your actual API call
        const pointsData = await fetchUserPoints(userData.userId, userData.educationLevel);
        setUserPoints(pointsData);
        storageUtil.setItem("userPoints", pointsData);
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

        // Clear userPoints from context and storage
        setUserPoints(0);
        storageUtil.removeItem("userPoints");
    };

    // Update userPoints in local storage and database
    const updateUserPoints = async (PointsToDeduct, userId) => {
        // Update points in the database and then in the context and storage
        await saveUserPointsToDatabase(PointsToDeduct, userId);
    };

    // Fetch userPoints function (example)
    const fetchUserPoints = async (userId, educationLevel) => {
        try {
            let pointsData
            const pointsResponse = await databases.listDocuments(database_id, pointsTable_id, [Query.equal('UserID', userId)])
            //Create a new document if user has no document assigned
            if (pointsResponse.documents.length === 0) {
                console.log('No user document assigned, creating a new one for the user')
                const userDocResponse = await databases.createDocument(
                    database_id,
                    pointsTable_id,
                    "unique()",
                    {
                        UserID: userId || null,
                        PurchasedTier: educationLevel,
                        AcquisitionDate: new Date().toLocaleString(),
                        ExpiryDate: new Date().toLocaleString(),
                    }
                );
                pointsData = 0
            }

            pointsData = pointsResponse.documents[0].PointsBalance


            setUserPoints(pointsData);
            storageUtil.setItem("userPoints", pointsData);
        } catch (error) {
            console.error("Error fetching user points:", error);
        }
    };

    // Save userPoints function (example)
    const saveUserPointsToDatabase = async (points, userId) => {
        // Update points in the database
        try {
            let updatedPoints
            const response = await databases.listDocuments(database_id, pointsTable_id, [
                Query.equal("UserID", userId),
            ]);
            console.log('Checking points table: ', response)
            if (response.documents.length > 0) { //TODO: If table user points doesn't exist, create new document
                const documentId = response.documents[0].$id //Points document id to be updated
                let currentPoints = response.documents[0].PointsBalance
                updatedPoints = currentPoints - points
                console.log('points document id: ', documentId)

                //update Points table
                const updateResponse = await databases.updateDocument(database_id, pointsTable_id, documentId, { PointsBalance: updatedPoints })
                console.log('update points balance: ', updateResponse)

                // Update points in context and localStorage
                setUserPoints(updatedPoints);
                storageUtil.setItem("userPoints", updatedPoints);
            }

            return updatedPoints;

        } catch (error) {
            console.error("Error updating user points:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            sessionInfo,
            userInfo,
            userPoints,
            handleLogin,
            handleLogout,
            fetchUserPoints,
            updateUserPoints,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
