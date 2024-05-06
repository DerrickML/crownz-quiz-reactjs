import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavigationCard from './NavigationCard'; // Import the NavigationCard component
import { faUsers, faUserCheck, faUserPlus, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { fetchStudents } from '../../utilities/fetchStudentData';
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    const { userInfo } = useAuth();

    //Fetch all students data
    const logRegistered = async () => {
        console.log("Fetching Registered students...");
    };

    //Fetch all subscribed students data
    const logSubscribed = () => console.log('Fetching subscribed students...');

    //Fetch all active students data
    const logActive = () => console.log('Fetching active students...');

    //Fetch all inactive students data
    const logInactive = () => console.log('Fetching inactive students...');

    return (
        <Container fluid>
            <Row className="justify-content-md-center" style={{ marginTop: '20px', gap: '20px' }}>
                <Col md={3}>
                    <NavigationCard
                        title="Registered Students"
                        icon={faUsers}
                        borderColor="#FF6347"
                        link="/registered-students"
                        number="320"
                        action={logRegistered}
                    />
                </Col>
                <Col md={3}>
                    <NavigationCard
                        title="Subscribed Students"
                        icon={faUserCheck}
                        borderColor="#FF4500"
                        link="/subscribed"
                        number="245"
                        action={logSubscribed}
                    />
                </Col>
                <Col md={3}>
                    <NavigationCard
                        title="Active Students"
                        icon={faUserPlus}
                        borderColor="#32CD32"
                        link="/active"
                        number="198"
                        action={logActive}
                    />
                </Col>
                <Col md={3}>
                    <NavigationCard
                        title="Inactive Students"
                        icon={faUserSlash}
                        borderColor="#20B2AA"
                        link="/inactive"
                        number="122"
                        action={logInactive}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
