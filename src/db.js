// src/db.js
import Dexie from 'dexie';

// Initialize the database with the exams store
const db = new Dexie('examAppDB');
db.version(10.2).stores({

    exams: '++id, userId, educationLevel, subjectName, examData', // Define the schema for 'exams'
    examAnswers: '++id, studID,	studInfo, subject, marks,	dateTime, results, kinEmail', // Define the schema for 'examAnswers' submission when offline

    students: "++id, studID, studName, firstName, lastName, otherName, gender, phone, email, educationLevel, schoolName, schoolAddress, pointsBalance, Results"
});

export default db;
