import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBan } from "@fortawesome/free-solid-svg-icons";
import "./AllResults.css";
import storageUtil from "../utilities/storageUtil";

const Testing = ({ studResults = [] }) => {
  const [openSubjects, setOpenSubjects] = useState({}); // State to track the open state of each subject
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState({});
  const itemsPerPage = 5; // Number of results per page
  const userInfo = storageUtil.getItem("userInfo");
  const navigate = useNavigate();

  const viewResults = (resultDetails) => {
    navigate("/quiz-results", { state: { results: resultDetails } });
  };

  useEffect(() => {
    const userId = userInfo?.userId;
    if (userId) {
      const transformedData = studResults;
      if (JSON.stringify(transformedData) !== JSON.stringify(results)) {
        setResults(transformedData);
      }
    }
  }, [userInfo, results]); // Only re-run the effect if userInfo or results change

  // Toggle the open state of a subject and reset its pagination
  const toggleSubject = (subject) => {
    setOpenSubjects((prevOpenSubjects) => ({
      ...prevOpenSubjects,
      [subject]: !prevOpenSubjects[subject],
    }));
    setCurrentPage((prevCurrentPage) => ({
      ...prevCurrentPage,
      [subject]: 1, // Reset to first page
    }));
  };

  // Pagination for a specific subject
  const paginate = (subject, pageNumber) => {
    setCurrentPage((prevCurrentPage) => ({
      ...prevCurrentPage,
      [subject]: pageNumber,
    }));
  };

  // Render pagination for a specific subject
  const renderPagination = (subject, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage[subject]}
          onClick={() => paginate(subject, number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  // Function to render results for each subject
  const renderResultsForSubject = (subjectResults) => {
    const totalResults = subjectResults.attempts.length;
    const indexOfLastResult =
      (currentPage[subjectResults.subject] || 1) * itemsPerPage;
    const indexOfFirstResult = indexOfLastResult - itemsPerPage;
    const currentSubjectResults = subjectResults.attempts.slice(
      indexOfFirstResult,
      indexOfLastResult
    );

    return (
      <Card className="mb-4" key={subjectResults.subject}>
        <Card.Header
          onClick={() => toggleSubject(subjectResults.subject)}
          style={{ cursor: "pointer" }}
        >
          {subjectResults.subject}
        </Card.Header>
        {openSubjects[subjectResults.subject] && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSubjectResults.map((attempt, idx) => {
                  // Calculate the absolute number based on the current page and items per page
                  const absoluteNumber = indexOfFirstResult + idx + 1;
                  return (
                    <tr key={idx}>
                      <td>{absoluteNumber}</td>
                      <td>{attempt.dateTime}</td>
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
                  );
                })}
              </tbody>
            </Table>
            {renderPagination(subjectResults.subject, totalResults)}
          </>
        )}
      </Card>
    );
  };

  // Check if there are no results
  console.log("stud results:\n", studResults);
  const noResultsAvailable = studResults.length === 0;

  return (
    <>
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
            </>
          ) : (
            <>
              <Col>
                {
                  studResults
                    .filter((_, index) => index % 2 === 0)
                    .map(renderResultsForSubject) // Render even indexed items
                }
              </Col>
              <Col lg={6} md={12}>
                {" "}
                {/* Right Column for larger screens, full width for smaller screens */}
                {
                  !noResultsAvailable &&
                    studResults
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

export default Testing;
