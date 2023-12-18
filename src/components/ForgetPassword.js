import React from "react";
import { Link } from "react-router-dom"; // Ensure you have react-router-dom installed

function ForgetPassword() {
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the forget password logic here
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Reset Password</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
              />
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary">
                Send Password Reset Link
              </button>
            </div>
            <p className="text-end mt-3">
              <Link to="/sign-in">Back to login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
