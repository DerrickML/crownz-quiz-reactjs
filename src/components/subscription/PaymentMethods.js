import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import MobileMoney from './MobileMoney'; // Make sure this path is correct
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
                            <Card.Title>Select Payment Method</Card.Title>
                            <Button variant="warning" className="m-2" onClick={() => setSelectedMethod('mtnMomo')}>
                                MTN Mobile Money
                            </Button>
                            <Button variant="danger" className="m-2" onClick={() => setSelectedMethod('mobileMoney')}>
                                Airtel and MTN Mobile Money
                            </Button>
                            <Button variant="primary" className="m-2" onClick={() => setSelectedMethod('card')} >
                                Card (Coming Soon)
                            </Button>

                            {selectedMethod === 'mtnMomo' && <MtnMomo />}
                            {selectedMethod === 'mobileMoney' && <MobileMoney />}
                            {selectedMethod === 'card' && <CardPayment />}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentMethods;
