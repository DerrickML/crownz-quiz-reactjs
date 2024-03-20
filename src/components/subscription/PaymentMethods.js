import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { serverUrl } from '../../config'
// import OrderSummery2 from './OrderSummery2';

import './PaymentMethods.css';

function PaymentMethods({ initialCoupon, price, paymentFor, points, tier, studentInfo }) {
    const navigate = useNavigate();
    const originalPrice = price;

    const [stage, setStage] = useState('coupon'); // 'coupon', 'summary', or 'payment'
    const [coupon, setCoupon] = useState(initialCoupon || '');
    const [discountInfo, setDiscountInfo] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoader, setCouponLoader] = useState(false)
    const [finalPrice, setFinalPrice] = useState(originalPrice);
    const [paymentMadeFor, setPaymentMadeFor] = useState(paymentFor)

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
        navigate(`/payment/${method.toLowerCase()}`, { state: { price: finalPrice, paymentFor: paymentMadeFor, points: points, studentInfo: studentInfo } });
    };

    return (
        <div className="mt-5" style={{ marginTop: "" }} >
            {/* Stage 1: Order Summery and Apply Coupon */}
            {stage === 'coupon' && (
                <Row className="justify-content-md-center order-summary">
                    <Col md={8} lg={12}>
                        <Card className="text-center">
                            <Card.Header as="h2">Order Summary</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    You are about to purchase {points} points which you can use to attempt quizzes.
                                    <br />
                                    Package: {tier}
                                    <br />
                                    Price: ${finalPrice}
                                </Card.Text>
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
                                </div>
                                <Button variant="primary" onClick={handleNext}>Proceed to Payment</Button>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                                <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Stage 2: Select Payment Method */}
            {stage === 'payment' && (
                <Row className="justify-content-center my-5">
                    <h2 className="text-center mb-4 w-100">Select Payment Method</h2>
                    <Col lg={4} className="d-flex justify-content-center">
                        <Card border="warning" className={`text-center package-card shadow-lg`} style={{ width: '18rem' }} onClick={() => handlePaymentSelection('mtn-momo')}>
                            <Card.Header style={{ backgroundColor: 'orange', color: 'white' }}>
                                MTN Mobile Money
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Img variant="top" src={`${serverUrl}/images/mtnmomo.png`} className="card-img-centered" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="d-flex justify-content-center">
                        <Card border="danger" className={`text-center package-card shadow-lg`} style={{ width: '18rem' }} onClick={() => handlePaymentSelection('airtel-money')}>
                            <Card.Header style={{ backgroundColor: 'red', color: 'white' }}>
                                Airtel Money
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Img variant="top" src={`${serverUrl}/images/airtel-money.png`} className="card-img-centered" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="d-flex justify-content-center">
                        <Card border="info" className={`text-center package-card shadow-lg`} style={{ width: '18rem' }} onClick={() => handlePaymentSelection('card-payment')}>
                            <Card.Header style={{ backgroundColor: '#2a9d8f', color: 'white' }}>
                                Card
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Img variant="top" src={`${serverUrl}/images/credit-card.png`} className="card-img-centered" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8} style={{ paddingTop: '15px' }}>
                        <Button variant="secondary" onClick={() => setStage('coupon')}>Back to Order Summery</Button>
                    </Col>
                </Row>

            )}
        </div>
    );
}

export default PaymentMethods;