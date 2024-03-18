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
import moment from 'moment';
import { serverUrl } from "../config.js";

export const sendEmailToNextOfKin = async (userInfo, subjectName, examScore, examDateTime) => {
    const studentName = `${userInfo.firstName} ${userInfo.lastName}${userInfo.otherName ? ` ${userInfo.otherName}` : ''}`;
    const educationLevel = userInfo.educationLevel;
    const kinNames = `${userInfo.kinFirstName} ${userInfo.kinLastName}`;
    const kinEmail = userInfo.kinEmail;

    // Send the information to the backend
    fetch(`${serverUrl}/alert-next-of-kin`, {
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
            console.error('Failed to send email notification', error);
        });
};

export const updateLabels = async (userId, labels) => {
    const paylaod = {
        userId: userId,
        labels: labels,
    };
    // Send the information to the backend
    fetch(`${serverUrl}/update-labels`, {
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

/*** ----------- Create a document ----------- ***/
export const createDocument = async (databaseId, tableId, uniqueId, data, tableUse) => {
    try {
        console.log('Data passed to createDocument: ', data)
        const response = await databases.createDocument(databaseId, tableId, uniqueId, data)
        return response;
    } catch (error) {
        console.error(`Error Creating Document - (${tableUse}):`, error);
        return null;
    }
}

/*** ----------- Update Points Tables ----------- ***/
/*
data = {
created_at: receiptDetails.created_at, 
paymentFor: paymentFor, 
transactionID: data.externalId, 
userId: userInfo.userId, 
points: receiptDetails.points, 
educationLevel: educationLevel, 
message: message-`createDocument() function`
}
*/
export const updatePointsTable = async (data) => {
    try {
        console.log('Data passed to update points function', data)
        console.log('Date Data passed to update points function', data.created_at)
        //===MOMO TIMESTAMP
        let momoDateTime = new Date(data.created_at)
        console.log('MOMO TIMESTAMP: ' + momoDateTime)
        //====================
        let points = parseInt(data.points)
        let created_at = moment(momoDateTime, 'DD/MM/YYYY, HH:mm:ss').toDate();
        let createdDate = new Date(created_at);

        // Creating a new Date object for expiryDate to avoid modifying createdDate
        let expiryDate = new Date(createdDate);

        // Adding 1 year to the expiryDate
        expiryDate.setFullYear(createdDate.getFullYear() + 1);

        // Now, createdDate and expiryDate are two separate Date objects
        console.log("Created Date:", createdDate);
        console.log("Expiry Date:", expiryDate);

        if (data.paymentFor === 'points') {
            //createDocument(databaseId, tableId, uniqueId, data, tableUse)
            //Points Batch Table
            await createDocument(database_id, pointsBatchTable_id, "unique()", {
                transactionID: data.transactionID,
                userID: data.userId,
                points: points,
                purchaseDate: created_at,
                expiryDate: expiryDate,
            }, data.message)

            //Points Table
            //Check if user has document assigned to them
            const responseCheck = await databases.listDocuments(database_id, pointsTable_id, [Query.equal('UserID', data.userId)]);

            //Create a new document if user has no document assigned
            if (responseCheck.documents.length === 0) {
                console.log('No user document assigned, creating a new one for the user')
                const userDocResponse = await databases.createDocument(
                    database_id,
                    pointsTable_id,
                    "unique()",
                    {
                        UserID: data.userId || null,
                        PurchasedTier: data.educationLevel, //userDetails.classGrade
                        AcquisitionDate: new Date().toLocaleString(),
                        ExpiryDate: new Date().toLocaleString(),
                    }
                );
            }

            //Proceed to update the points tables
            //Retrieve user document Id
            const response = await databases.listDocuments(database_id, pointsTable_id, [
                Query.equal("UserID", data.userId),
            ]);
            console.log('Checking points table: ', response)
            if (response.documents.length > 0) { //TODO: If table user points doesn't exist, create new document
                const documentId = response.documents[0].$id //Points document id to be updated
                let currentPoints = response.documents[0].PointsBalance
                console.log('points document id: ', documentId)

                //update Points table with purchases points
                const updateResponse = await databases.updateDocument(database_id, pointsTable_id, documentId, { PointsBalance: (currentPoints + points), ExpiryDate: expiryDate })
                console.log('update points balance: ', updateResponse)
            }
        }
    } catch (err) {
        console.error('Error updating points table: ', err)
    }
}

export const kinPurchasePoints = async (navigate, studentInfo) => {
    console.log('kinPurchasePoints studentInfo: ', { state: { studentInfo: studentInfo } })
    navigate(`/select-package/`, { state: { studentInfo: studentInfo } });
}