import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'; // UUID generation for unique identifiers
import { useAuth } from '../../context/AuthContext';

function CardPayment({ propPrice, propPaymentFor }) {
    const { userInfo } = useAuth();

    const location = useLocation();
    const { price, paymentFor, points } = location.state || { price: 2000, paymentFor: 'points', points: 0 }; // Set defaultPrice and defaultPaymentFor accordingly

    console.log(userInfo)
    const serverUrl = 'https://2wkvf7-3000.csb.app'

    // Extract the root URL (protocol + hostname + port)
    var rootURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    const [userId, setUserId] = useState(userInfo ? userInfo.userId : '');
    const [phone, setPhone] = useState(userInfo ? userInfo.phone : '');
    const [email, setEmail] = useState('crownzcom@gmail.com');
    const [name, setName] = useState((userInfo ? userInfo.firstName : '') + ' ' + (userInfo ? userInfo.lastName : ''));
    const [phoneError, setPhoneError] = useState(false);
    const [amount, setAmount] = useState(price ? price : '2000');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [message, setMessage] = useState('');


    // Phone number validation function
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber && !isValidPhoneNumber(phoneNumber);
    };

    const initiatePayment = async () => {
        try {
            const response = await fetch(`${serverUrl}/flutterwave/card-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tx_ref: `${uuidv4()}`,
                    amount: amount,
                    currency: 'UGX',
                    // redirect_url: `${serverUrl}`,
                    redirect_url: `${rootURL}/payment/verification`,
                    payment_options: 'card',
                    customer: {
                        email: email,
                        phonenumber: phone,
                        name: name
                    },
                    meta: {
                        userId: `${userId}`,
                        description: 'Payment for exam/quiz Points', //TODO: Make it dynamic
                        service: `${paymentFor}`,
                        points: `${points}`,
                    },
                    customizations: {
                        title: 'Crownzcom',
                        description: 'Payment for exam/quiz Points',
                        logo: `${serverUrl}/images/logo.png`
                    }
                }),
            });
            const data = await response.json();
            console.log('Data: ', data)
            if (data && data.status === 'success') {
                window.open(data.data.link, '_blank'); // Open the payment link in a new tab
                // window.location.href = data.data.link; // Redirect to the payment link without opening new tab

            } else {
                setPaymentStatus('Error initiating payment. Please try again.');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            setPaymentStatus('Error initiating payment. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentStatus(null);

        // Validate phone number
        if (validatePhoneNumber(phone)) {
            setPhoneError(true);
            return;
        }

        await initiatePayment();
    };

    return (
        <div className='mt-4'>
            <h3>Payment with Card</h3>

            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Phone Number*</Form.Label>
                    <PhoneInput
                        className={`form-control ${phoneError ? 'is-invalid' : 'custom-phone-input '
                            }`}
                        placeholder='Enter phone number'
                        international
                        defaultCountry='UG'
                        countryCallingCodeEditable={false}
                        value={phone}
                        onChange={setPhone}
                        required
                    />
                    {phoneError && (
                        <Form.Control.Feedback type='invalid'>
                            Invalid phone number
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Button variant='success' type='submit'>Proceed to Complete Payment</Button>

                {paymentStatus && <Alert className='mt-3' variant='info'>{paymentStatus}</Alert>}
            </Form>
            {message && <p>{message}</p>}
        </div>
    );
}

CardPayment.propTypes = {
    price: PropTypes.number
};

CardPayment.defaultProps = {
    price: 2000
};

export default CardPayment;
