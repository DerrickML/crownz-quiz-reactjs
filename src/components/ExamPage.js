import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalculator } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ExamPage.css"; // Import custom CSS

const subjects = [
  {
    name: "English",
    icon: faBook,
    description: "Dive into the depths of English literature and grammar.",
  },
  {
    name: "Mathematics",
    icon: faCalculator,
    description: "Challenge yourself with numbers and equations.",
  },
  // Add more subjects here
];

function ExamPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleStartExam = () => {
    navigate(`/exam/${selectedSubject.name.toLowerCase()}`);
  };

  return (
    <div className="exam-page-bg">
      <Container className="py-5">
        <h2 className="text-center mb-4">Select Your Exam Subject</h2>
        <Row className="justify-content-center">
          {subjects.map((subject, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card
                className="subject-card h-100"
                onClick={() => handleCardClick(subject)}
              >
                <Card.Body className="text-center">
                  <FontAwesomeIcon icon={subject.icon} size="4x" />
                  <Card.Title className="mt-3">{subject.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal
        show={selectedSubject !== null}
        onHide={() => setSelectedSubject(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedSubject?.name} Exam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedSubject?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedSubject(null)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleStartExam}>
            Start Exam
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExamPage;
