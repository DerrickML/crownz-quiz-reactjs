// EmailSignupFields.js
import React from "react";
import Form from "react-bootstrap/Form";
import PhoneInput from "react-phone-number-input";

const EmailSignupFields = ({
  email,
  setEmail,
  password,
  setPassword,
  phone,
  setPhone,
  phoneError,
}) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Email Address</Form.Label>
      <Form.Control
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        required
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Provide a Strong Password</Form.Label>
      <Form.Control
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Phone Number (Optional)</Form.Label>
      <PhoneInput
        className={`form-control ${phoneError ? "is-invalid" : ""}`}
        value={phone}
        onChange={setPhone}
        placeholder="Enter phone number"
      />
      {phoneError && (
        <Form.Control.Feedback type="invalid">
          Invalid phone number
        </Form.Control.Feedback>
      )}
    </Form.Group>
  </>
);

export default EmailSignupFields;
