import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import PaymentMethods from './PaymentMethods_2';
import './Packages.css';
// import OrderSummery2 from './OrderSummery2'

const Packages = ({ studentInfo }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const packages = [
        // {
        //     tier: 'Starter Pack',
        //     points: 5,
        //     price: 5000,
        //     quizzes: 5,
        //     duration: 7,
        //     features: [
        //         // '100 points',
        //         `Attempt up to 5 exams`,
        //         'Expires in 7 days',
        //     ]
        // },
        // {
        //     tier: 'Pro Plan',
        //     points: 28,
        //     price: 20000,
        //     quizzes: 11,
        //     duration: 366,
        //     features: [
        //         // '560 points',
        //         `Attempt up to 28 exams`,
        //         'Expires in 1 year',
        //     ],
        // },
        // {
        //     tier: 'Elite Bundle',
        //     points: 17,
        //     price: 15000,
        //     quizzes: 17,
        //     duration: 30,
        //     features: [
        //         // '340 points',
        //         `Attempt up to 17 exams`,
        //         'Expires in 30 days',
        //     ],
        // },
        {
            tier: 'Elite Bundle',
            points: 1000,
            price: 75000,
            quizzes: 1000,
            duration: 366,
            features: [
                `Attempt up to 1,000`,
                'Expires after 366 days',
            ],
        },
    ];

    const handlePurchaseClick = (selectedPkg) => {
        setSelectedPackage(selectedPkg);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="justify-content-center"
            style={{ backgroundColor: 'hsl(240, 78%, 98%)' }}
        >
            <Row className="justify-content-md-center">
                <h2 className="text-center" style={{ paddingTop: '30px' }}>Choose Your Pack</h2>
                <div className="packages-container">
                    {packages.map((pkg, idx) => (
                        <Col key={idx} md={3} className="mb-3">
                            <Card
                                key={pkg.name}
                                className={`text-center package-card ${idx === 1 ? "middle-card" : ""}`}
                            >
                                <Card.Body className="card-body">
                                    <Card.Title
                                        className="package-tier"
                                        style={{
                                            color: `${idx === 1 ? 'white' : ''}`
                                        }}
                                    >
                                        {pkg.tier}
                                    </Card.Title>
                                    <Card.Text
                                        className="package-price"
                                        style={{
                                            color: `${idx === 1 ? 'white' : ''}`
                                        }}
                                    >
                                        UGX.{pkg.price}
                                    </Card.Text>
                                    <ul className="package-features">
                                        {pkg.features.map((feature, featureIdx) => (
                                            <li key={featureIdx} className="feature-item">
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant='outline-primary'
                                        className={`package-learn-more ${idx === 1 ? ' middle-button' : ''}`}
                                        onClick={() => handlePurchaseClick(pkg)}
                                    >
                                        Select Pack
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </div>
            </Row>

            {/* Modal for PaymentMethods */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Complete Your Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {selectedPackage && (
                        <>
                            <PaymentMethods
                                price={selectedPackage.price}
                                points={selectedPackage.points}
                                tier={selectedPackage.tier}
                                paymentFor={'points'}
                                studentInfo={studentInfo}
                            />
                        </>

                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Packages;
