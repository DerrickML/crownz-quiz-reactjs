// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserCircle, faCoins, faArrowUp, faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Button, Alert, Badge, Card } from "react-bootstrap";
import storageUtil from "../utilities/storageUtil";
import { useAuth } from "../context/AuthContext";
import "../animations.css";
import HeroHeader from "./HeroHeader";
import "./Home.css";
import StudentDashboard from "./dashboard/StudentDashboard";
import NextOfKinDashboard from "./dashboard/NextOfKinDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import { fetchStudents, fetchTransactions } from "../utilities/fetchStudentData";

function Home() {
  const navigate = useNavigate();
  const { userInfo, userPoints, updateUserPoints, fetchUserPoints, } = useAuth();
  // const userInfo = storageUtil.getItem("userInfo");
  const isStudent = userInfo.labels.includes("student");
  const isNextOfKin = userInfo.labels.includes("kin");
  const isAdmin = userInfo.labels.includes("admin");
  const isSales = userInfo.labels.includes("sales") || userInfo.labels.includes("admin");

  const testFunc = async () => {
    //Fetch all students data
    console.log("Checking whether user is an admin or staff");
    if (userInfo.labels.includes("admin") || userInfo.labels.includes("staff")) {
      console.log('Fetching student data');
      await fetchStudents().then(data => {
        console.log('Students data Fetch successfully');
      }).catch(error => {
        console.error('Failed to fetch students');
      });

      console.log('Fetching transactions data');
      await fetchTransactions().then(data => {
        console.log('Transactions data Fetch successfully');
      }).catch(error => {
        console.error('Failed to fetch transactions data');
      });
    }
  }

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
            <>
              <Col md="auto">
                <Button variant="secondary" onClick={() => navigate("/exam-page")}>
                  <FontAwesomeIcon icon={faEdit} /> Attempt Exam
                </Button>
              </Col>
              <div className="d-flex justify-content-center">
                {isSales && (
                  <>
                    <Card style={{ width: 'auto' }} className="text-center my-4">
                      <Card.Body>
                        <Button variant="outline-primary" onClick={() => testFunc()}>
                          <FontAwesomeIcon icon={faArrowCircleUp} className="me-2" />
                          Initiate IndexDB
                        </Button>
                      </Card.Body>
                    </Card>
                    {/*POINTS TRACKING DISPLAY*/}
                    <Card style={{ width: 'auto' }} className="text-center my-4">
                      <Card.Header as="h5">
                        <FontAwesomeIcon icon={faCoins} className="me-2" /> Points Available
                      </Card.Header>
                      <Card.Body>
                        <Card.Title style={{ fontSize: '2.5rem' }}>{userPoints}</Card.Title>
                        <Button variant="outline-primary" onClick={() => navigate('/select-package')}>
                          <FontAwesomeIcon icon={faArrowCircleUp} className="me-2" />
                          Top Up Points
                        </Button>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </div>
            </>
          )}
        </Row>
      </Container>
    </HeroHeader>
  );

  return (
    <>
      {renderHeroHeader()}
      <Container fluid>
        {isAdmin ? <AdminDashboard /> :
          <>
            {isStudent && <StudentDashboard />}
            {isNextOfKin && <NextOfKinDashboard />}
          </>
        }
      </Container >
    </>
  );
}

export default Home;
