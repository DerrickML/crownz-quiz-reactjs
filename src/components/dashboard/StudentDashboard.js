// StudentDashboard.js
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEdit } from "@fortawesome/free-solid-svg-icons";
import RecentResults from "../RecentResults";
import { useNavigate } from "react-router-dom";
import { getTransformedResults } from "../../utilities/resultsUtil";

const StudentDashboard = ({ userInfo }) => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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

  const attemptExam = () => {
    navigate("/exam-page");
  };

  return (
    <>
      <Row>
        <RecentResults results={results} onViewResults={viewResults} />
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
};

export default StudentDashboard;
