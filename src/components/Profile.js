import React, { useState, useEffect, useRef } from "react"; // Import useState
import useLinkedStudents from "../hooks/useLinkedStudents";
import storageUtil from "../utilities/storageUtil";

const Profile = () => {
  //Fetch sessionInfo from localStorage
  const userInfo = storageUtil.getItem("userInfo");

  const sessionData = storageUtil.getItem("sessionInfo");
  const kinId = sessionData.userId;
  const linkedStudents = useLinkedStudents(kinId);

  //Check user type
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");

  //Pagination purposes
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = linkedStudents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderNextOfKinProfile = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Linked Students</h5>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Education Level</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((student) => (
              <tr key={student.studID}>
                <td>{student.Name}</td>
                <td>{student.educationLevel}</td>
                <td>
                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(linkedStudents.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((number) => (
              <li
                key={number}
                className={`page-item ${
                  currentPage === number ? "active" : ""
                }`}
              >
                <a
                  onClick={() => paginate(number)}
                  href="#"
                  className="page-link"
                >
                  {number}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  const renderStudentProfile = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Education & School Details</h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <i className="bi bi-building me-2"></i>
            <strong>School Name:</strong> {userInfo.schoolName}
          </li>
          <li className="list-group-item">
            <i className="bi bi-geo-alt me-2"></i>
            <strong>School Address:</strong> {userInfo.schoolAddress}
          </li>
          <li className="list-group-item">
            <i className="bi bi-bookmark me-2"></i>
            <strong>Education Level:</strong> {userInfo.educationLevel}
          </li>
          {/* Additional student-specific content */}
        </ul>
      </div>
    </div>
  );

  const renderNextOfKinDetails = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Next of Kin</h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <i className="bi bi-building me-2"></i>
            <strong>Name:</strong> John Doe
          </li>
          <li className="list-group-item">
            <i className="bi bi-geo-alt me-2"></i>
            <strong>Email Address:</strong> johndoe@mail.com
          </li>
          <li className="list-group-item">
            <i className="bi bi-bookmark me-2"></i>
            <strong>Telephone:</strong> +256 (0) 712345678
          </li>
          {/* Additional student-specific content */}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container my-4">
      <div className="profile-header card bg-primary text-white text-center p-4 mb-4">
        <h2 className="mb-0">
          {userInfo.firstName} {userInfo.lastName}
        </h2>
        <p className="lead">{userInfo.labels[0]} Profile</p>
        {/* Optional: Profile Image */}
        {/* <img src="path_to_profile_image.jpg" className="card-img-top rounded-circle" alt="Profile" /> */}
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a
            className="nav-link active"
            href="#personalDetails"
            data-bs-toggle="tab"
          >
            Personal Details
          </a>
        </li>
        {isStudent && (
          <>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#educationDetails"
                data-bs-toggle="tab"
              >
                Education Details
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#nextOfKinDetails"
                data-bs-toggle="tab"
              >
                Next of Kin Details
              </a>
            </li>
          </>
        )}
        {isNextOfKin && (
          <li className="nav-item">
            <a className="nav-link" href="#linkedStudents" data-bs-toggle="tab">
              Linked Students
            </a>
          </li>
        )}
      </ul>

      <div className="tab-content">
        <div className="tab-pane active" id="personalDetails">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Contact Information</h5>
              <p className="card-text">
                <strong>Email:</strong> {userInfo.email}
              </p>
              {userInfo.phone && (
                <p className="card-text">
                  <strong>Phone:</strong> {userInfo.phone}
                </p>
              )}
              {isStudent && (
                <p className="card-text">
                  <strong>Gender:</strong> {userInfo.gender}
                </p>
              )}
            </div>
          </div>
        </div>

        {isStudent && (
          <>
            <div className="tab-pane" id="educationDetails">
              {renderStudentProfile()}
            </div>
            <div className="tab-pane" id="nextOfKinDetails">
              {renderNextOfKinDetails()}
            </div>
          </>
        )}

        {isNextOfKin && (
          <div className="tab-pane" id="linkedStudents">
            {renderNextOfKinProfile()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
