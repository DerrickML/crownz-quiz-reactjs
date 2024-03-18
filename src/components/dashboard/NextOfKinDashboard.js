import React from "react";
import { Row, Col, Card, Table, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import storageUtil from "../../utilities/storageUtil";

const NextOfKinDashboard = () => {
  const navigate = useNavigate();

  // Fetch student data from local storage
  const linkedStudentsData = storageUtil.getItem("studentData") || [];

  // Function to get the most recent result of each student
  const getMostRecentResult = (results) => {
    if (!results || results.length === 0)
      return { subjectName: "N/A", recentScore: "N/A", lastExamDateTime: "N/A" };

    const mostRecent = results.reduce((latest, current) => {
      return new Date(latest.dateTime) > new Date(current.dateTime)
        ? latest
        : current;
    });

    return {
      subjectName: mostRecent.subject,
      recentScore: `${mostRecent.score}%`,
      results: mostRecent.resultDetails,
      lastExamDateTime: new Date(mostRecent.dateTime).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  //To view student results
  function viewResults(resultDetails, subjectName, totalMarks) {
    if (subjectName === "English Language") {
      navigate("/quiz-results", { state: { results: resultDetails } });
    }
    else {
      const questionsData = JSON.parse(resultDetails);
      navigate('/answers', { state: { questionsData, subjectName, totalMarks } });
    }
  }

  return (
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
                  <th>Subject</th>
                  <th>Last Exam Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {linkedStudentsData.map((student, index) => {
                  const { subjectName, recentScore, lastExamDateTime, results } =
                    getMostRecentResult(student.Results);
                  return (
                    <tr key={student.studID}>
                      <td>{index + 1}</td>
                      <td>{student.studName}</td>
                      <td>{recentScore}</td>
                      <td>{subjectName}</td>
                      <td>{lastExamDateTime}</td>
                      <td>
                        <ButtonGroup>
                          {results ? (
                            <Button
                              variant="primary"
                              //   size="sm"
                              onClick={() => viewResults(results, subjectName, recentScore)}
                              style={{ fontSize: '0.8rem' }}
                            >
                              Exam Results
                            </Button>
                          ) : null}
                          <Button
                            variant="success"
                            // size="sm"
                            onClick={() =>
                              navigate("/student-details", {
                                state: { student: student },
                              })
                            }
                            style={{ fontSize: '0.8rem' }}
                          >
                            Student Details
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default NextOfKinDashboard;
