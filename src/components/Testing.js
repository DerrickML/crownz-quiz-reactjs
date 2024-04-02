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
import { useAuth } from '../context/AuthContext';
import storageUtil from "../utilities/storageUtil"; // Import storageUtil
import "./ExamPage.css"; // Import custom CSS

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

function Testing() {
  const { userInfo, userPoints, userSubjectData } = useAuth();
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [enrollSubject, setEnrollSubject] = useState(null);

  // Get the subjects for the user's education level
  const subjects = userSubjectData || [];

  console.log("Subject Data: " + JSON.stringify(subjects));
  // const storedData = storageUtil.getItem("studentData");
  if (!subjects || !Array.isArray(subjects)) {
    throw new Error("No subjects data found in local storage.");
  }

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleEnroll = (subject) => {
    setEnrollSubject(subject);
  }

  const handleStartExam = () => {
    const subjectSlug = selectedSubject.name.toLowerCase().replace(/\s+/g, "-"); // Replaces spaces with hyphens
    const levelSlug = userInfo.educationLevel.toLowerCase();
    navigate(`/exam/${subjectSlug}_${levelSlug}`);
  };

  const handleEnrollment = (subject) => {
    console.log('Enrollment: ', subject);
  };

  const purchasePoints = () => {
    //Navigate to payment page
    navigate(`/select-package`)
  };

  return (
    <div className="exam-page-bg">
      <Container className="py-5">
        <h2 className="text-center mb-4">Select Your Exam Subject</h2>

        {/* Enrolled Subjects */}
        <h3 className="text-center mb-4 subject-header">Enrolled</h3>
        <Row className="subject-row">
          {subjects.map((subject, index) => (
            subject.enrolled && renderSubjectCard(subject, index, handleCardClick)
          ))}
        </Row>

        {/* Not Enrolled Subjects */}
        <h3 className="text-center mb-4 subject-header">Not Enrolled</h3>
        <Row className="subject-row">
          {subjects.map((subject, index) => (
            !subject.enrolled && renderSubjectCard(subject, index, handleEnroll)
          ))}
        </Row>

        <Modal
          show={selectedSubject !== null}
          onHide={() => setSelectedSubject(null)}
          centered
          style={{
            borderColor: selectedSubject?.color || "rgb(6, 63, 90) ",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedSubject?.name} Exam</Modal.Title>
          </Modal.Header>
          {
            userPoints < 20 ?
              <>
                <Modal.Body>
                  <p>The points are not sufficient enough to attempt an exam. Your require a minimum of 20 points to attempt an exam.</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedSubject(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={purchasePoints}
                    style={{
                      backgroundColor: selectedSubject?.color || "rgb(6, 63, 90) ",
                    }}
                  >
                    Purchase Points
                  </Button>
                </Modal.Footer>
              </>
              :
              <>
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
                  <Button
                    onClick={handleStartExam}
                    style={{
                      backgroundColor: selectedSubject?.color || "rgb(6, 63, 90) ",
                    }}
                  >
                    Start Exam
                  </Button>
                </Modal.Footer>
              </>
          }
        </Modal>

        {/* Modal to enroll for a subject */}
        <Modal
          show={enrollSubject !== null}
          onHide={() => setEnrollSubject(null)}
          centered
          style={{
            borderColor: enrollSubject?.color || "rgb(6, 63, 90) ",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{enrollSubject?.name} Exam</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{enrollSubject?.description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setEnrollSubject(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => handleEnrollment(enrollSubject)}
              style={{
                backgroundColor: enrollSubject?.color || "rgb(6, 63, 90) ",
              }}
            >
              Enroll
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );

  function renderSubjectCard(subject, index, onClick) {
    const cardStyle = subject.enrolled
      ? { borderColor: subject.color || "#000", color: subject.color || "#000" }
      : { borderColor: "#d3d3d3", color: "#000" }; // Grey color for not enrolled

    return (
      <Col key={index} md={6} lg={4} className="mb-4">
        <Card
          className="subject-card"
          onClick={() => onClick(subject)}
          style={cardStyle}
        >
          <Card.Body className="text-center">
            <FontAwesomeIcon
              icon={iconMapping[subject.icon]}
              size="4x"
              style={{ color: cardStyle.color }}
            />
            <Card.Title className="mt-3">{subject.name}</Card.Title>
          </Card.Body>
        </Card>
      </Col>
    );
  }

}

export default Testing;
