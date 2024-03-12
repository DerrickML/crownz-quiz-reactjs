import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PaymentMethods.css';
import AirtelMoney from './AirtelMoney';
// import CardPayment from './CardPaymentA';
import CardPayment from './CardPaymentB';
import MTNMomo from './MTNMomo';

function PaymentMethods({ initialCoupon, price }) {
    const serverUrl = "https://2wkvf7-3000.csb.app";
    const originalPrice = price;

    const [stage, setStage] = useState('coupon'); // 'coupon', 'summary', or 'payment'
    const [coupon, setCoupon] = useState(initialCoupon || '');
    const [discountInfo, setDiscountInfo] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [couponLoader, setCouponLoader] = useState(false)
    const [finalPrice, setFinalPrice] = useState(originalPrice);

    const handleApplyCoupon = async () => {
        try {
            // Make an API call to validate the coupon
            setCouponLoader(true);
            const response = await fetch(`${serverUrl}/query/validate-coupon?code=${coupon}`);
            const data = await response.json();

            if (response.ok && data.couponDetails) {
                setDiscountInfo(data.couponDetails); // Set discount info from response
                setCouponError('');
            } else {
                setCouponError(data.message || 'Invalid coupon code');
            }
            setCouponLoader(false);
        } catch (error) {
            console.error('Error validating coupon:', error);
            setCouponError('Error validating coupon. Please try again.');
            setCouponLoader(false);
        }
    };

    const calculatePrice = () => {
        if (!discountInfo) return originalPrice;
        const discountValue = parseFloat(discountInfo.DiscountValue);
        switch (discountInfo.DiscountType) {
            case 'fixed':
                return Math.max(originalPrice - discountValue, 0);
            case 'percentage':
                return originalPrice * (1 - discountValue / 100);
            default:
                return originalPrice; // No discount applied
        }
    };

    // Update the final price when discountInfo changes
    useEffect(() => {
        setFinalPrice(calculatePrice());
    }, [discountInfo]);

    const handleNext = () => {
        if (stage === 'coupon') {
            setStage('payment');
        }
    };

    const handlePaymentSelection = (method) => {
        setSelectedMethod(method);
        setStage('makePayment');
    };

    const loaders = () => {
        <>
            <Spinner animation="grow" variant="primary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
        </>
    }

    return (
        <Container className="mt-5">
            {/* Stage 1: Apply Coupon */}
            {stage === 'coupon' && (
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Apply Coupon</Card.Title>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Coupon Code</Form.Label>
                                        <Form.Control type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon code" />
                                        {
                                            !couponLoader ? <Button variant="secondary" onClick={handleApplyCoupon}>Apply</Button> :
                                                // loaders()
                                                <>
                                                    <Spinner animation="grow" variant="primary" />
                                                    <Spinner animation="grow" variant="secondary" />
                                                    <Spinner animation="grow" variant="success" />
                                                </>
                                        }
                                    </Form.Group>
                                    {couponError && <Alert variant="danger">{couponError}</Alert>}
                                </Form>
                                <div>
                                    <p>Original Price: {originalPrice}</p>
                                    <p>Discount: {discountInfo ? discountInfo.DiscountValue : 0}</p>
                                    <p>Final Price: {finalPrice}</p>
                                    <Button variant="primary" onClick={handleNext}>Next</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Stage 2: Select Payment Method */}
            {stage === 'payment' && (
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Select Payment Method</Card.Title>
                                <Button variant="warning" onClick={() => handlePaymentSelection('MTNMomo')}>MTN Mobile Money</Button>
                                <Button variant="danger" onClick={() => handlePaymentSelection('AirtelMoney')}>Airtel Money</Button>
                                <Button variant="dark" onClick={() => handlePaymentSelection('CardPayment')}>Card Payment</Button>
                                <Button variant="secondary" onClick={() => setStage('coupon')}>Back to Coupon</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Stage 3: Make Payment */}
            {stage === 'makePayment' && (
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Complete Payment</Card.Title>
                                {selectedMethod === 'MTNMomo' && <MTNMomo price={finalPrice} />}
                                {selectedMethod === 'AirtelMoney' && <AirtelMoney price={finalPrice} />}
                                {selectedMethod === 'CardPayment' && <CardPayment price={finalPrice} />}
                                <Button variant="secondary" onClick={() => setStage('payment')}>Back to Payment Methods</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default PaymentMethods;