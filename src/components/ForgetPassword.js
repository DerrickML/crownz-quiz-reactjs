import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utilities/toastUtil.js";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { account } from "../appwriteConfig.js";

import "./PasswordReset.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  //Link to be redirected to when password reset is initiated
  const resetLink = "http://localhost:3000/password-reset";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here, you would normally integrate with your backend to send the reset link
    try {
      const promise = account.createRecovery(email, resetLink);
      showToast(
        "Email reset link sent successfully. Please check your email",
        "success"
      );
      console.log("Reset link sent to:", email);
    } catch (error) {
      console.log(error); // Failure
      throw new Error();
    }
    console.log("Reset link sent to:", email);
  };

  return (
    <Container className="mt-5 resetPassword">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Password Reset</h2>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send Reset Link
            </Button>
          </Form>

          {submitted && (
            <Alert variant="success" className="mt-3">
              A password reset link has been sent to your email.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgetPassword;
