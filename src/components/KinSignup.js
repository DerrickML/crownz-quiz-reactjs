import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Form,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useUpdateUserInfo from "../hooks/useUpdateUserInfo.js";
import { showToast } from "../utilities/toastUtil.js";
import storageUtil from "../utilities/storageUtil";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faUserPlus,
  faPhone,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  Query,
} from "../appwriteConfig.js";

const KinSignup = ({ userInfoProp, onCompletion, studSignUp }) => {
  console.log("Check component initialization");

  const navigate = useNavigate();

  // Use props if available, otherwise use local storage
  const localUserInfo = storageUtil.getItem("userInfo"); //When already logged in
  const userInfo = studSignUp ? userInfoProp : localUserInfo; //At signup

  const studentID = studSignUp ? userInfoProp.userId : localUserInfo.userId;

  const [kinSuccess, setKinSuccess] = useState("true");

  //Check whether has next of kin
  useEffect(() => {
    if (userInfo && userInfo.kinID) {
      console.log("Kin exists");
      setKinSuccess(true);
    } else {
      console.log("No Kin exists");
      setKinSuccess(false);
    }
  }, [userInfo]); // Dependency array to trigger effect when userInfo changes

  //For updating user info
  const updateUserInfo = useUpdateUserInfo();

  const [kinSignupMethod, setKinSignupMethod] = useState("email");

  // State hooks for each input field
  const [nextOfKin, setNextOfKin] = useState({
    kinEmail: "",
    kinPhone: "",
    kinFirstName: "",
    kinLastName: "",
    // ... other kin-related fields ...
  });

  // State for linking to an existing kin account
  const [linkKinSignupMethod, setLinkKinSignupMethod] = useState("email");
  const [linkKinContact, setLinkKinContact] = useState("");

  const [signupLoader, setSignupLoader] = useState(false);
  const [kinPhoneError, setKinPhoneError] = useState(false); // Error flag for kin's phone
  const [activeTab, setActiveTab] = useState("link");

  //================================================================
  // Example: Function to call when kin linking/creation is successful
  const handleSuccess = () => {
    if (onCompletion) {
      onCompletion(); // Call the passed in completion callback
    } else {
      // Default behavior if no callback is provided
      navigate("/profile");
    }
  };
  //================================================================

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  /**
   * Validates a given phone number. Returns true if the phone number is invalid.
   * @param {string} phoneNumber - The phone number to be validated.
   * @returns {boolean} - True if the phone number is invalid, false otherwise.
   */
  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && !isValidPhoneNumber(phoneNumber);
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
          kinSignupMethod,
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
          kinIdToUse = kinExists.kinID;
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

  //Links kin
  const handleLinkKin = async (event) => {
    event.preventDefault();

    setSignupLoader(true);

    try {
      let linkMethod =
        linkKinSignupMethod === "email"
          ? nextOfKin.kinEmail
          : nextOfKin.kinPhone;

      console.log("Link Method is: ", linkMethod + ": " + linkKinContact);

      //Check if kin exists
      const checkKin = await searchForExistingKinAccount(
        linkKinSignupMethod,
        linkKinContact
      );

      if (!checkKin) {
        showToast("Kin account not found", "error");
        setSignupLoader(false);
        return;
      }

      const linkinKin = await linkKinToUser(checkKin.kinID);

      if (!studSignUp) {
        updateUserInfo({
          kinID: checkKin.kinID,
          kinFirstName: checkKin.kinFirstName,
          kinLastName: checkKin.kinLastName,
          kinEmail: checkKin.kinEmail,
          kinPhone: checkKin.kinPhone,
        });
      }
      console.log("Next of Kin Linked\n", checkKin);
      setSignupLoader(false);
      navigate("/profile");
    } catch (e) {
      setSignupLoader(false);
      console.error("Error Linking next of kin:", e);
      showToast("Failed to link with kin", "error");
    }
  };

  // Handles the change of the next of kin's signup method (email or phone)
  const kinHandleMethodChange = (e) => {
    setKinSignupMethod(e.target.value);
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
  async function searchForExistingKinAccount(kinSearchMethod, value) {
    try {
      let query = [];
      if (kinSearchMethod === "email") {
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
        // const kinID = response.documents[0].kinID;
        const kinDetails = {
          kinID: response.documents[0].kinID,
          kinFirstName: response.documents[0].firstName,
          kinLastName: response.documents[0].lastName,
          kinEmail: response.documents[0].email,
          kinPhone: response.documents[0].phone,
        };

        return kinDetails;
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
    //Logic to link next of kin to the user
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
        return false;
      }
    } catch (error) {
      console.error("Error checking Next of Kin:", error);
      return null;
    }
  }

  const renderForm = () => {
    return (
      <Form onSubmit={activeTab === "link" ? handleLinkKin : handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeTab === "link" ? "Link Using" : "Signup Using"}
          </Form.Label>
          <Form.Select
            id={
              activeTab === "link" ? "linkKinSignupMethod" : "kinSignupMethod"
            }
            value={activeTab === "link" ? linkKinSignupMethod : kinSignupMethod}
            onChange={(e) =>
              activeTab === "link"
                ? setLinkKinSignupMethod(e.target.value)
                : setKinSignupMethod(e.target.value)
            }
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </Form.Select>
        </Form.Group>

        {/* Email or Phone Input */}
        <Form.Group className="mb-3">
          <Form.Label>
            {activeTab === "link" ? "Email Address" : "Phone Number"}
          </Form.Label>
          {activeTab === "link" ? (
            <Form.Control
              type="email"
              id="linkKinEmail"
              placeholder="Enter email"
              value={linkKinContact}
              onChange={(e) => setLinkKinContact(e.target.value)}
              required
            />
          ) : (
            <PhoneInput
              className="form-control"
              id="kinPhone"
              placeholder="Enter phone number"
              value={nextOfKin.kinPhone}
              onChange={(value) =>
                setNextOfKin({ ...nextOfKin, kinPhone: value || "" })
              }
              required={kinSignupMethod === "phone"}
            />
          )}
        </Form.Group>

        {/* Additional fields for creating new Kin */}
        {activeTab === "create" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                id="kinFirstName"
                placeholder="Enter first name"
                value={nextOfKin.kinFirstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                id="kinLastName"
                placeholder="Enter last name"
                value={nextOfKin.kinLastName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" disabled={signupLoader}>
          {signupLoader ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : null}
          {activeTab === "link" ? " Link Next of Kin" : " Add Next of Kin"}
        </Button>
      </Form>
    );
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              {activeTab === "link" ? (
                <FontAwesomeIcon icon={faLink} />
              ) : (
                <FontAwesomeIcon icon={faUserPlus} />
              )}{" "}
              {activeTab === "link" ? "Link Next of Kin" : "Create New Kin"}
            </Card.Header>
            <Card.Body>
              <ButtonGroup className="mb-3">
                <Button
                  variant={activeTab === "link" ? "primary" : "outline-primary"}
                  onClick={() => toggleTab("link")}
                >
                  Link to Existing Kin
                </Button>
                <Button
                  variant={
                    activeTab === "create" ? "primary" : "outline-primary"
                  }
                  onClick={() => toggleTab("create")}
                  className="ms-2"
                >
                  Create New Kin
                </Button>
              </ButtonGroup>
              {renderForm()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default KinSignup;
