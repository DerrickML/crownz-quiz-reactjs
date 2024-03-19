// fetchStudentData.js
import {
  databases,
  database_id,
  studentTable_id,
  studentMarksTable_id,
  pointsTable_id,
  Query,
} from "../appwriteConfig.js";
import storageUtil from "./storageUtil"; // Import storageUtil

/**
 * Fetches and processes student and their results data.
 * @param {string} kinID - The ID of the next-of-kin.
 */
export const fetchAndProcessStudentData = async (kinID) => {
  try {
    console.log('Fetching and processing student data ...')
    // Step 1: Fetch students linked to the next-of-kin
    const students = await fetchStudentsLinkedToKin(kinID);

    // Step 2: Fetch results and points for each student and process data
    const processedData = await Promise.all(
      students.map(async (student) => {
        // Fetch results
        const results = await fetchStudentResults(student.studID);

        // Fetch points
        const points = await fetchStudentPoints(student.studID);
        const pointsBalance = points.length > 0 ? points[0].PointsBalance : 0; // Assuming each student has only one points document

        // Construct processed student data object
        return {
          studID: student.studID,
          studName: `${student.firstName} ${student.lastName} ${student.otherName || ""}`,
          gender: student.gender,
          phone: student.phone,
          email: student.email,
          educationLevel: student.educationLevel,
          schoolName: student.schoolName,
          schoolAddress: student.schoolAddress,
          pointsBalance: pointsBalance,
          Results: results.map((result) => ({
            subject: result.subject,
            score: result.marks,
            resultDetails: result.results,
            dateTime: formatDate(result.$createdAt),
          })),
        };

      })
    );


    // Step 3: Save the processed data to local storage using storageUtil
    storageUtil.setItem("studentData", processedData);
  } catch (error) {
    console.error("Error fetching and processing student data:", error);
  }
};


/**
 * Fetches students linked to a specific next-of-kin.
 * @param {string} kinID - The ID of the next-of-kin.
 * @returns {Promise<Array>} - A promise that resolves to an array of students.
 */
const fetchStudentsLinkedToKin = async (kinID) => {
  try {
    const response = await databases.listDocuments(database_id, studentTable_id, [
      Query.equal("kinID", [kinID]),
    ]);
    return response.documents;
  } catch (err) {
    console.error('Failed to fecth students LINKED to next-of-kin. ' + err);
  }
};

/**
 * Fetches results for a specific student.
 * @param {string} studID - The ID of the student.
 * @returns {Promise<Array>} - A promise that resolves to an array of results.
 */
const fetchStudentResults = async (studID) => {
  try {
    const response = await databases.listDocuments(
      database_id,
      studentMarksTable_id,
      [Query.equal("studID", [studID])]
    );
    return response.documents;
  } catch (err) {
    console.error('Failed to fecth Students RESULTS linked to next-of-kin. ' + err);
  }
};

/**
 * Fetches student points for a specific student.
 * @param {string} studID - The ID of the student.
 * @returns {Promise<Array>} - A promise that resolves to an array of results.
 */
const fetchStudentPoints = async (studID) => {
  try {
    const response = await databases.listDocuments(
      database_id,
      pointsTable_id,
      [Query.equal("UserID", [studID])]
    );
    return response.documents;
  } catch (err) {
    console.error('Failed to fecth Students POINTS linked to next-of-kin. ' + err);
  }

};

/**
 * Updates data for a single student in local storage.
 * @param {string} studID - The ID of the student to update.
 * @param {object} updatedData - The updated data for the student.
 * // Example usage:
 * updateStudentDataInLocalStorage(studentID, { pointsBalance: newPointsBalance });
 */
export const updateStudentDataInLocalStorage = async (studID, updatedData) => {
  try {
    // Retrieve the existing array of student data from local storage
    const storedData = storageUtil.getItem("studentData");
    if (!storedData || !Array.isArray(storedData)) {
      throw new Error("No student data found in local storage.");
    }

    // Find the index of the student to update
    const studentIndex = storedData.findIndex(student => student.studID === studID);
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${studID} not found in local storage.`);
    }

    // Update the specific student's data
    storedData[studentIndex] = {
      ...storedData[studentIndex],
      ...updatedData
    };

    // Save the modified array back to local storage
    storageUtil.setItem("studentData", storedData);
  } catch (error) {
    console.error("Error updating student data in local storage:", error);
  }
};

/**
 * Formats the date string into a more readable format.
 * @param {string} dateTime - The original date-time string.
 * @returns {string} - The formatted date-time string.
 */
const formatDate = (dateTime) => {
  try {
    const date = new Date(dateTime);
    return `${date.toLocaleString("en-US", {
      dateStyle: "long",
    })} ${date.toLocaleTimeString()}`;
  } catch (err) {
    console.error('Failed to format DATE. ' + err);
  }
};
