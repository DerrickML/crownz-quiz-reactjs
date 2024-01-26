import React, { useState } from "react"; // Import useState
import useLinkedStudents from "../hooks/useLinkedStudents";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Modal,
  Button,
  Card,
  Table,
  Nav,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faSchool,
  faUserCircle,
  faEdit,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import storageUtil from "../utilities/storageUtil";
import KinSignup from "./KinSignup";
import HeroHeader from "./HeroHeader";
import "./Home.css";

const Profile = () => {
  console.log("Profile Fire Check");
  //Fetch sessionInfo from localStorage
  const userInfo = storageUtil.getItem("userInfo");

  const sessionData = storageUtil.getItem("sessionInfo");
  const kinId = sessionData.userId;
  const linkedStudents = useLinkedStudents(kinId);
  const navigate = useNavigate();

  //Hook to manage modal visibility
  const [showModal, setShowModal] = useState(false);

  //Function to handle modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Check user type
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");

  //Pagination purposes
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = linkedStudents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderNextOfKinProfile = () => (
    <Card className="shadow-sm mb-4 profile-card">
      <Card.Header>
        <FontAwesomeIcon icon={faUsers} className="me-2" />
        Linked Students
      </Card.Header>
      <Card.Body>
        <Card.Title>Linked Students</Card.Title>
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Education Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((student) => (
              <tr key={student.studID}>
                <td>{student.Name}</td>
                <td>{student.educationLevel}</td>
                <td>
                  <Button size="sm">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Nav aria-label="Page navigation">
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(linkedStudents.length / itemsPerPage) },
              (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <Button variant="link" onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </Button>
                </li>
              )
            )}
          </ul>
        </Nav>
      </Card.Body>
    </Card>
  );

  const renderStudentProfile = () => (
    <Card className="shadow-sm mb-4 profile-card">
      <Card.Header>
        <FontAwesomeIcon icon={faSchool} className="me-2" />
        Education & School Details
      </Card.Header>
      <Card.Body>
        <ul className="list-group list-group-flush">
          {userInfo.schoolName ? (
            <>
              <li className="list-group-item">
                <i className="bi bi-building me-2"></i>
                <strong>School Name:</strong> {userInfo.schoolName}
              </li>
            </>
          ) : null}

          {userInfo.schoolAddress ? (
            <>
              <li className="list-group-item">
                <i className="bi bi-geo-alt me-2"></i>
                <strong>School Address:</strong> {userInfo.schoolAddress}
              </li>
            </>
          ) : null}

          <li className="list-group-item">
            <i className="bi bi-bookmark me-2"></i>
            <strong>Exam:</strong> {userInfo.educationLevel}
          </li>

          {/* Additional student-specific content */}
        </ul>
      </Card.Body>
    </Card>
  );

  const renderNextOfKinDetails = () => (
    <Card className="shadow-sm mb-4 profile-card">
      <Card.Header>
        {" "}
        <FontAwesomeIcon icon={faUserCircle} className="me-2" />
        Next of Kin
      </Card.Header>
      <Card.Body>
        <ul className="list-group list-group-flush">
          {userInfo.kinID ? (
            <>
              <li className="list-group-item">
                <i className="bi bi-building me-2"></i>
                <strong>First Name:</strong> {userInfo.kinFirstName}
              </li>
              <li className="list-group-item">
                <i className="bi bi-building me-2"></i>
                <strong>Last Name:</strong> {userInfo.kinLastName}
              </li>

              {userInfo.kinEmail ? (
                <>
                  <li className="list-group-item">
                    <i className="bi bi-geo-alt me-2"></i>
                    <strong>Email Address:</strong> {userInfo.kinEmail}
                  </li>
                </>
              ) : null}

              {userInfo.kinPhone ? (
                <>
                  <li className="list-group-item">
                    <i className="bi bi-bookmark me-2"></i>
                    <strong>Telephone:</strong> {userInfo.kinPhone}
                  </li>
                </>
              ) : null}
            </>
          ) : (
            <Button
              variant="outline-primary"
              className="mt-3"
              onClick={toggleModal}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
              Add Next of Kin
            </Button>
          )}
          {/* Additional kin-specific content */}
        </ul>
      </Card.Body>
    </Card>
  );

  // Hero Header
  const renderHeroHeader = () => (
    <HeroHeader>
      <div className="text-center">
        <h1 className="display-4">Hello, {userInfo.firstName}!</h1>
        <p className="lead">Welcome to your Profile Dashboard</p>
        <div className="profile-hero-buttons mt-4">
          <Button
            variant="outline-light"
            className="me-2"
            onClick={() => navigate("/edit-profile")}
          >
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </Button>
          {isNextOfKin && (
            <Button
              variant="outline-success"
              onClick={() => navigate("/linked-students")}
            >
              <FontAwesomeIcon icon={faUsers} /> Linked Students
            </Button>
          )}
        </div>
      </div>
    </HeroHeader>
  );

  return (
    <>
      {renderHeroHeader()}
      <Container>
        <Nav variant="tabs" defaultActiveKey="personalDetails">
          <li className="nav-item">
            <a
              className="nav-link active"
              href="#personalDetails"
              data-bs-toggle="tab"
            >
              Personal Details
            </a>
          </li>
          {isStudent && (
            <>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#educationDetails"
                  data-bs-toggle="tab"
                >
                  Education Details
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#nextOfKinDetails"
                  data-bs-toggle="tab"
                >
                  Next of Kin Details
                </a>
              </li>
            </>
          )}
          {isNextOfKin && (
            <li className="nav-item">
              <a
                className="nav-link"
                href="#linkedStudents"
                data-bs-toggle="tab"
              >
                Linked Students
              </a>
            </li>
          )}
        </Nav>
        <Tab.Content>
          <div className="tab-pane active" id="personalDetails">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Contact Information</h5>
                <p className="card-text">
                  {userInfo.email ? (
                    <>
                      <strong>Email:</strong> {userInfo.email}
                    </>
                  ) : null}
                </p>
                {userInfo.phone && (
                  <p className="card-text">
                    {userInfo.phone ? (
                      <>
                        <strong>Phone:</strong> {userInfo.phone}
                      </>
                    ) : null}
                  </p>
                )}
                {isStudent && (
                  <p className="card-text">
                    {userInfo.gender ? (
                      <>
                        <strong>Gender:</strong> {userInfo.gender}
                      </>
                    ) : null}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isStudent && (
            <>
              <div className="tab-pane" id="educationDetails">
                {renderStudentProfile()}
              </div>
              <div className="tab-pane" id="nextOfKinDetails">
                {renderNextOfKinDetails()}
              </div>
            </>
          )}

          {isNextOfKin && (
            <div className="tab-pane" id="linkedStudents">
              {renderNextOfKinProfile()}
            </div>
          )}
        </Tab.Content>
      </Container>
      <Modal show={showModal} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Next of Kin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <KinSignup />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Profile;
