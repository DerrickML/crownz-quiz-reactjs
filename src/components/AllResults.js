import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faBan,
  faGraduationCap,
  faChartLine,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import "./AllResults.css";
import storageUtil from "../utilities/storageUtil";
import {
  fetchAndUpdateResults,
  getTransformedResults,
} from "../utilities/resultsUtil";
import SelectExam from "./SelectExam";
import HeroHeader from "./HeroHeader";

const AllResults = () => {
  // State to track the open state of each subject
  const [openSubjects, setOpenSubjects] = useState({});
  const [results, setResults] = useState([]);
  const [refreshResults, setRefreshResults] = useState(false);
  const userInfo = storageUtil.getItem("userInfo");
  const navigate = useNavigate();

  const viewResults = (resultDetails) => {
    navigate("/quiz-results", { state: { results: resultDetails } });
  };

  useEffect(() => {
    const userId = userInfo?.userId;
    if (userId) {
      const transformedData = getTransformedResults(userId);
      if (JSON.stringify(transformedData) !== JSON.stringify(results)) {
        setResults(transformedData);
      }
    }
  }, [userInfo, results]); // Only re-run the effect if userInfo or results change

  // Function to toggle the open state of a subject
  const toggleSubject = (subject) => {
    setOpenSubjects((prevOpenSubjects) => ({
      ...prevOpenSubjects,
      [subject]: !prevOpenSubjects[subject],
    }));
  };

  async function updateResults() {
    setRefreshResults(true);
    await fetchAndUpdateResults(userInfo.userId);
    setRefreshResults(false);
    navigate("/all-results");
  }

  //Function to render the Hero-Header
  const renderHeroHeader = () => (
    <HeroHeader>
      <h1 className="display-4">
        <FontAwesomeIcon icon={faGraduationCap} className="me-2" /> Your Exam
        Dashboard
      </h1>
      <p className="lead">
        Ready to ace your exams? Track your progress and take on new challenges!
      </p>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button variant="light" onClick={() => navigate("/exam-page")}>
            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
            Select an Exam
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            hidden
            // onClick={() => navigate("/exam-page")} //Navigate to chart page
          >
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            View Statistics
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="dark"
            onClick={updateResults}
            disabled={refreshResults === true}
          >
            {refreshResults ? (
              <Spinner animation="grow" variant="light" />
            ) : (
              "Refresh Results"
            )}
          </Button>
        </Col>
      </Row>
    </HeroHeader>
  );

  // Function to render results for each subject
  const renderResultsForSubject = (subjectResults) => (
    <Card className="mb-4" key={subjectResults.subject}>
      <Card.Header
        onClick={() => toggleSubject(subjectResults.subject)}
        style={{ cursor: "pointer" }}
      >
        {subjectResults.subject}
      </Card.Header>
      {openSubjects[subjectResults.subject] && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.attempts.map((attempt, idx) => (
              <tr key={idx}>
                <td>{attempt.date}</td>
                <td>{attempt.score}</td>
                <td>
                  {attempt.resultDetails ? (
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => viewResults(attempt.resultDetails)}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-2" />
                      View Exam
                    </Button>
                  ) : (
                    <span className="text-muted">
                      <FontAwesomeIcon icon={faBan} className="me-2" />
                      No data
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );

  // Check if there are no results
  const noResultsAvailable = results.length === 0;

  return (
    <>
      {renderHeroHeader()}
      <Container fluid>
        <Row>
          {noResultsAvailable ? (
            <>
              <Alert variant="info">
                <Alert.Heading>No Results Available</Alert.Heading>
                <p>
                  It looks like you haven't completed any exams yet.Select any
                  of the exams below to seat for.
                </p>
                <hr />
                <div className="d-flex justify-content-center"></div>
              </Alert>
              <Card>
                <SelectExam />
              </Card>
            </>
          ) : (
            <>
              <Col>
                {
                  results
                    .filter((_, index) => index % 2 === 0)
                    .map(renderResultsForSubject) // Render even indexed items
                }
              </Col>
              <Col lg={6} md={12}>
                {" "}
                {/* Right Column for larger screens, full width for smaller screens */}
                {
                  !noResultsAvailable &&
                    results
                      .filter((_, index) => index % 2 !== 0)
                      .map(renderResultsForSubject) // Render odd indexed items
                }
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
};

export default AllResults;
