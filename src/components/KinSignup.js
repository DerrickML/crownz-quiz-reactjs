import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import React, { useState } from "react";
import { showToast } from "../utilities/toastUtil.js";
import storageUtil from "../utilities/storageUtil";

import {
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  Query,
} from "../appwriteConfig.js";

const KinSignup = () => {
  //Fetch sessionInfo from localStorage
  const userInfo = storageUtil.getItem("userInfo");
  const sessionData = storageUtil.getItem("sessionInfo");

  const studentID = sessionData.userId;

  const [kinSignupMethod, setKinSignupMethod] = useState("email");
  const [signupLoader, setSignupLoader] = useState(false);

  // State hooks for each input field
  const [nextOfKin, setNextOfKin] = useState({
    kinEmail: "",
    kinPhone: "",
    kinFirstName: "",
    kinLastName: "",
    // ... other kin-related fields ...
  });

  const [kinPhoneError, setKinPhoneError] = useState(false); // Error flag for kin's phone

  /**
   * Handles the form submission. Validates the phone number, creates or finds the next of kin account,
   * links it to the user, and navigates to the profile page upon successful completion.
   * Displays appropriate error messages in case of any failures.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSignupLoader(true);

    // Validate phone numbers
    let isKinPhoneValid = true;
    isKinPhoneValid = !validatePhoneNumber(nextOfKin.kinPhone);
    setKinPhoneError(!isKinPhoneValid);

    try {
      let linkKinResponse;

      // Logic to create next of kin if account does not exist, and link next of kin using Appwrite SDK
      console.log("Linking with next of kin");
      try {
        let kinExists = await searchForExistingKinAccount(
          kinSignupMethod === "email" ? nextOfKin.kinEmail : nextOfKin.kinPhone
        );

        let kinIdToUse;

        console.log("Kin exists? " + kinExists);

        if (kinExists === false) {
          try {
            const createKin = await createKinAccount(
              nextOfKin.kinEmail,
              nextOfKin.kinPhone,
              nextOfKin.kinFirstName,
              userInfo.firstName,
              nextOfKin.kinLastName
            );
            kinIdToUse = createKin;
            console.log("Kin ID on account NOT exist: " + createKin);
          } catch (error) {
            setSignupLoader(false);
            return; // Stop execution if kin account creation failed
          }
        } else {
          kinIdToUse = kinExists;
        }

        linkKinResponse = await linkKinToUser(kinIdToUse); // Pass the kinId directly
        if (!linkKinResponse) {
          setSignupLoader(false);
          return; // Stop execution if signup failed
        }
      } catch (error) {
        console.error("Error handling next of kin:", error);
        return;
      }

      showToast(
        "Next of Kin linked successfullty.\nThe information will reflect on the next login",
        "success"
      );

      setSignupLoader(false);
      // Redirect the user or show a success message
    } catch (error) {
      setSignupLoader(false);
      showToast("Error Linking next of kin:\n", "error");
      console.error("Error Linking next of kin:", error);
      return;
    }
  };

  /**
   * Validates a given phone number. Returns true if the phone number is invalid.
   * @param {string} phoneNumber - The phone number to be validated.
   * @returns {boolean} - True if the phone number is invalid, false otherwise.
   */
  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && !isValidPhoneNumber(phoneNumber);
  };

  // Handles the change of the next of kin's signup method (email or phone)
  const kinHandleMethodChange = (e) => {
    setKinSignupMethod(e.target.value);
  };

  // Handles input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id.startsWith("kin")) {
      setNextOfKin({ ...nextOfKin, [id]: value });
    } else {
      // Use dynamic key names to update state based on the input id
      showToast("Setter Map function at handleInputChange", "error");
    }
  };

  /**
   * Asynchronously creates a Next of Kin account with the provided details.
   * Returns the ID of the created account or null in case of failure.
   * @param {string} kinEmail - Email address of the next of kin.
   * @param {string} kinPhone - Phone number of the next of kin.
   * @param {string} kinFirstName - First name of the next of kin.
   * @param {string} kinLastName - Last name of the next of kin.
   * @param {string} studName - Name of the student associated with the next of kin.
   * @returns {Promise<string|null>} - The ID of the created kin account or null if an error occurs.
   */
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
        signupMethod: kinSignupMethod,
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

      console.log("Kin response details: " + response);

      const responseData = await response.json(); // Parse the JSON response
      console.log("Kin Account Details: ", responseData.$id);
      return responseData.$id;
    } catch (error) {
      if (!navigator.onLine) {
        showToast(
          "Network error. Please check your internet connection.",
          "error"
        );
      } else {
        showToast(
          "Failed to create Next of Kin account. Please try again.",
          "error"
        );
        console.error("Error creating Next of Kin account:", error);
      }
      return;
    }
  }

  // Checking for existing kin account ---Returns KinId or False----
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
        // Will return the kinID of the first document found
        console.log(
          "Next of Kin exists. Proceeding to link with student ...",
          response
        );
        showToast(
          "Next of kin account already exists, proceeding to link with student",
          "info"
        );
        const kinID = response.documents[0].kinID;

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
      return null;
    }
  }

  async function linkKinToUser(kinId) {
    // Implement logic to link next of kin to the user
    console.log("Linking next of kin to user");

    try {
      let query = [];

      query.push(Query.equal("studID", studentID));

      const response = await databases.listDocuments(
        database_id,
        studentTable_id,
        query
      );

      if (response.documents.length > 0) {
        // Will return the kinID of the first document found
        console.log("Student account exists in table...", response);
        const linkKinStud = await databases.updateDocument(
          database_id,
          studentTable_id,
          response.documents[0].$id,
          {
            kinID: kinId,
          }
        );
        showToast(
          "Next of kin account already exists, proceeding to link with student",
          "info"
        );
        const kinID = response.documents[0].kinID;

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
            {/* Next of Kin Section */}

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
            {!signupLoader ? (
              <button
                type="submit"
                className="btn btn-primary mb-3"
                id="signupButton"
              >
                Add Next of Kin
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
            {kinPhoneError && (
              <div className="invalid-feedback d-block mb-3">
                Check for any invalid inputs
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default KinSignup;
