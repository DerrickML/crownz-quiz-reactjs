// appwriteConfig.js
import { Client, Account, Databases, Permission, Role, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Setting your Appwrite endpoint from env var
  .setProject("651413f38aee140189c2"); // Setting your project ID from env var
// .setEndpoint('http://localhost/v1') // Setting your Appwrite endpoint from env var
// .setProject('651c19d1dfd60ba38d55') // Setting your project ID from env var
// .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint from env var
// .setProject(process.env.APPWRITE_PROJECT_ID); // Your project ID from env var

const account = new Account(client);
const databases = new Databases(client);

//Cloud - Appwrite
const database_id = "655f5a677fcf3b1d8b79";
const studentTable_id = "657065f7dddd996bf19b";
const nextOfKinTable_id = "65706739032c0962d0a9";
const studentMarksTable_id = "6598050dbb628ae2216f";

//Localhost - Appwrite
// const database_id = '651c1d7b8872bb9d837d';
// const studentTable_id = '6548e21e893779dbcca3';
// const parentsTable_id = '6548e10fc68f20dd704b';

export {
  client,
  account,
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  studentMarksTable_id,
  Permission,
  Role,
  Query,
};
