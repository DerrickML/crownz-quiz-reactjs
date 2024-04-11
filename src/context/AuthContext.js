// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import moment from 'moment';
import {
    account,
    databases,
    database_id,
    studentTable_id,
    pointsTable_id,
    Query,
} from "../appwriteConfig.js";
import storageUtil from '../utilities/storageUtil.js';
import { studentSubjectsData } from "../utilities/fetchStudentData";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [sessionInfo, setSessionInfo] = useState(storageUtil.getItem("sessionInfo"));
    const [userInfo, setUserInfo] = useState(storageUtil.getItem("userInfo"));
    const [userPoints, setUserPoints] = useState(storageUtil.getItem("userPoints") || 0);
    const [userSubjectData, setUserSubjectData] = useState(storageUtil.getItem("userSubjectData") || [])

    //LOGOUT FUNCTION

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
        setUserPoints('');
        storageUtil.removeItem("userPoints");
    };

    //LOGIN FUNCTION
    const handleLogin = async (sessionData, userData) => {
        const sessionDetails = {
            $id: sessionData.$id,
            userId: sessionData.userId,
            expire: sessionData.expire,
            authMethod: sessionData.provider,
        };
        setSessionInfo(sessionDetails);
        storageUtil.setItem("sessionInfo", sessionDetails);

        // userData.labels.includes("student") ? console.log('Student subjects: ' + userData.subjects) : console.log('Next of Kin');
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
            subjects: userData.subjects,
            labels: userData.labels,
            kinID: userData.kinID,
            kinFirstName: userData.kinFirstName,
            kinLastName: userData.kinLastName,
            kinEmail: userData.kinEmail,
            kinPhone: userData.kinPhone,
        };

        setUserInfo(userDetails);
        storageUtil.setItem("userInfo", userDetails);

        if (userDetails.labels.includes("student")) {

            //Setting up subjects data
            await updateUserSubjectData(userDetails.subjects, userDetails.educationLevel);

            // Fetch userPoints from the database after login
            await fetchUserPoints(userDetails.userId, userDetails.educationLevel);

        }

    };

    // Update userPoints in local storage and database
    const updateUserPoints = async (PointsToDeduct, userId) => {
        // Update points in the database and then in the context and storage
        await saveUserPointsToDatabase(PointsToDeduct, userId);
    };

    // Fetch userPoints function (example)
    const fetchUserPoints = async (userId, educationLevel) => {
        try {
            // console.log('Fetching userPoints: ', userId + ' ' + educationLevel);
            let pointsData
            const pointsResponse = await databases.listDocuments(database_id, pointsTable_id, [Query.equal('UserID', userId)])
            //Create a new document if user has no document assigned
            if (pointsResponse.documents.length !== 0) {
                pointsData = pointsResponse.documents[0].PointsBalance
            }
            else {
                // console.log('No user document assigned, creating a new one for the user')

                var currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');

                // console.log('CURRENT DATE: ' + currentDateTime)

                let docId = `PT-${userId}`
                // console.log('Unique ID: ', docId)

                const userDocResponse = await databases.createDocument(
                    database_id,
                    pointsTable_id,
                    'unique()',
                    {
                        UserID: JSON.stringify(userId) || null,
                        PurchasedTier: educationLevel,
                        AcquisitionDate: currentDateTime,
                        ExpiryDate: currentDateTime,
                    }
                );
                pointsData = 0
            }

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
            // console.log('Checking points table: ', response)
            if (response.documents.length > 0) { //TODO: If table user points doesn't exist, create new document
                const documentId = response.documents[0].$id //Points document id to be updated
                let currentPoints = response.documents[0].PointsBalance
                updatedPoints = currentPoints - points
                if (updatedPoints >= 0) {
                    // console.log('points document id: ', documentId)

                    //update Points table
                    const updateResponse = await databases.updateDocument(database_id, pointsTable_id, documentId, { PointsBalance: updatedPoints })
                    // console.log('update points balance: ', updateResponse)

                    // Update points in context and localStorage
                    setUserPoints(updatedPoints);
                    storageUtil.setItem("userPoints", updatedPoints);
                }
            }

        } catch (error) {
            console.error("Error updating user points:", error);
        }
    };

    /**
     * Formats the date string into a more readable format.
     * @param {string} userDocId - Document id string.
     * @param {string} subject - Subject string passed.
     * @returns {string || null} - return sting or nothing.
     */
    const studentEnrollSubject = async (userDocId, subject) => {
        // console.log("Student Enroll Subject: ", subject);
        // console.log("Student DocuID: ", userDocId)
        // if (!subject) {
        //     console.log('Subject is required');
        //     return
        // }

        databases.getDocument(database_id, studentTable_id, userDocId)
            .then(document => {
                const updatedArray = [...document.subjects, subject];

                return databases.updateDocument(database_id, studentTable_id, userDocId, {
                    subjects: updatedArray
                });
            })
            .then(updatedDocument => {
                // console.log('Enrolled Subject Item appended successfully: ', updatedDocument.subjects);
                updateUserSubjectData(updatedDocument.subjects, updatedDocument.educationLevel) //Update user subject data on localStorage
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    //Update user subject data on localStorage
    const updateUserSubjectData = async (subjectsData, educationLevel) => {
        try {
            let enrolledSubjectsData = subjectsData || [];
            const response = await studentSubjectsData(enrolledSubjectsData, educationLevel)
            setUserSubjectData(response)
            storageUtil.setItem("userSubjectData", response);

        } catch (error) {
            // console.log('Subjects Data Error: ', error);
        };
    }

    return (
        <AuthContext.Provider value={{
            sessionInfo,
            userInfo,
            userPoints,
            userSubjectData,
            handleLogin,
            handleLogout,
            fetchUserPoints,
            updateUserPoints,
            studentEnrollSubject,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
