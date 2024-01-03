import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function Testing() {
  const [showToast, setShowToast] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic here
    if (formData.email === "" || formData.password === "") {
      setShowToast(true);
      // setShowOverlay(true); // Show the overlay
    } else {
      // Submit form logic
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Overlay */}
      {showOverlay && <div className="overlay"></div>}
      {/* <div className="overlay"></div> */}

      {/* Form Container */}
      <div className={showOverlay ? "content-blur" : ""}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      </div>

      <ToastContainer className="p-3" position="top-end">
        <Toast
          onClose={() => {
            setShowToast(false);
            setShowOverlay(false); // Hide the overlay
          }}
          show={showToast}
          delay={30000}
          autohide
          bg="danger" // Changed to danger
        >
          <Toast.Header closeButton={false} className="text-white">
            <strong className="me-auto">Signup Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please fill in all fields.
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Custom CSS */}
      <style type="text/css">
        {`
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1040; // Below the toast but above everything else
          }
          .content-blur {
            filter: blur(2px);
          }
        `}
      </style>
    </>
  );
}

export default Testing;
