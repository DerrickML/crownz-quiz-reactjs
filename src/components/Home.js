// Home.js
import React, { useState, useEffect, useRef } from "react"; // Import useState
import { NavLink } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Accordion,
} from "react-bootstrap";
import storageUtil from "../utilities/storageUtil";
import "../animations.css";
import {
  PLE_Results,
  UCE_Results,
  UACE_Results,
} from "../otherFiles/education_results";

function Home({ sessionInfo, onLogout }) {
  // Receive sessionInfo & onLogout as a prop

  //Fetch sessionInfo from localStorage
  const userInfo = storageUtil.getItem("userInfo");

  //Check user type
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");

  // Dummy data for linked students (replace with real data fetching logic)
  const linkedStudents = [
    {
      id: 1,
      name: "Alice Smith",
      recentScore: "75%",
      lastExamDate: "Dec 18, 2023",
    },
    {
      id: 2,
      name: "Bob Johnson",
      recentScore: "82%",
      lastExamDate: "Dec 17, 2023",
    },
    // ... more students
  ];

  // Dummy data for exam results
  let examResults;

  if (userInfo.educationLevel === "PLE") {
    examResults = PLE_Results;
  } else if (userInfo.educationLevel === "UCE") {
    examResults = UCE_Results;
  } else if (userInfo.educationLevel === "UACE") {
    examResults = UACE_Results;
  } else {
    examResults = PLE_Results;
  }

  // State to track the open state of each subject
  const [openSubjects, setOpenSubjects] = useState({});

  // Function to handle subject card click
  const handleSubjectClick = (subject) => {
    setOpenSubjects((prevState) => ({
      ...prevState,
      [subject]: !prevState[subject], // Toggle the open state for the clicked subject
    }));
  };

  const renderStudentDashboard = () => (
    <Row>
      {examResults.map((result, index) => {
        const isOpen = openSubjects[result.subject];
        const maxHeight = isOpen ? "1000px" : "0px"; // Adjust '1000px' based on your content

        return (
          <Col md={6} key={index} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header
                className="bg-transparent border-0 d-flex justify-content-between align-items-center"
                onClick={() => handleSubjectClick(result.subject)}
                style={{ cursor: "pointer" }}
              >
                <h3 className="mb-0">{result.subject}</h3>
                <Badge bg="secondary" pill>
                  {result.attempts.length}/5 Attempted
                </Badge>
              </Card.Header>
              <div
                style={{ maxHeight: maxHeight }}
                className="card-body-collapsible"
              >
                {isOpen && (
                  <Card.Body className="pt-0">
                    <Table responsive="sm" className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.attempts.map((attempt, idx) => (
                          <tr key={idx}>
                            <td>{attempt.date}</td>
                            <td>{attempt.score}</td>
                            <td>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="rounded-pill"
                              >
                                View Results
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                )}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  const renderNextOfKinDashboard = () => (
    <Row>
      <Col xs={12}>
        <Card className="shadow-sm">
          <Card.Header>
            <h4>Linked Students Overview</h4>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Recent Score</th>
                  <th>Last Exam Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {linkedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.recentScore}</td>
                    <td>{student.lastExamDate}</td>
                    <td>
                      <Button variant="primary" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <>
      <Container fluid className="my-4">
        <h2 className="mb-4">
          {isStudent ? "Student" : isNextOfKin ? "Next of Kin" : ""} Dashboard
        </h2>
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="profile-card shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  {/* Profile Picture Placeholder */}
                  <div className="ms-3">
                    <h5 className="card-title mb-0">
                      {userInfo.firstName} {userInfo.lastName}
                    </h5>
                    {isStudent && (
                      <p className="text-muted mb-0">
                        Level: {userInfo.educationLevel}
                      </p>
                    )}
                    <p className="card-text">
                      <small>Last logged in: 3 hours ago</small>
                    </p>
                  </div>
                  <div className="ms-auto">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      // href="/profile"
                    >
                      <NavLink className="nav-link" to="/profile">
                        Edit Profile
                      </NavLink>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {isStudent && renderStudentDashboard()}
        {isNextOfKin && renderNextOfKinDashboard()}
      </Container>
    </>
  );
}

export default Home;
