import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  account,
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  Query,
} from "../appwriteConfig.js";

function SignUp() {
  const [signupMethod, setSignupMethod] = useState("email");
  const [kinSignupMethod, setKinSignupMethod] = useState("email");
  const [nextOfKinActive, setNextOfKinActive] = useState(false);
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

  const [nextOfKin, setNextOfKin] = useState({
    kinEmail: "",
    kinPhone: "",
    kinFirstName: "",
    kinLastName: "",
    // ... other kin-related fields ...
  });

  const [studId, setStudId] = useState(null);
  const [kinId, setKinId] = useState(null);
  const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone
  const [kinPhoneError, setKinPhoneError] = useState(false); // Error flag for kin's phone

  // Generalized phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && !isValidPhoneNumber(phoneNumber);
  };

  // Handles the change of the signup method (email or phone)
  const handleMethodChange = (e) => {
    setSignupMethod(e.target.value);
  };

  // Handles the change of the next of kin's signup method (email or phone)
  const kinHandleMethodChange = (e) => {
    setKinSignupMethod(e.target.value);
  };

  // Toggles the visibility of the next of kin section
  const handleNextOfKinToggle = (e) => {
    setNextOfKinActive(e.target.checked);
  };

  // Handles input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id.startsWith("kin")) {
      setNextOfKin({ ...nextOfKin, [id]: value });
    } else {
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
    }
  };

  // Handles the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSignupLoader(true);

    // Validate phone numbers
    const isUserPhoneValid = !validatePhoneNumber(phone);
    setPhoneError(!isUserPhoneValid);

    let isKinPhoneValid = true;
    if (nextOfKinActive) {
      isKinPhoneValid = !validatePhoneNumber(nextOfKin.kinPhone);
      setKinPhoneError(!isKinPhoneValid);
    }

    if (!isUserPhoneValid || !isKinPhoneValid) {
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
        // ... include other fields ...
      };

      let userResponse, labelResponse;

      // Perform the signup using Appwrite SDK
      try {
        if (signupMethod === "email") {
          try {
            const userEmail = email;
            userResponse = await emailSignup(userEmail, password, firstName);
            console.log(userResponse);

            setStudId(userResponse.$id);
            // labelResponse = await studentLabel();
            // console.log("label response: ", labelResponse);
          } catch (error) {
            console.error("Failed to Create Account:\n", error);
            throw error;
          }
        } else {
          try {
            const phoneNumber = phone;
            userResponse = await phoneSignup(phoneNumber);
            console.log(userResponse);

            setStudId(userResponse.userId);
            labelResponse = await studentLabel();
            console.log("label response: ", labelResponse);
          } catch (error) {
            console.error("Failed to Create Account:\n", error);
            throw error;
          }
        }

        // Redirect the user or show a success message
        // navigate("/sign-in");
      } catch (error) {
        console.error("Signup failed:", error);
        return; // Early exit on failure
        // Handle errors such as showing an error message to the user
      }

      // Check if next of kin details should be included
      if (nextOfKinActive) {
        // TODO: Implement the logic to create next of kin if account does not exist, and link next of kin using Appwrite SDK
        console.log("Next of Kin toggled: ", nextOfKinActive);
        try {
          let linkingResponse, createKinAcc;

          let kinExists = await searchForExistingKinAccount(
            kinSignupMethod === "email"
              ? nextOfKin.kinEmail
              : nextOfKin.kinPhone
          );

          // Check if next of kin account exists
          // kinEmail, kinPhone, kinFirstName, studName, kinLastName;
          let kinIdToUse = kinExists;
          if (!kinExists) {
            kinIdToUse = await createKinAccount(
              nextOfKin.kinEmail,
              nextOfKin.kinPhone,
              nextOfKin.kinFirstName,
              firstName,
              nextOfKin.kinLastName
            );
            // kinExists = setKinId(kinResponse.$Id);
          }

          await linkKinToUser(kinIdToUse); // Pass the kinId directly
        } catch (error) {
          console.error("Error handling next of kin:", error);
        }
      }

      setSignupLoader(false);
    } catch (error) {
      setSignupLoader(false);
      console.error("Error Creating Account at Submission:", error);
      throw error;
    }
  };

  async function emailSignup(emailAddress, userPassword, userName) {
    // Perform the signup using Appwrite SDK
    try {
      return await account.create(
        "unique()",
        emailAddress,
        userPassword,
        userName
      );
    } catch (error) {
      console.error("Signup failed:", error);
      return error.message;
      // Handle errors such as showing an error message to the user
    }
  }

  async function phoneSignup(phoneNumber) {
    // Perform the signup using Appwrite SDK
    try {
      // if (isValidPhoneNumber(phoneNumber))
      return await account.createPhoneSession("unique()", phoneNumber);
      // else return console.error("You Entered a wrong number");
    } catch (error) {
      console.error("Signup failed:", error);
      return error.message;
      // Handle errors such as showing an error message to the user
    }
  }

  //Asssign a label to a student account
  async function studentLabel() {
    try {
      const paylaod = {
        userId: studId,
        labels: ["student"],
      };

      const response = await fetch("https://2wkvf7-3000.csb.app/update-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paylaod),
      });

      console.log("Kin Account Details: ", response);
      setKinId(response.$id);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error applying label:", error);
      throw error;
    }
  }

  // Create a kin account
  async function createKinAccount(
    kinEmail,
    kinPhone,
    kinFirstName,
    studName,
    kinLastName
  ) {
    try {
      const kinDetails = {
        email: kinEmail || null,
        phone: kinPhone || null,
        firstName: kinFirstName,
        lastName: kinLastName || null,
        studentName: studName,
      };

      const response = await fetch(
        "https://2wkvf7-3000.csb.app/create-next-of-kin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kinDetails),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse the JSON response
      console.log("Kin Account Details: ", responseData.kinId);
      return responseData.kinId;
    } catch (error) {
      console.error("Error creating Next of Kin account:", error);
      throw error;
    }
  }

  // Checking for existing kin account
  async function searchForExistingKinAccount(value) {
    try {
      let query = [];
      if (kinSignupMethod === "email") {
        query.push(Query.equal("email", value));
      } else {
        query.push(Query.equal("phone", value));
      }

      const response = await databases.listDocuments(
        database_id,
        nextOfKinTable_id,
        query
      );

      if (response.documents.length > 0) {
        // Assuming you want to return the kinID of the first document found
        console.log(
          "Next of Kin exists. Proceeding to link with student ...",
          response
        );
        const kinID = response.documents[0].kinID;
        setKinId(kinID); // Setting the kinId state

        return kinID;
      } else {
        console.log(
          "Kin does not exist. Proceeding to create account, and link with student ...",
          response
        );
        return false;
      }
    } catch (error) {
      console.error("Error checking Next of Kin:", error);
      throw error;
    }
  }

  async function linkKinToUser(kinId) {
    // Implement logic to link next of kin to the user
    console.log("Linking next of kin to user");

    try {
      // Create a new document with user and Next of Kin details. Placing the kinID in the studentTable as a link between the student and the kin
      const userDocResponse = await databases.createDocument(
        database_id,
        studentTable_id, // students collection id
        "unique()", // Generates a unique ID via appwrite
        {
          studID: studId,
          kinID: kinId || null,
          email: email || null, // Include email if provided
          phone: phone || null, // Include phone if provided
          firstName: firstName,
          lastName: lastName,
          otherName: otherName || null,
          gender: gender,
          class: classGrade, //userDetails.classGrade
          schoolName: schoolName || null,
          schoolAddress: schoolAddress || null,
        }
      );

      console.log("User document linked to Next of Kin:", userDocResponse);
      return userDocResponse;
    } catch (error) {
      console.error("Error linking user to Next of Kin:", error);
      throw error;
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
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
                />
              </div>
            </div>
            <input
              type="hidden"
              id="nextOfKinActive"
              value={nextOfKinActive.toString()}
            />
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="nextOfKinToggle"
                onChange={handleNextOfKinToggle}
              />
              <label className="form-check-label" htmlFor="nextOfKinToggle">
                Add Next of Kin?
              </label>
            </div>
            {/* Next of Kin Section */}
            {nextOfKinActive && (
              <div className="collapse show mb-3" id="nextOfKinSection">
                <div className="card card-body">
                  {/* Next of Kin Sign-up Method */}
                  <div className="mb-3">
                    <label htmlFor="kinSignupMethod" className="form-label">
                      Signup Using
                    </label>
                    <select
                      className="form-select"
                      id="kinSignupMethod"
                      value={kinSignupMethod}
                      onChange={kinHandleMethodChange}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>

                  {/* Dynamic Email or Phone Field */}
                  <div id="kinEmailOrPhoneFieldSignup" className="mb-3">
                    {kinSignupMethod === "email" ? (
                      <>
                        <div className="mb-3">
                          <label htmlFor="kinEmail">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="kinEmail"
                            value={nextOfKin.kinEmail}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            required
                          />
                        </div>
                        <div className="mb-3 form-group">
                          <div className="phone-input">
                            <label htmlFor="optionalKinPhone">
                              Phone Number (Optional)
                            </label>
                            <PhoneInput
                              className="form-control"
                              id="kinPhone"
                              value={nextOfKin.kinPhone}
                              onChange={(value) =>
                                setNextOfKin({
                                  ...nextOfKin,
                                  kinPhone: value || "",
                                })
                              }
                              placeholder="Enter phone number"
                              required={kinSignupMethod === "phone"}
                            />
                          </div>
                          {kinPhoneError && (
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
                            <label htmlFor="optionalKinPhone">
                              Phone Number (Optional)
                            </label>
                            <PhoneInput
                              className="form-control"
                              id="kinPhone"
                              value={nextOfKin.kinPhone}
                              onChange={(value) =>
                                setNextOfKin({
                                  ...nextOfKin,
                                  kinPhone: value || "",
                                })
                              }
                              placeholder="Enter phone number"
                              required={kinSignupMethod === "phone"}
                            />
                          </div>
                          {kinPhoneError && (
                            <div className="invalid-feedback d-block">
                              Invalid phone number
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="optionalKinEmail">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="kinEmail"
                            value={nextOfKin.kinEmail}
                            onChange={handleInputChange}
                            placeholder="Enter Email Address"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* First and Last Name Fields for Next of Kin */}
                  <div className="mb-3">
                    <label htmlFor="kinFirstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="kinFirstName"
                      value={nextOfKin.kinFirstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="kinLastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="kinLastName"
                      value={nextOfKin.kinLastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
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
            {(phoneError || kinPhoneError) && (
              <div className="invalid-feedback d-block mb-3">
                Check for any invalid inputs
              </div>
            )}
            <p className="mb-3">
              Already have an account? <Link to="/sign-in">Log in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
