import React, { useState } from 'react';
import { Container, Nav, Tab, Row, Col, Button, Modal, Accordion, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PaymentMethods.css'
import AirtelMoney from './AirtelMoney';
import CardPayment from './CardPayment';
import MtnMomo from './MtnMomo';

function PaymentMethods() {

    const serverUrl = "https://2wkvf7-3000.csb.app"

    const [showModal, setShowModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleOpenModal = (method) => {
        setSelectedMethod(method);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Select Payment Method</Card.Title>
                            <Button className="custom-button" onClick={() => handleOpenModal('mobileMoney')}>
                                <FontAwesomeIcon icon={faMobileAlt} /> Mobile Money
                            </Button>
                            <Button variant="secondary" className="m-2" onClick={() => handleOpenModal('card')}>
                                <FontAwesomeIcon icon={faCreditCard} /> Card
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal className="custom-modal" show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedMethod === 'mobileMoney' ? 'Mobile Money Payment' : 'Card Payment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMethod === 'mobileMoney' && (
                        <Tab.Container id="payment-tabs" defaultActiveKey="first">
                            <Row>
                                <Col sm={12}>
                                    <Nav variant="pills" className="payment-nav">
                                        <Nav.Item>
                                            <Nav.Link eventKey="first" className="payment-nav-link">
                                                <img src={`${serverUrl}/images/mtnmomo.png`} alt="MTN Logo" className="payment-logo" />
                                                MTN Mobile Money
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second" className="payment-nav-link">
                                                <img src={`${serverUrl}/images/airtel-logo.png`} alt="Airtel Logo" className="payment-logo" />
                                                Airtel Money
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="first">
                                            <MtnMomo />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            <AirtelMoney />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    )}
                    {selectedMethod === 'card' && <CardPayment />}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default PaymentMethods;
