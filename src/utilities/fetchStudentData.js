// fetchStudentData.js
import {
  databases,
  database_id,
  studentTable_id,
  studentMarksTable_id,
  Query,
} from "../appwriteConfig.js";
import storageUtil from "./storageUtil"; // Import storageUtil

/**
 * Fetches and processes student and their results data.
 * @param {string} kinID - The ID of the next-of-kin.
 */
export const fetchAndProcessStudentData = async (kinID) => {
  try {
    // Step 1: Fetch students linked to the next-of-kin
    const students = await fetchStudentsLinkedToKin(kinID);

    // Step 2: Fetch results for each student and process data
    const processedData = await Promise.all(
      students.map(async (student) => {
        const results = await fetchStudentResults(student.studID);
        return {
          studID: student.studID,
          studName: `${student.firstName} ${student.lastName} ${
            student.otherName === null ? "" : student.otherName
          }`,
          gender: student.gender,
          phone: student.phone,
          email: student.email,
          educationLevel: student.educationLevel,
          schoolName: student.schoolName,
          schoolAddress: student.schoolAddress,
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
  const response = await databases.listDocuments(database_id, studentTable_id, [
    Query.equal("kinID", [kinID]),
  ]);
  return response.documents;
};

/**
 * Fetches results for a specific student.
 * @param {string} studID - The ID of the student.
 * @returns {Promise<Array>} - A promise that resolves to an array of results.
 */
const fetchStudentResults = async (studID) => {
  const response = await databases.listDocuments(
    database_id,
    studentMarksTable_id,
    [Query.equal("studID", [studID])]
  );
  return response.documents;
};

/**
 * Formats the date string into a more readable format.
 * @param {string} dateTime - The original date-time string.
 * @returns {string} - The formatted date-time string.
 */
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return `${date.toLocaleString("en-US", {
    dateStyle: "long",
  })} ${date.toLocaleTimeString()}`;
};
