import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBan, faBookOpen } from "@fortawesome/free-solid-svg-icons";

const RecentResults = ({ results, onViewResults }) => {
  const navigate = useNavigate();
  // Extract the most recent five attempts
  const mostRecentAttempts = results
    .flatMap((subject) => subject.attempts)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)) // Use dateTime instead of date
    .slice(0, 5);

  return (
    <Card className="mb-4">
      <Card.Header>Most Recent Results</Card.Header>
      {results.length !== 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mostRecentAttempts.map((attempt, idx) => (
              <tr key={idx}>
                <td>{attempt.subject === "sst_ple" ? "Social Studies" : (attempt.subject === "math_ple" ? "Mathematics" : (attempt.subject === "sci_ple" ? "Science" : attempt.subject))}</td>
                <td>{attempt.dateTime}</td>
                <td>{attempt.score}</td>
                <td>
                  {attempt.resultDetails ? (
                    <Button
                      variant="primary"
                      onClick={() => onViewResults(attempt.resultDetails, attempt.subject, attempt.score)}
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
      ) : (
        <Card.Body>
          <div className="text-center">
            <FontAwesomeIcon
              icon={faBookOpen}
              size="3x"
              className="text-muted"
            />
            <h5 className="mt-3">No Recent Attempts Found</h5>
            <p>
              Looks like you haven't attempted any exams recently. Ready to
              challenge yourself?
            </p>
            <Button variant="primary" onClick={() => navigate("/exam-page")}>
              Attempt an Exam
            </Button>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

export default RecentResults;
