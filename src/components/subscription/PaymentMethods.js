import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AirtelMoney from './AirtelMoney';
import CardPayment from './CardPayment';
import MtnMomo from './MtnMomo';

function PaymentMethods() {
    const [selectedMethod, setSelectedMethod] = useState('');

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Body>

                            {/* MTN MoMo Payment */}
                            <Card.Title>Select Payment Method</Card.Title>
                            <Button variant="warning" className="m-2" onClick={() => setSelectedMethod('mtnMomo')}>
                                MTN Mobile Money
                            </Button>
                            {selectedMethod === 'mtnMomo' && <MtnMomo />}

                            {/* Airtel Money Payment */}
                            <Button variant="danger" className="m-2" onClick={() => setSelectedMethod('mobileMoney')}>
                                Airtel Money
                            </Button>
                            {selectedMethod === 'mobileMoney' && <AirtelMoney />}

                            {/* Card Payment */}
                            {/* <CardPayment /> */}

                            <Button variant="dark" className="m-2" onClick={() => setSelectedMethod('card')} >
                                Card
                            </Button>
                            {selectedMethod === 'card' && <CardPayment />}


                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentMethods;
