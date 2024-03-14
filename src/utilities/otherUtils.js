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

export const sendEmailToNextOfKin = async (userInfo, subjectName, examScore, examDateTime) => {
    const studentName = `${userInfo.firstName} ${userInfo.lastName}${userInfo.otherName ? ` ${userInfo.otherName}` : ''}`;
    const educationLevel = userInfo.educationLevel;
    const kinNames = `${userInfo.kinFirstName} ${userInfo.kinLastName}`;
    const kinEmail = userInfo.kinEmail;

    // Send the information to the backend
    fetch('https://2wkvf7-3000.csb.app/alert-next-of-kin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studentName,
            educationLevel,
            kinNames,
            kinEmail,
            subjectName,
            examScore,
            examDateTime,
        }),
    })
        .then(response => {
            // Handle the response from the backend
            // ...
        })
        .catch(error => {
            // Handle any errors
            // ...
        });
};

export const updateLabels = async (userId, labels) => {
    const paylaod = {
        userId: userId,
        labels: labels,
    };
    // Send the information to the backend
    fetch('https://2wkvf7-3000.csb.app/update-labels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paylaod),
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
* Formats the date string into a more readable format.
* @param {string} dateTime - The original date-time string.
* @returns {string} - The formatted date-time string.
*/
export const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleString("en-US", {
        dateStyle: "long",
    })} ${date.toLocaleTimeString()}`;
};

/**
* APPWRITE FUNCTIONS
*/

/*** Create a document ***/
export const createDocument = async (databaseId, tableId, uniqueId, data, tableUse) => {
    try {
        const response = await databases.createDocument(databaseId, tableId, uniqueId, data)
        return response;
    } catch (error) {
        console.error(`Error Creating Document - (${tableUse}):`, error);
        return null;
    }
}