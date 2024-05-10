import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavigationCard from './NavigationCard'; // Import the NavigationCard component
import { faUsers, faUserCheck, faUserPlus, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { fetchStudents } from '../../utilities/fetchStudentData';
import { useAuth } from "../../context/AuthContext";
import db from '../../db';

const AdminDashboard = () => {
    const { userInfo } = useAuth();
    const [registeredCount, setRegisteredCount] = useState(0);
    const [subscribedCount, setSubscribedCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const registeredStudents = await db.students.count();
            const subscribedStudents = await db.students.where('pointsBalance').belowOrEqual(1).count();
            const activeStudents = await db.students.where('accountStatus').equals('Active').count();
            const inactiveStudents = await db.students.where('accountStatus').equals('Inactive').count();

            setRegisteredCount(registeredStudents);
            setSubscribedCount(subscribedStudents);
            setActiveCount(activeStudents);
            setInactiveCount(inactiveStudents);
        };

        fetchData();
    }, []);

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
                        number={registeredCount}
                        action={logRegistered}
                    />
                </Col>
                <Col md={3}>
                    <NavigationCard
                        title="Subscribed Students"
                        icon={faUserCheck}
                        borderColor="#FF4500"
                        link="/subscribed"
                        number={subscribedCount}
                        action={logSubscribed}
                    />
                </Col>
                <Col md={3}>
                    <NavigationCard
                        title="Active Students"
                        icon={faUserPlus}
                        borderColor="#32CD32"
                        link="/active"
                        number={activeCount}
                        action={logActive}
                    />
                </Col>
                <Col md={3}>
                    <NavigationCard
                        title="Inactive Students"
                        icon={faUserSlash}
                        borderColor="#20B2AA"
                        link="/inactive"
                        number={inactiveCount}
                        action={logInactive}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
