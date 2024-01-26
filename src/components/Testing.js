import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utilities/toastUtil.js";
import {
  account,
  databases,
  database_id,
  studentTable_id,
} from "../appwriteConfig.js";

function Testing() {
  const navigate = useNavigate();

  const [signupMethod, setSignupMethod] = useState("email");
  const [signupLoader, setSignupLoader] = useState(false);

  // State hooks for each input field
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [gender, setGender] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");

  const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone

  // Generalized phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && !isValidPhoneNumber(phoneNumber);
  };

  // Handles the change of the signup method (email or phone)
  const handleMethodChange = (e) => {
    setSignupMethod(e.target.value);
  };

  // Handles input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target;

    // Use dynamic key names to update state based on the input id
    const setterMap = {
      email: setEmail,
      phone: (value) => setPhone(value || ""),
      password: setPassword,
      firstName: setFirstName,
      lastName: setLastName,
      otherName: setOtherName,
      schoolName: setSchoolName,
      schoolAddress: setSchoolAddress,
      // ... map other ids to their respective setter functions ...
    };

    const setterFunction = setterMap[id];
    if (setterFunction) {
      setterFunction(value);
    }

    const dropdownSetterMap = {
      gender: setGender,
      classGrade: setClassGrade,
      // ... other dropdown ids ...
    };

    const dropdownSetterFunction = dropdownSetterMap[id];
    if (dropdownSetterFunction) {
      dropdownSetterFunction(value);
    }
  };

  // Handles the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSignupLoader(true);

    // Validate phone numbers
    const isUserPhoneValid = !validatePhoneNumber(phone);
    setPhoneError(!isUserPhoneValid);

    if (!isUserPhoneValid) {
      setSignupLoader(false);
      return;
    }

    try {
      // Construct the user details object
      const studentDetails = {
        email,
        phone,
        password,
        firstName,
        lastName,
        otherName,
        gender,
        classGrade,
        schoolName,
        schoolAddress,
      };

      let userResponse, labelResponse, studentID;

      // Perform the signup using Appwrite SDK
      try {
        if (signupMethod === "email") {
          try {
            const userEmail = studentDetails.email;
            console.log("Signing up student using Email: " + userEmail);
            userResponse = await emailSignup(
              userEmail,
              password,
              firstName,
              phone
            );
            studentID = userResponse.$id;
          } catch (error) {
            console.error("Failed to Create Account:\n", error);
            throw error;
          }
        } else {
          try {
            const phoneNumber = phone;
            userResponse = await phoneSignup(phoneNumber);
            if (!userResponse) {
              setSignupLoader(false);
              return; // Stop execution if signup failed
            }

            studentID = userResponse.userId;
            console.log("Phone student ID: ", studentID);
          } catch (error) {
            console.error("Failed to Create Account:\n", error);
            return;
          }
        }

        //Assigning label to student account
        labelResponse = await studentLabel(studentID);
        if (!labelResponse) {
          setSignupLoader(false);
          return; // Stop execution if signup failed
        }
        console.log("label response: ", labelResponse);

        //Adding student to student account table
        await addToStudentTable(studentID);
      } catch (error) {
        console.error("Signup failed:", error);
        return; // Early exit on failure
        // Handle errors such as showing an error message to the user
      }

      showToast("Account Created Successfully", "success");

      setSignupLoader(false);
      // Redirect the user or show a success message
      navigate("/sign-in");
    } catch (error) {
      setSignupLoader(false);
      showToast("Error Creating Account at Submission", "error");
      console.error("Error Creating Account at Submission:", error);
      return;
    }
  };

  async function emailSignup(
    emailAddress,
    userPassword,
    userName,
    phoneNumber
  ) {
    try {
      const payload = {
        email: emailAddress,
        password: userPassword,
        userName: userName,
        phone: phoneNumber || null,
      };

      const response = await fetch(
        "https://2wkvf7-3000.csb.app/create-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorDetails}`
        );
      }

      const responseData = await response.json();
      console.log("Student created server-side response: ", responseData);

      return responseData;
    } catch (error) {
      if (!navigator.onLine) {
        showToast(
          "Network error. Please check your internet connection.",
          "error"
        );
      } else {
        console.error("Email Signup failed: ", error.message);
        showToast(
          "Failed to sign up with email address: " + error.message,
          "error"
        );
      }

      return null;
    }
  }

  async function phoneSignup(phoneNumber) {
    // Perform the signup using Appwrite SDK
    try {
      // if (isValidPhoneNumber(phoneNumber))
      return await account.createPhoneSession("unique()", phoneNumber);
      // else return console.error("You Entered a wrong number");
    } catch (error) {
      console.error("Phone Signup failed:", error.code);
      showToast("Faile to signup with phone number", "error");
      return null;
      // Handle errors such as showing an error message to the user
    }
  }

  //Asssign a label to a student account
  async function studentLabel(stud_Id) {
    try {
      const paylaod = {
        userId: stud_Id,
        labels: ["student"],
      };

      const response = await fetch("https://2wkvf7-3000.csb.app/update-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paylaod),
      });

      console.log("FROM FUNCTION: Label Response: ", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (!navigator.onLine) {
        showToast(
          "Network error. Please check your internet connection.",
          "error"
        );
      } else {
        showToast("Error applying label.", "error");
        console.error("Error applying label:", error);
      }

      return null;
    }
  }

  //Add student to Student Account table
  async function addToStudentTable(studID) {
    try {
      const userDocResponse = await databases.createDocument(
        database_id,
        studentTable_id, // students collection id
        "unique()", // Generates a unique ID via appwrite
        {
          studID: studID || null,
          kinID: null,
          email: email || null, // Include email if provided
          phone: phone || null, // Include phone if provided
          firstName: firstName,
          lastName: lastName,
          otherName: otherName || null,
          gender: gender,
          educationLevel: classGrade, //userDetails.classGrade
          schoolName: schoolName || null,
          schoolAddress: schoolAddress || null,
          accountStatus: "Active",
        }
      );

      console.log("Student Account Added to student tabel:", userDocResponse);
      return userDocResponse;
    } catch (error) {
      console.error("Error adding Student Account to Student Table:", error);
      return null;
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Signup Error Toast */}
          <div
            className="toast"
            id="emailToastError"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            display="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Email Error</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              This Email is already in use. Please use a different email.
            </div>
          </div>
          {/* Network Error Toast */}
          <div
            className="toast"
            id="networkToastError"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Network Error</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              Network error. Please check your internet connection.
            </div>
          </div>

          <form id="signupForm" onSubmit={handleSubmit}>
            {/* Signup Method Selection */}
            <div className="mb-3">
              <label htmlFor="signupMethod" className="form-label">
                Signup Using
              </label>
              <select
                className="form-select"
                id="signupMethod"
                value={signupMethod}
                onChange={handleMethodChange}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            {/* Dynamic Field for Email or Phone based on the chosen signup method */}
            {signupMethod === "email" ? (
              <>
                <div className="mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password">Provide a Strong Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="mb-3 form-group">
                  <div className="phone-input">
                    <label htmlFor="phone">Phone Number (Optional)</label>
                    <PhoneInput
                      className="form-control"
                      id="phone"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {phoneError && (
                    <div className="invalid-feedback d-block">
                      Invalid phone number
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 form-group">
                  <div className="phone-input">
                    <label htmlFor="phone">Phone Number</label>
                    <PhoneInput
                      className="form-control"
                      id="phone"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  {phoneError && (
                    <div className="invalid-feedback d-block">
                      Invalid phone number
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email">Email Address (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                </div>
              </>
            )}
            {/* Personal Details Section */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="otherName" className="form-label">
                  Other Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otherName"
                  value={otherName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="gender"
                value={gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {/* School Details Section */}
            <div className="mb-3">
              <label htmlFor="classGrade" className="form-label">
                Education Level
              </label>
              <select
                className="form-select"
                id="classGrade"
                value={classGrade}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Education Level</option>
                <option value="PLE">Primary Leaving Examination (PLE)</option>
                <option value="UCE">
                  Uganda Certificate of Education (UCE)
                </option>
                <option value="UACE">
                  Uganda Advanced Certificate of Education (UACE)
                </option>
              </select>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="schoolName" className="form-label">
                  School Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="schoolName"
                  value={schoolName}
                  onChange={handleInputChange}
                  required={classGrade === "PLE"}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="schoolAddress" className="form-label">
                  School Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="schoolAddress"
                  value={schoolAddress}
                  onChange={handleInputChange}
                  required={classGrade === "PLE"}
                />
              </div>
            </div>

            {!signupLoader ? (
              <button
                type="submit"
                className="btn btn-primary mb-3"
                id="signupButton"
              >
                Sign Up
              </button>
            ) : (
              <button className="mb-3 btn btn-secondary" type="button" disabled>
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing-up...
              </button>
            )}
            {phoneError && (
              <div className="invalid-feedback d-block mb-3">
                Check for any invalid inputs
              </div>
            )}
            <p className="mb-3">
              Already have an account? <Link to="/sign-in">Log in here</Link>
            </p>
          </form>
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="toast"
            data-bs-autohide="false"
          >
            <div className="toast-header">
              <small>11 mins ago</small>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              Hello, world! This is a toast message.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testing;
