import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Form, InputGroup, Container, Row, Col, Alert } from 'react-bootstrap';
import DropIn from 'braintree-web-drop-in-react';

const SubscriptionComponent = () => {
    const { userInfo } = useAuth();
    const educationLevel = userInfo ? userInfo.educationLevel : 'Unknown';

    const basePrice = 10; // Base subscription price
    const [currentPrice, setCurrentPrice] = useState(basePrice); // Current price after applying coupon
    const [couponCode, setCouponCode] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [clientToken, setClientToken] = useState(null);
    const [instance, setInstance] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState({ success: false, message: '' });

    useEffect(() => {
        // Fetch the client token from your server
        fetchClientToken();
    }, []);


    const handleCouponChange = (event) => {
        setCouponCode(event.target.value);
    };

    const applyCoupon = () => {
        // Mock coupon validation
        if (couponCode === "DISCOUNT50") {
            setIsCouponApplied(true);
            const discountedPrice = basePrice * 0.5; // 50% discount
            setCurrentPrice(discountedPrice);
            alert("Coupon Applied: 50% Discount");
        } else {
            alert("Invalid Coupon Code");
        }
    };

    const handleSubscription = async () => {
        if (!instance) {
            alert('Payment instance not loaded');
            return;
        }

        try {
            setPaymentProcessing(true);
            const { nonce } = await instance.requestPaymentMethod();
            // Send nonce to your server for payment processing
            processPayment(nonce);
        } catch (error) {
            console.error("Error processing payment:", error);
            setPaymentProcessing(false);
        }
    };

    const fetchClientToken = async () => {
        try {
            // Replace this URL with the endpoint on your server
            const response = await fetch('http://localhost:3001/api/braintree/getClientToken/');
            const data = await response.json();
            setClientToken(data.clientToken);
        } catch (error) {
            console.error("Error fetching client token:", error);
        }
    };

    const processPayment = async (nonce) => {
        // Simulate sending the nonce to the server for processing
        try {
            const response = await fetch('http://localhost:3001/api/braintree/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentMethodNonce: nonce, amount: currentPrice.toString() })
            });

            const data = await response.json();
            if (data.success) {
                setSubscriptionStatus({ success: true, message: 'Payment Successful!' });
            } else {
                setSubscriptionStatus({ success: false, message: 'Payment Failed: ' + data.message });
            }
        } catch (error) {
            setSubscriptionStatus({ success: false, message: 'Payment Processing Error' });
        }
        setPaymentProcessing(false);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h3>Subscribe to Tier: {educationLevel}</h3>
                    {/* Display subscription price based on educationLevel */}
                    {/* Implement actual pricing logic */}
                    <p>Subscription Price: ${currentPrice.toFixed(2)}</p>
                    <Form>
                        <Form.Group>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={handleCouponChange}
                                    disabled={isCouponApplied}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={applyCoupon}
                                    disabled={isCouponApplied}>
                                    Apply Coupon
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        {clientToken && (
                            <DropIn
                                options={{ authorization: clientToken }}
                                onInstance={instance => setInstance(instance)}
                            />
                        )}
                        <Button
                            variant="primary"
                            onClick={handleSubscription}
                            disabled={paymentProcessing}
                            className="d-block w-100"
                        >
                            {paymentProcessing ? 'Processing...' : 'Subscribe'}
                        </Button>
                    </Form>
                    {subscriptionStatus.message && (
                        <Alert variant={subscriptionStatus.success ? 'success' : 'danger'}>
                            {subscriptionStatus.message}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SubscriptionComponent;
