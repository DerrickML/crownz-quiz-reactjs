// Home.js
import React, { useState, useEffect, useRef } from "react"; // Import useState
import { NavLink, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

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

  // State for recent scores
  const [recentScores, setRecentScores] = useState([]);

  // Dummy data for exam results
  // Function to get the most recent 5 scores for a specific education level
  const getRecentFiveScoresForLevel = (level) => {
    let results;
    switch (level) {
      case "PLE":
        results = PLE_Results;
        break;
      case "UCE":
        results = UCE_Results;
        break;
      case "UACE":
        results = UACE_Results;
        break;
      default:
        results = [];
    }

    return results
      .flatMap((subject) =>
        subject.attempts.map((attempt) => ({
          ...attempt,
          subject: subject.subject,
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  // Use useEffect to set recent scores
  useEffect(() => {
    if (userInfo && userInfo.educationLevel) {
      setRecentScores(getRecentFiveScoresForLevel(userInfo.educationLevel));
    }
  }, [userInfo]);

  // Function to render the recent scores
  const renderRecentScores = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Date</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {recentScores.map((score, idx) => (
          <tr key={idx}>
            <td>{score.subject}</td>
            <td>{score.date}</td>
            <td>{score.score}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderStudentDashboard = () => (
    <>
      <Row>
        <Col lg={12}>
          <h3 className="mb-4">Recent Scores</h3>
          {renderRecentScores()}
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate("/all-results")}
          >
            View All Results
          </Button>
        </Col>
      </Row>
    </>
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
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("/all-results")}
                      >
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
                    <Button variant="outline-secondary" size="sm">
                      <NavLink className="nav-link" to="/profile">
                        Profile
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
