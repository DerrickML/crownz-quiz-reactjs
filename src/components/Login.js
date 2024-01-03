import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use Link from react-router-dom for navigation
import { showToast } from "../utilities/toastUtil.js";
import {
  account,
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  Query,
} from "../appwriteConfig.js";

function Login(props) {
  const navigate = useNavigate();

  //User ID
  const [userId, setUserId] = useState(null);

  // State for form inputs
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [loginMethod, setLoginMethod] = useState("email");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(10); //Adjust time accordingly in seconds
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailLoginLoader, setEmailLoginLoader] = useState(false);
  const [otpSubmitLoader, setOtpSubmitLoader] = useState(false);
  const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone
  const [emailError, setEmailError] = useState(""); // New state for email login error
  const [accountCheck, setAccountCheck] = useState(false);

  //Funstion to check for phone number validity
  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && !isValidPhoneNumber(phoneNumber);
  };

  // Generic input change handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleMethodChange = (e) => {
  //   setLoginMethod(e.target.value);
  // };
  const handleMethodChange = (e) => {
    setLoginMethod(e.target.value);
    setShowOtpInput(false); // Reset OTP input visibility
    setIsOtpSent(false); // Reset OTP sent status
    setOtpCountdown(10); // Reset OTP countdown
    setAccountCheck(false); // Reset account check status
    setPhoneError(false); // Reset phone error
    // Reset form inputs if needed
    setFormInputs({ email: "", password: "", phone: "", otp: "" });
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setIsOtpSent(true); // Disable the button initially
    const { phone } = formInputs;

    //Check for phone validity
    const isUserPhoneValid = !validatePhoneNumber(phone);
    setPhoneError(!isUserPhoneValid);

    if (!isUserPhoneValid) {
      return;
    }

    // Check if account already exists
    if ((await searchForExistingAccount(phone)) === false) {
      setAccountCheck(true);
      console.log("Account does not exist");
      setIsOtpSent(false); // Enable the button initially
      return;
    } else {
      setAccountCheck(false);
    }

    try {
      const createSession = await account.createPhoneSession("unique()", phone);
      setUserId(createSession.userId); // Save the userId in state
      console.log(createSession);

      setIsOtpSent(true); // Disable the button initially
      setShowOtpInput(true); // Show the OTP input field

      // Start countdown
      let counter = otpCountdown;
      const interval = setInterval(() => {
        counter -= 1;
        setOtpCountdown(counter);
        if (counter <= 0) {
          clearInterval(interval);
          setIsOtpSent(false); // Re-enable the button after countdown
          // Don't hide the OTP input field
          setOtpCountdown(10); // Reset countdown
        }
      }, 1000);
    } catch (error) {
      console.error("OTP sending failed:", error);
      setIsOtpSent(false); // Ensure the button is re-enabled if there's an error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, phone, otp } = formInputs;

    // Reset error messages
    setEmailError("");

    try {
      if (loginMethod === "email") {
        setEmailLoginLoader(true);
        const session = await account.createEmailSession(email, password);
        console.log("Email login successful", session);

        //Fetch Account Data/Info from server-side
        const userInfo = await userData(session.userId);
        console.log("User info: ", userInfo); //Debugging purposes

        props.onLogin(session, userInfo); // Pass the session data to App.js

        // Redirect to home page
        navigate("/");
      } else if (loginMethod === "phone") {
        setOtpSubmitLoader(true);
        if (!userId) {
          console.error("User ID is not available for OTP verification.");
          return;
        }
        const session = await account.updatePhoneSession(userId, otp);
        console.log("Phone login successful", session);

        //Fetch Account Data/Info from server-side
        const userInfo = await userData(session.userId);
        console.log("User info: ", userInfo); //Debugging purposes

        props.onLogin(session, userInfo); // Pass the session data to App.js

        // Redirect to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      if (loginMethod === "email") {
        setEmailError(error.message);
      }
      // TODO: Handle errors such as showing an error message to the user
    }
    setEmailLoginLoader(false);
    setOtpSubmitLoader(false);
  };

  // Checking for existing account
  async function searchForExistingAccount(value) {
    const phoneNumber = value;

    if (!phoneNumber) {
      console.log("Phone number is required");
    }

    try {
      // Check in the student table
      const existsInStudentTable = await checkPhoneNumberInTable(
        studentTable_id,
        phoneNumber
      );

      if (existsInStudentTable) {
        console.log(phoneNumber + " exists in student table");
        return true;
      }

      // Check in the kin table
      const existsInKinTable = await checkPhoneNumberInTable(
        nextOfKinTable_id,
        phoneNumber
      );

      if (existsInKinTable) {
        console.log(phoneNumber + " exists in kin table");
        return true;
      }

      // Phone number does not exist in any table
      console.log(phoneNumber + " does not exist");
      return false;
    } catch (error) {
      console.error("Error checking phone number:", error);
    }
  }

  async function userData(accountId) {
    try {
      const payload = {
        userId: accountId,
      };

      const response = await fetch(
        "https://2wkvf7-3000.csb.app/get-user-details",
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
      console.log("Account data fetched: ", responseData);
      return responseData;
    } catch (error) {
      if (!navigator.onLine) {
        showToast(
          "Network error. Please check your internet connection.",
          "error"
        );
      } else {
        console.error("Failed to fetch Account Data: ", error);
        showToast(
          "Failed to fetch account data. Try logging in again:\n" + error,
          "error"
        );
      }

      return null;
    }
  }

  // Function to check if a phone number exists in a given table
  async function checkPhoneNumberInTable(tableId, phoneNumber) {
    try {
      const response = await databases.listDocuments(database_id, tableId, [
        Query.equal("phone", phoneNumber),
      ]);
      return response.documents.length > 0;
    } catch (error) {
      console.error("Error querying table:", error);
      throw error;
    }
  }

  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3 className="text-center mb-4">Sign In</h3>
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="loginMethod" className="form-label">
                  Login Using
                </label>
                <select
                  className="form-select"
                  id="loginMethod"
                  value={loginMethod}
                  onChange={handleMethodChange}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div id="emailOrPhoneFieldLogin" className="mb-3">
                {loginMethod === "email" ? (
                  <>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      className="form-control mb-3"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      value={formInputs.email}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control mb-3"
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      value={formInputs.password}
                      onChange={handleInputChange}
                      required
                    />
                    {/* Display any email errors */}
                    {emailError && (
                      <div className="invalid-feedback d-block mb-3">
                        {emailError}
                      </div>
                    )}

                    {emailLoginLoader ? (
                      <button
                        className="btn btn-primary mb-3"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-grow spinner-grow-sm mb-3"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </button>
                    ) : (
                      <button
                        id="emailLoginButton"
                        type="submit"
                        className="btn btn-primary mb-3"
                      >
                        Login
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <label htmlFor="phone">Phone Number</label>
                    <PhoneInput
                      className="form-control mb-3"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formInputs.phone}
                      onChange={(value) =>
                        setFormInputs((prevState) => ({
                          ...prevState,
                          phone: value,
                        }))
                      }
                      required
                    />
                    {phoneError && (
                      <div className="invalid-feedback d-block mb-3">
                        Invalid phone number
                      </div>
                    )}
                    {accountCheck && (
                      <div className="invalid-feedback d-block mb-3">
                        No account found with this phone number. Please check
                        your number or <Link to="/sign-up">sign up</Link> for a
                        new account.
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-primary mb-3"
                      onClick={handleSendOtp}
                      disabled={isOtpSent} // Button disabled only while OTP is being sent
                    >
                      {isOtpSent && otpCountdown > 0
                        ? `Resend OTP in ${otpCountdown}s`
                        : "Send OTP"}
                    </button>
                  </>
                )}
              </div>

              {showOtpInput && (
                <div id="otpSection" className="mb-3">
                  <label htmlFor="otpInput">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otpInput"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formInputs.otp}
                    onChange={handleInputChange}
                    required
                  />
                  {otpSubmitLoader ? (
                    <button
                      className="btn btn-primary mb-3"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-grow spinner-grow-sm mb-3"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary mb-3"
                      id="otpSubmitButton"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </form>
            {loginMethod === "email" ? (
              <p className="text-end mb-3">
                Forgot <Link to="/forget-password">password?</Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
