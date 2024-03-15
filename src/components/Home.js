// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Button, Alert, Badge } from "react-bootstrap";
import storageUtil from "../utilities/storageUtil";
import { useAuth } from "../context/AuthContext";
import "../animations.css";
import HeroHeader from "./HeroHeader";
import "./Home.css";
import StudentDashboard from "./dashboard/StudentDashboard";
import NextOfKinDashboard from "./dashboard/NextOfKinDashboard";

function Home() {
  const navigate = useNavigate();
  const { userInfo, userPoints, updateUserPoints, fetchUserPoints, } = useAuth();
  // const userInfo = storageUtil.getItem("userInfo");
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");

  const renderHeroHeader = () => (
    <HeroHeader>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <h1 className="display-4">
              Welcome to Your Dashboard, {userInfo.firstName}!
            </h1>
            <p className="lead">
              {isStudent
                ? "Explore your academic journey, track progress, and excel in your studies."
                : "Stay informed about your child's academic journey, track their progress, and support their success."}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-4">
          <Col md="auto">
            <Button variant="light" onClick={() => navigate("/profile")}>
              <FontAwesomeIcon icon={faUserCircle} /> View Profile
            </Button>
          </Col>
          {isStudent && (
            <Col md="auto">
              <Button variant="secondary" onClick={() => navigate("/exam-page")}>
                <FontAwesomeIcon icon={faEdit} /> Attempt Exam
              </Button>
            </Col>
          )}
        </Row>
        <Row className="justify-content-md-center mt-4">
          <Col md={8}>
            <Alert variant="primary" className="d-flex align-items-center">
              <div className="flex-grow-1">
                Points Left: <Badge bg="dark">{userPoints}</Badge>
              </div>
              <div>
                <Button variant="success" onClick={() => fetchUserPoints(userInfo.userId, userInfo.educationLevel)}>
                  <FontAwesomeIcon icon={faEdit} /> Fetching points
                </Button>
                <Button variant="warning" onClick={() => updateUserPoints(20, userInfo.userId)}>
                  <FontAwesomeIcon icon={faEdit} /> Attempt Exam
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
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
