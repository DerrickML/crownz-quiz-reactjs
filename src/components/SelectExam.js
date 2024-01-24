import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faCalculator,
  faGlobeAmericas,
  faBookOpen,
  faDna,
  faMountain,
  faLandmark,
  faChartLine,
  faFlask,
  faPalette,
  faSeedling,
  faPray,
  faBookReader,
  faLanguage,
  faComputer,
  faRunning,
  faBible,
  faLightbulb,
  faSpellCheck,
  faMusic,
  faFootballBall,
  faSquareRootAlt,
  faPencilRuler,
  faAtom,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import storageUtil from "../utilities/storageUtil";
import "./ExamPage.css"; // Import custom CSS

import subjectData from "../otherFiles/subject_data.json"; // Import the subject data

// Map the icon string from JSON to the actual FontAwesomeIcon component
const iconMapping = {
  faMicroscope: faMicroscope,
  faCalculator: faCalculator,
  faGlobeAmericas: faGlobeAmericas,
  faBookOpen: faBookOpen,
  faDna: faDna,
  faMountain: faMountain,
  faLandmark: faLandmark,
  faChartLine: faChartLine,
  faFlask: faFlask,
  faPalette: faPalette,
  faSeedling: faSeedling,
  faPray: faPray,
  faBookReader: faBookReader,
  faLanguage: faLanguage,
  faComputer: faComputer,
  faRunning: faRunning,
  faBible: faBible,
  faLightbulb: faLightbulb,
  faSpellCheck: faSpellCheck,
  faMusic: faMusic,
  faFootballBall: faFootballBall,
  faSquareRootAlt: faSquareRootAlt,
  faPencilRuler: faPencilRuler,
  faAtom: faAtom,
};

function SelectExam() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  //Fetch sessionInfo from localStorage
  const userInfo = storageUtil.getItem("userInfo");
  const navigate = useNavigate();

  // Get the subjects for the user's education level
  const subjects = subjectData[userInfo.educationLevel] || [];

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleStartExam = () => {
    const subjectSlug = selectedSubject.name.toLowerCase().replace(/\s+/g, "-"); // Replaces spaces with hyphens
    const levelSlug = userInfo.educationLevel.toLowerCase();
    navigate(`/exam/${subjectSlug}_${levelSlug}`);
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
                  <FontAwesomeIcon icon={iconMapping[subject.icon]} size="4x" />
                  <Card.Title className="mt-3">{subject.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

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
            <Button
              variant="secondary"
              onClick={() => setSelectedSubject(null)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleStartExam}>
              Start Exam
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default SelectExam;
