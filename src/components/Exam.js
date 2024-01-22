import React, { useState } from "react";
import IframeComponent from "./IframeComponent";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Exam({ subject }) {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleProceed = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <>
      {subject === "english" ? (
        <>
          <Modal show={showModal} onHide={() => {}} centered>
            <Modal.Header>
              <Modal.Title>English Exam Instructions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Here are the instructions for your English exam:</p>
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
          {!showModal && <IframeComponent url="http://localhost:5173/" />}
        </>
      ) : (
        "No subject selected"
      )}
    </>
  );
}

export default Exam;
