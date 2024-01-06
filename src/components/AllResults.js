import React, { useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Card,
  Button,
  Accordion,
} from "react-bootstrap";
import {
  PLE_Results,
  UCE_Results,
  UACE_Results,
} from "../otherFiles/education_results";

const AllResults = ({ userInfo }) => {
  // State to track the open state of each subject
  const [openSubjects, setOpenSubjects] = useState({});

  // Determine which results to display based on education level
  let results;
  switch (userInfo.educationLevel) {
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

  // Function to toggle the open state of a subject
  const toggleSubject = (subject) => {
    setOpenSubjects((prevOpenSubjects) => ({
      ...prevOpenSubjects,
      [subject]: !prevOpenSubjects[subject],
    }));
  };

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
                  <Button
                    variant="primary"
                    className="mt-3"
                    //   onClick={() => navigate("/exam-view")}
                  >
                    View Exam
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1 className="my-4">All Results</h1>
          {results.map((subjectResults) =>
            renderResultsForSubject(subjectResults)
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AllResults;
