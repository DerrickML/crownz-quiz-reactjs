import React, { useState, useEffect, useRef } from "react";
import Iframe from "react-iframe";
import {
  Container,
  Button,
  Spinner,
  Card,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {
  databases,
  database_id,
  studentMarksTable_id,
} from "../appwriteConfig.js";
import { showToast } from "../utilities/toastUtil.js";
import {
  fetchAndUpdateResults,
} from "../utilities/resultsUtil";
import { useAuth } from '../context/AuthContext';
import "./IframeComponent.css";

const IframeComponent = ({ url }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // State for tracking completion
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [timer, setTimer] = useState(3600); // 1 hour in seconds for example --This will be a prop passed
  const [capturedTime, setCapturedTime] = useState(null);
  const timerIntervalRef = useRef(); // Ref for the timer interval
  const navigate = useNavigate();

  const urlWhitelist = [
    window.location.origin,
    "http://localhost:5173/",
    "https://derrickml.com",
    "https://exams.crownz.derrickml.com/public/",
    "http://127.0.0.1:5500/",
    "http://127.0.0.1:5501/",
    "http://127.0.0.1:5500/english_ple/",
    // Add other URLs here
  ];

  //To send to database
  const { userInfo } = useAuth();
  let studentID = userInfo.userId;

  const canDisplayUrl = urlWhitelist.includes(url);

  // Modified sendMessageToIframe to only send message after confirmation
  const sendMessageToIframe = () => {
    stopAndCaptureTimer();
    const iframe = document.getElementById("myIframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage("callEvaluateAllAnswers", "*");
      setButtonClicked(true);
    }
  };

  const createDocument = async (data) => {
    try {
      setIsLoading(true); // Start loading
      const result = await databases.createDocument(
        database_id,
        studentMarksTable_id,
        "unique()",
        data
      );
      console.log("Document created:", result);
      setIsCompleted(true); // Set completion to true on success
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or error
    }
  };

  // Event listener to receive messages from the iframe
  useEffect(() => {
    const receiveMessage = async (event) => {
      // Perform checks on event.origin here if needed for security

      // Check if the message is received after the button click
      if (buttonClicked && event.data && typeof event.data === "object") {
        console.log("Message received: ", event.data);
        const { marksObtained, results } = event.data;

        // Convert results to a JSON string before sending
        const resultsString = JSON.stringify(results);

        console.log("To Appwrite:\n", resultsString);

        // Create a document in Appwrite Collection
        await createDocument({
          studID: studentID,
          marks: marksObtained,
          subject: "English",
          results: resultsString,
        });

        console.log("Exam finished in: ", capturedTime);

        setButtonClicked(false);
      }
    };

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [buttonClicked]);

  const handleExitExam = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    navigate("/exam-page");
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    sendMessageToIframe();
    await fetchAndUpdateResults(userInfo.userId);
    setShowSubmitModal(false);
  };

  // Timer controler
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      showToast(
        "Time's up! The exam is being submitted automatically.",
        "info"
      );
      stopAndCaptureTimer();
      confirmSubmit();
    } else if (timer < 0) {
      setTimer(0); // Ensure timer doesn't go below zero
    }
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const stopAndCaptureTimer = () => {
    clearInterval(timerIntervalRef.current); // Stop the timer
    setCapturedTime(timer); // Capture the current time
  };

  return (
    <Container fluid="true" className="iframe-container">
      {canDisplayUrl ? (
        <>
          <Row className="justify-content-center my-1">
            <Col md={6} lg={4}>
              <Card className="text-center timer-card">
                <Card.Body>
                  <FontAwesomeIcon icon={faClock} className="timer-icon" />
                  <span className="timer-text">{formatTime()}</span>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="iframe-card">
            <Iframe src={url} id="myIframe" className="iframe-content" />
          </Card>

          {!isCompleted && (
            <div className="exam-controls bg-dark">
              <Button
                variant="success"
                onClick={handleConfirmSubmit}
                disabled={isLoading}
                className="w-25"
              >
                {isLoading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Submit Exam"
                )}
              </Button>
              <Button
                variant="danger"
                onClick={handleExitExam}
                className="w-25"
              >
                Exit Exam
              </Button>
            </div>
          )}

          {/* Modal for exit confirmation */}
          <Modal
            show={showExitModal}
            onHide={() => setShowExitModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Exit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to exit the exam? Your progress may not be
              saved.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowExitModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmExit}>
                Confirm Exit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal for submit confirmation */}
          <Modal
            show={showSubmitModal}
            onHide={() => setShowSubmitModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Submission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to submit your answers? You cannot change
              them after submission.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmSubmit}>
                Confirm Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <p>URL not allowed for embedding.</p>
      )}
    </Container>
  );
};

export default IframeComponent;
