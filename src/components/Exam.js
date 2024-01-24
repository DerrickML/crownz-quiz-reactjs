import React, { useState } from "react";
import IframeComponent from "./IframeComponent";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Exam({ subject }) {
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showUnavailableModal, setShowUnavailableModal] = useState(
    subject !== "english-language_ple"
  );

  const navigate = useNavigate();

  const handleProceed = () => {
    setShowInstructionsModal(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCloseUnavailableModal = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      {subject === "english-language_ple" ? (
        <>
          <Modal show={showInstructionsModal} onHide={() => {}} centered>
            <Modal.Header>
              <Modal.Title>Exam Instructions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Here are the instructions for your exam:</p>
              <ul>
                <li>Read each question carefully.</li>
                <li>Ensure you answer all questions.</li>
                <li>Do not refresh the page during the exam.</li>
                {/* Add more instructions as needed */}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleProceed}>
                Proceed to Exam
              </Button>
            </Modal.Footer>
          </Modal>
          {!showInstructionsModal && (
            <IframeComponent url="http://localhost:5173/" />
          )}
        </>
      ) : (
        <Modal show={showUnavailableModal} onHide={() => {}} centered>
          <Modal.Header>
            <Modal.Title>Exam Unavailable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Currently, the exam for the selected subject is not available.
              Please check back later.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseUnavailableModal}>
              Go Back
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Exam;
