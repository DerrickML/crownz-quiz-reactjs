import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utilities/toastUtil.js";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { account } from "../appwriteConfig.js";

import "./PasswordReset.css";

function PasswordReset() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");
    try {
      // Handle password reset logic here
      const promise = account.updateRecovery(
        userId,
        secret,
        password,
        password
      );
      showToast("Password has been successfully reset", "success");
      console.log(email, password, repeatPassword);
      navigate("/sign-in"); //Redirect to login page
    } catch (error) {
      console.log(error); // Failure
      throw error;
    }
  };

  return (
    <Container className="mt-5 resetPassword">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Reset Your Password</h2>
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

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
              <Form.Label>Repeat New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                isInvalid={!passwordsMatch}
                required
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match.
              </Form.Control.Feedback>
            </Form.Group>

            {!passwordsMatch && (
              <Alert variant="danger">
                The passwords you entered do not match.
              </Alert>
            )}

            <Button variant="primary" type="submit">
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default PasswordReset;
