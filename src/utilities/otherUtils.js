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
    couponUsagesTable_id,
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
    fetch(`${serverUrl}/alert-guardian`, {
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
        const response = await databases.createDocument(databaseId, tableId, 'unique()', data)
        return response;
    } catch (error) {
        console.error(`Error Creating Document - (${tableUse}):`, error);
        return null;
    }
}

/* ----------- Coupon Usage tracking ----------- ***/
export const couponTrackerUpdate = async (data) => {
    try {
        var currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a z');
        await createDocument(database_id, couponUsagesTable_id, {
            UserID: data.userId,
            CouponCode: data.couponCode,
            UsageDate: currentDateTime,
        }, data.message)
    } catch (e) {
        console.error('Failed to update coupon usage table: ', e);
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
message: message-`createDocument() function`,
duration: duration
}
*/
export const updatePointsTable = async (data) => {
    try {
        // console.log('updatePointsTable: ', data);

        // Get the current date and time in 'Africa/Nairobi' timezone
        const currentDate = moment().tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss.SSS Z');
        // console.log('currentDate: ', currentDate);

        // Determine expiry date based on static or dynamic date
        let expiryDate = determineExpiryDate(data);
        // console.log('Expiry date: ', expiryDate);

        const points = parseInt(data.points, 10);
        // console.log('points being purchased: ', points);

        if (data.paymentFor !== 'points') {
            console.error('Not a Points Service');
            return;
        }

        // Add a new document to the Points Batch Table
        await addPointsBatch(data, currentDate, expiryDate, points);

        // Check if the user already has a document in the Points Table
        const responseCheck = await databases.listDocuments(
            database_id,
            pointsTable_id,
            [Query.equal('UserID', data.userId)]
        );
        // console.log('Checking user in PointsTable: ', responseCheck);

        // Update the Cumulative Points Table
        let updateResponse;
        if (responseCheck.documents.length === 0) {
            // Create a new document if the user has no document assigned
            updateResponse = await createNewPointsDocument(data, currentDate, expiryDate, points);
        } else {
            // Update the existing document if the user is found in the Points Table
            updateResponse = await updateExistingPointsDocument(data, responseCheck.documents[0], currentDate, points);
        }
        console.log('Points Table Updated: ', updateResponse);

    } catch (err) {
        console.error('Error updating points table: ', err);
        throw new Error('Error updating points table: ', err);
    }
}

const determineExpiryDate = (data) => {
    let expiryDate;
    const currentMoment = moment.tz('Africa/Nairobi');

    if (data.staticDate && moment(data.expiryDate).isBefore(currentMoment)) {
        expiryDate = moment.tz(data.expiryDate, 'Africa/Nairobi').toDate();
        // console.log('Static Set Expiry date to use: ', expiryDate);
    } else if (!data.staticDate) {
        expiryDate = currentMoment.add(data.duration, 'days').toDate();
        // console.log('Dynamic Expiry date to use: ', expiryDate);
    } else {
        expiryDate = moment.tz(data.expiryDate, 'Africa/Nairobi').toDate();
        // console.log('Expiry date set: ', expiryDate);
    }

    return expiryDate;
}

const addPointsBatch = async (data, currentDate, expiryDate, points) => {
    const response = await createDocument(
        database_id,
        pointsBatchTable_id,
        {
            transactionID: data.transactionID,
            userID: data.userId,
            points: points,
            purchaseDate: currentDate,
            expiryDate: expiryDate,
        },
        data.message
    );
    // console.log('Points Batch Table - Data sent: ', response);
}

const createNewPointsDocument = async (data, currentDate, expiryDate, points) => {
    console.log('User not found in PointsTable');
    return await databases.createDocument(
        database_id,
        pointsTable_id,
        data.userId,
        {
            UserID: data.userId || null,
            PurchasedTier: data.educationLevel,
            AcquisitionDate: currentDate,
            ExpiryDate: expiryDate,
            PointsBalance: points,
        }
    );
}

const updateExistingPointsDocument = async (data, currentDocument, currentDate, points) => {
    console.log('User found in PointsTable');
    let expiryDate = determineExpiryDateForExistingDocument(data, currentDocument);

    // Proceed to update the points table
    return await databases.updateDocument(
        database_id,
        pointsTable_id,
        currentDocument.$id,
        {
            PointsBalance: currentDocument.PointsBalance + points,
            AcquisitionDate: currentDate,
            ExpiryDate: expiryDate.toISOString(),
        }
    );
}

const determineExpiryDateForExistingDocument = (data, currentDocument) => {
    const currentExpiryDate = moment.tz(currentDocument.ExpiryDate, 'Africa/Nairobi');
    let expiryDate;

    if (data.staticDate && moment(data.expiryDate).isBefore(currentExpiryDate)) {
        expiryDate = currentExpiryDate.toDate();
        console.log('Maintaining current expiry date: ', expiryDate);
    } else if (data.staticDate && moment(data.expiryDate).isAfter(currentExpiryDate)) {
        expiryDate = moment.tz(data.expiryDate, 'Africa/Nairobi').toDate();
        console.log('Static Set Expiry date to use: ', expiryDate);
    } else if (!data.staticDate && currentExpiryDate.isAfter(moment())) {
        expiryDate = currentExpiryDate.add(data.duration, 'days').toDate();
        console.log('Expiry date extended: ', expiryDate);
    } else {
        expiryDate = moment().tz('Africa/Nairobi').add(data.duration, 'days').toDate();
        console.log('New Expiry date set: ', expiryDate);
    }

    return expiryDate;
}

export const kinPurchasePoints = async (navigate, studentInfo) => {
    navigate(`/select-package/`, { state: { studentInfo: studentInfo } });
}