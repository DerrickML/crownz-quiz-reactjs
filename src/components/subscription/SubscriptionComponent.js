import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

const SubscriptionComponent = () => {
    const { userInfo } = useAuth();
    const educationLevel = userInfo ? userInfo.educationLevel : 'Unknown';

    // FLUTTERWAVE
    const config = {
        public_key: 'FLWPUBK_TEST-5ec66010de33c362b7a1730ce87479f5-X',
        tx_ref: Date.now(),
        amount: 100,
        currency: 'UGX',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: 'derrickmal123@gmail.com',
            phone_number: '0774546556',
            name: 'john doe',
        },
        customizations: {
            title: 'My store',
            description: 'Payment for items in cart',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };

    const fwConfig = {
        ...config,
        text: 'Pay with Flutterwave!',
        callback: (response) => {
            console.log(response);
            closePaymentModal() // this will close the modal programmatically
        },
        onClose: () => { },
    };

    return (
        <Container style={{ marginTop: "100px" }}>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h3>Subscribe to Tier: {educationLevel}</h3>
                    <Form>
                        <FlutterWaveButton {...fwConfig} />
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SubscriptionComponent;
