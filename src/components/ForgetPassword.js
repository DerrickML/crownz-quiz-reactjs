import React, { useState } from "react";
import { showToast } from "../utilities/toastUtil.js";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { account } from "../appwriteConfig.js";
import { rootUrl } from "../config.js";
import "./PasswordReset.css"; // Make sure this CSS file contains your desired styles

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  const resetLink = `${rootUrl}/password-reset`; // Adjust accordingly

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      setHideButton(true);
      const promise = account.createRecovery(email, resetLink);
      showToast(
        "Email reset link sent successfully. Please check your email",
        "success"
      );
      setHideButton(false);
    } catch (error) {
      console.error(error);
      setHideButton(false);
      throw new Error();
    }
  };

  return (
    <div className="passFgt-background">
      <Container className="mt-5 resetPassword">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="border-0 rounded-lg shadow">
              <Card.Body>
                <div className="text-center mb-4">
                  <FontAwesomeIcon
                    icon={faLock}
                    size="3x"
                    className="text-primary"
                  />
                  <h2>Password Reset</h2>
                  <p className="text-muted">
                    Enter your email address to receive a reset link.
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    hidden={hideButton}
                  >
                    Send Reset Link
                  </Button>
                </Form>

                {submitted && (
                  <Alert variant="success" className="mt-4">
                    Check your email for the reset link.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgetPassword;
