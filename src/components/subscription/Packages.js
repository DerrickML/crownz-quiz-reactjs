import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import PaymentMethods from './PaymentMethods';
import './Packages.css'; // Your custom CSS file

const Packages = ({ studentInfo }) => {
    /*
    studentInfo {
        id:
        name:
        educationLevel
    }
    */
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const packages = [
        {
            name: 'Bronze',
            points: 100,
            price: 5000,
            quizzes: 5,
            duration: '1 week',
            color: 'bronze', // You would define this color in your CSS
        },
        {
            name: 'Silver',
            points: 200,
            price: 15000,
            quizzes: 11,
            duration: '1 month',
            color: 'silver', // You would define this color in your CSS
        },
        {
            name: 'Gold',
            points: 500,
            price: 20000,
            quizzes: 28,
            duration: '1 year',
            color: 'gold', // You would define this color in your CSS
        },
    ];

    const handlePurchaseClick = (selectedPkg) => {
        // Handle the purchase logic here
        console.log(`Purchasing package: ${selectedPkg.name}`);
        setSelectedPackage(selectedPkg);
        setShowModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <Container style={{ background: '' }}>
            <Row className="justify-content-center my-5">
                <h2 className="text-center mb-4 w-100">Choose Your Pack</h2>
                {packages.map((pkg) => (
                    <Col key={pkg.name} lg={4} className="d-flex justify-content-center">
                        <Card className={`text-center package-card ${pkg.color} shadow-lg`} style={{ width: '18rem', height: '30rem' }}>
                            <Card.Header>
                                <FontAwesomeIcon icon={faGem} className="package-icon" />
                                {pkg.name}
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Title>{pkg.points} points</Card.Title>
                                <Card.Text>
                                    Attempt up to {pkg.quizzes} quizzes
                                    <br />
                                    Expires in {pkg.duration}
                                </Card.Text>
                                <Button variant="primary" onClick={() => handlePurchaseClick(pkg)}>
                                    Buy for UGX.{pkg.price}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal for PaymentMethods */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                backdrop="static" // Prevents closing when clicking outside
                keyboard={false}  // Prevents closing with the keyboard 'esc' key
                centered // Center the modal vertically
                size="lg" // Large size modal
                dialogClassName="modal-70w" // Custom width clas
            >
                <Modal.Header>
                    <Modal.Title>Complete Your Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display PaymentMethods component within the modal */}
                    {selectedPackage && (
                        <PaymentMethods
                            price={selectedPackage.price}
                            paymentFor={'points'}
                            points={selectedPackage.points}
                            studentInfo={studentInfo}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>        </Container>
    );
};

export default Packages;
