// Home.js
import React, { useState, useEffect } from "react"; // Import useState
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faEdit,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import storageUtil from "../utilities/storageUtil";
import "../animations.css";
import HeroHeader from "./HeroHeader";
import "./Home.css";
import RecentResults from "./RecentResults";
import { getTransformedResults } from "../utilities/resultsUtil";

function Home({ sessionInfo, onLogout }) {
  // Receive sessionInfo & onLogout as a prop

  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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

  //Fetch sessionInfo from localStorage
  const userInfo = storageUtil.getItem("userInfo");

  console.log("label: " + userInfo.labels);

  //Check user type
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");

  const viewResults = (resultDetails) => {
    console.log("Results to be rendered\n", resultDetails);
    navigate("/quiz-results", { state: { results: resultDetails } });
  };

  useEffect(() => {
    const userId = userInfo?.userId;
    console.log("User ID IN useEffect: " + userId);
    if (userId) {
      const transformedData = getTransformedResults(userId);
      console.log("Transformed results in useEffect: " + transformedData);
      if (JSON.stringify(transformedData) !== JSON.stringify(results)) {
        setResults(transformedData);
      }
    }
  }, [userInfo, results]); // Only re-run the effect if userInfo or results change

  //Attempt exam
  const attemptExam = () => {
    navigate("/exam-page");
  };

  // Function to render the recent scores
  const renderRecentScores = () => (
    <RecentResults results={results} onViewResults={viewResults} />
  );

  const renderStudentDashboard = () => (
    <>
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
                  <th>No.</th>
                  <th>Student Name</th>
                  <th>Recent Score</th>
                  <th>Last Exam Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {linkedStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.recentScore}</td>
                    <td>{student.lastExamDate}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("#")}
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

  const renderHeroHeader = () => (
    <HeroHeader>
      <h1 className="display-4">
        Welcome to Your Dashboard, {userInfo.firstName}!
      </h1>
      <p className="lead">
        {isStudent
          ? "Explore your academic journey, track progress, and excel in your studies."
          : "Stay informed about your child's academic journey, track their progress, and support their success."}
      </p>
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="light"
          className="me-2"
          onClick={() => navigate("/profile")}
        >
          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
          View Profile
        </Button>
        {isStudent && (
          <Button variant="secondary" onClick={() => navigate("/exam-page")}>
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Attempt Exam
          </Button>
        )}
      </div>
    </HeroHeader>
  );

  return (
    <>
      {renderHeroHeader()}
      <Container fluid>
        {isStudent && renderStudentDashboard()}

        {isNextOfKin && renderNextOfKinDashboard()}
      </Container>
    </>
  );
}

export default Home;
