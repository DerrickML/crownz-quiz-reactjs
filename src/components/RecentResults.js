import React from "react";
import { Table, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBan } from "@fortawesome/free-solid-svg-icons";

const RecentResults = ({ results, onViewResults }) => {
  // Extract the most recent five attempts
  const mostRecentAttempts = results
    .flatMap((subject) => subject.attempts)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Card className="mb-4">
      <Card.Header>Most Recent Results</Card.Header>
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
              <td>{attempt.subject}</td>
              <td>{attempt.date}</td>
              <td>{attempt.score}</td>
              <td>
                {attempt.resultDetails ? (
                  <Button
                    variant="primary"
                    onClick={() => onViewResults(attempt.resultDetails)}
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
    </Card>
  );
};

export default RecentResults;
