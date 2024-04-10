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
    ID
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
export const createDocument = async (databaseId, tableId, data, tableUse) => {
    try {
        // console.log('Data passed to createDocument: ', data)
        const response = await databases.createDocument(databaseId, tableId, 'unique()', data)
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
        // console.log('PointsTableUpdate Data Received: ' + JSON.stringify(data));
        let points = parseInt(data.points);

        // Define both expected formats
        const customFormats = ['MMMM Do YYYY, h:mm:ss a', 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]ZZZ[)]', moment.ISO_8601];

        // Parse the date using Moment.js with custom and expected formats
        let createdDate = moment(data.created_at, customFormats, true);

        // Check if the parsed date is valid
        if (!createdDate.isValid()) {
            throw new Error('Invalid date format');
        }

        // Convert to JavaScript Date object
        createdDate = createdDate.toDate();

        // Creating a new Date object for expiryDate to avoid modifying createdDate
        let expiryDate = new Date(createdDate);
        expiryDate.setFullYear(createdDate.getFullYear() + 1); // Adding 1 year to the expiryDate

        // console.log("CREATED Date:", createdDate);
        // console.log("EXPIRY Date:", expiryDate);
        //===

        if (data.paymentFor === 'points') {
            //createDocument(databaseId, tableId, uniqueId, data, tableUse)
            //Points Batch Table
            // console.log('POINTS BATCH TABLE: Creating Document')
            await createDocument(database_id, pointsBatchTable_id, {
                transactionID: data.transactionID,
                userID: data.userId,
                points: points,
                purchaseDate: createdDate,
                expiryDate: expiryDate,
            }, data.message)

            //Points Table
            //Check if user has document assigned to them
            // console.log('POINTS TABLE: Checking if user has document assigned to them')
            const responseCheck = await databases.listDocuments(database_id, pointsTable_id, [Query.equal('UserID', data.userId)]);

            //Create a new document if user has no document assigned
            if (responseCheck.documents.length === 0) {
                // console.log('POINTS TABLE: No user document assigned, creating a new one for the user')

                // Use Moment.js to get the current date and time
                const acquisitionDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
                // console.log('Creating Document inPoints Table: ' + acquisitionDate)

                const userDocResponse = await databases.createDocument(
                    database_id,
                    pointsTable_id,
                    'unique()',
                    {
                        UserID: data.userId || null,
                        PurchasedTier: data.educationLevel, //userDetails.classGrade
                        AcquisitionDate: acquisitionDate,
                        ExpiryDate: acquisitionDate,
                    }
                );
            }

            //Proceed to update the points tables
            //Retrieve user document Id
            // console.log('UPDATING POINTS TABLE: Creating Document')
            const response = await databases.listDocuments(database_id, pointsTable_id, [
                Query.equal("UserID", data.userId),
            ]);
            // console.log('Checking points table: ', response)
            if (response.documents.length > 0) { //TODO: If table user points doesn't exist, create new document
                const documentId = response.documents[0].$id //Points document id to be updated
                let currentPoints = response.documents[0].PointsBalance
                // console.log('points document id: ', documentId)

                //update Points table with purchases points
                const updateResponse = await databases.updateDocument(database_id, pointsTable_id, documentId, { PointsBalance: (currentPoints + points), ExpiryDate: expiryDate })
                // console.log('update points balance: ', updateResponse)
            }
        }
    } catch (err) {
        console.error('Error updating points table: ', err)
    }
}

export const kinPurchasePoints = async (navigate, studentInfo) => {
    // console.log('kinPurchasePoints studentInfo: ', { state: { studentInfo: studentInfo } })
    navigate(`/select-package/`, { state: { studentInfo: studentInfo } });
}