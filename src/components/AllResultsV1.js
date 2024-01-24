import React, { useState, useEffect } from "react";
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
import {
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  studentMarksTable_id,
  Permission,
  Role,
  Query,
} from "../appwriteConfig";
import storageUtil from "../utilities/storageUtil";

const AllResults = ({ userInfo, sessionInfo }) => {
  // State to track the open state of each subject
  const [openSubjects, setOpenSubjects] = useState({});

  // Determine which results to display based on education level
  let results;
  /*----DYNAMICALLY RENDERS FROM CLIENT SIDE---*/
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
  /*--------*/
  /*----DYNAMICALLY RENDERS FROM APPWRITE-DATABASE---*/
  async function fetchResults() {
    try {
      const response = await databases.listDocuments(
        database_id,
        studentMarksTable_id,
        [Query.equal("studID", sessionInfo.userId)]
      );
      console.log(
        `Students Results retrieved for ${sessionInfo.userId}: `,
        response
      );

      return response;
    } catch (error) {
      console.log("Failed to retrieve student results:\n", error);
    }
  }
  const [aResults, setaResults] = useState([]);

  let dbResults = fetchResults(sessionInfo.userId);

  const fetchData = async () => {
    // Fetch data from your API
    const response = await fetchResults();
    const transformedData = transformData(response.documents);
    setaResults(transformedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function formatDate(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function transformData(data) {
    const resultsMap = new Map();

    data.forEach((doc) => {
      const subject = doc.subject;
      const date = formatDate(doc.dateTime);
      const score = doc.marks + "%"; // Since marks are already in percentage

      if (!resultsMap.has(subject)) {
        resultsMap.set(subject, { subject, attempts: [] });
      }

      resultsMap.get(subject).attempts.push({ date, score });
    });

    return Array.from(resultsMap.values());
  }

  console.log(
    `Transformed Students Results retrieved for ${sessionInfo.userId}: `,
    aResults
  );

  /*--------*/

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
                    onClick={() => fetchResults(sessionInfo.userId)}
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
