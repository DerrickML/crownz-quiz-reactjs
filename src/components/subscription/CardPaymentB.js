import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'; // UUID generation for unique identifiers
import { useAuth } from '../../context/AuthContext';
import { serverUrl } from '../../config';

function CardPayment({ propPrice, propPaymentFor, propStudentInfo }) {
    const { userInfo } = useAuth();
    const isStudent = userInfo.labels.includes("student");
    const isNextOfKin = userInfo.labels.includes("kin");

    const navigate = useNavigate();
    const location = useLocation();
    const { price, paymentFor, points, studentInfo } = location.state || { price: null, paymentFor: 'points', points: 0, studentInfo: { userId: '', name: '', educationLevel: '' } }; // Set default values accordingly

    //Destructuring student information
    const { userId: studentId, name: studentName, educationLevel } = studentInfo;

    useEffect(() => {
        console.log('Price passed to MTN: ', price)
        if (!price) {
            navigate(-1);
        }
    }, []);

    console.log(userInfo)

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
    const [submit, setSubmit] = useState(false);

    // Phone number validation function
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber && !isValidPhoneNumber(phoneNumber);
    };

    const initiatePayment = async () => {
        try {
            const dataToSend = {
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
                    description: `Payment for exam/quiz Points${isStudent ? '.' : ` for ${studentName}`}`,
                    service: `${paymentFor}`,
                    points: `${points}`,
                    ...(isStudent ? {} : { studentName: studentName, studentId: studentId, educationLevel: educationLevel }), // Conditional spread operator for adding studentInfo
                },
                customizations: {
                    title: 'Crownzcom',
                    description: `Payment for exam/quiz Points${isStudent ? '.' : ` for ${studentName}`}`,
                    logo: `${serverUrl}/images/logo.png`
                }
            }

            console.log('Data to send to flutterwave: ', dataToSend)

            const response = await fetch(`${serverUrl}/flutterwave/card-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    dataToSend
                ),
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
        setSubmit(true);
        e.preventDefault();
        setPaymentStatus(null);

        // Validate phone number
        if (validatePhoneNumber(phone)) {
            setPhoneError(true);
            return;
        }

        await initiatePayment();

        setSubmit(false);
    };

    return (
        <div className='mt-4' style={{ marginTop: "100px" }} >
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
                {
                    !submit ? <Button variant='success' type='submit'>Proceed to Complete Payment</Button> :
                        <>
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                        </>
                }

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
