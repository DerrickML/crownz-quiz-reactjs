// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Container, Button } from "react-bootstrap";
import storageUtil from "../utilities/storageUtil";
import { useAuth } from "../context/AuthContext";
import "../animations.css";
import HeroHeader from "./HeroHeader";
import "./Home.css";
import StudentDashboard from "./dashboard/StudentDashboard";
import NextOfKinDashboard from "./dashboard/NextOfKinDashboard";

function Home() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  // const userInfo = storageUtil.getItem("userInfo");
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");

  const renderHeroHeader = () => (
    <HeroHeader>
      <h1 className="display-4">
        Welcome to Your Dashboard, {userInfo.firstName}!
      </h1>
      <p className="lead">
        {isStudent
          ? "Explore your academic journey, track progress, and excel in your studies."
          : "Stay informed about your child's academic journey, track their progress, and support their success."}
      </p>
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="light"
          className="me-2"
          onClick={() => navigate("/profile")}
        >
          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
          View Profile
        </Button>
        {isStudent && (
          <Button variant="secondary" onClick={() => navigate("/exam-page")}>
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Attempt Exam
          </Button>
        )}
      </div>
    </HeroHeader>
  );

  return (
    <>
      {renderHeroHeader()}
      <Container fluid>
        {isStudent && <StudentDashboard />}
        {isNextOfKin && <NextOfKinDashboard />}
      </Container>
    </>
  );
}

export default Home;
