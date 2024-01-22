// Home.js
import React, { useState, useEffect, useRef } from "react"; // Import useState
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faEdit,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
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
import TestButton from "./TestButton"; // Import the TestButton component

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

  const hasSetScores = useRef(false);

  useEffect(() => {
    if (userInfo && userInfo.educationLevel && !hasSetScores.current) {
      setRecentScores(getRecentFiveScoresForLevel(userInfo.educationLevel));
      hasSetScores.current = true;
    }
  }, [userInfo]);

  //Attempt exam
  const attemptExam = () => {
    navigate("/exam-page");
  };

  // Function to render the recent scores
  const renderRecentScores = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Date</th>
          <th>Score</th>
          <th>View Results</th>
        </tr>
      </thead>
      <tbody>
        {recentScores.map((score, idx) => (
          <tr key={idx}>
            <td>{score.subject}</td>
            <td>{score.date}</td>
            <td>{score.score}</td>
            <td></td>
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

          <div className="d-flex justify-content-start mt-3 gap-3">
            <Button variant="success" onClick={() => navigate("/all-results")}>
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              View All Results
            </Button>
            <Button variant="warning" onClick={attemptExam}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Attempt Exam
            </Button>
          </div>
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
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="profile-card shadow">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  size="3x"
                  className="user-icon"
                />
                <div className="ms-3">
                  <h5 className="card-title mb-0">
                    {userInfo.firstName} {userInfo.lastName}
                  </h5>
                  {isStudent && (
                    <p className="text-muted mb-0">
                      Level: {userInfo.educationLevel}
                    </p>
                  )}
                  <small>Last logged in: 3 hours ago</small>
                </div>
                <div className="ms-auto">
                  <NavLink
                    to="/profile"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Profile
                  </NavLink>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {isStudent && (
        <Row>
          <Col lg={6}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title>Recent Scores</Card.Title>
                {renderRecentScores()}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title>Actions</Card.Title>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() => navigate("/all-results")}
                >
                  <FontAwesomeIcon icon={faChartLine} /> View All Results
                </Button>
                <Button variant="warning" onClick={attemptExam}>
                  <FontAwesomeIcon icon={faEdit} /> Attempt Exam
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {isNextOfKin && renderNextOfKinDashboard()}
    </Container>
  );
}

export default Home;
