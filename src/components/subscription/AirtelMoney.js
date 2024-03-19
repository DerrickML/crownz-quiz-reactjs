import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { serverUrl, rootUrl } from '../../config.js';

function AirtelMoney({ propPrice, propPaymentFor, propStudentInfo }) {
    const { userInfo } = useAuth();
    const isStudent = userInfo.labels.includes("student");
    const isNextOfKin = userInfo.labels.includes("kin");

    const navigate = useNavigate();
    const location = useLocation();
    const { price, paymentFor, points, studentInfo } = location.state || { price: null, paymentFor: 'points', points: 0, studentInfo: { userId: '', name: '', educationLevel: '' } }; // Set default values accordingly

    //Destructuring student information
    const { userId: studentId, name: studentName, educationLevel } = studentInfo;

    console.log('Student Information: ', JSON.stringify(studentInfo))

    useEffect(() => {
        console.log('Price passed to MTN: ', price)
        if (!price) {
            navigate(-1);
        }
    }, []);

    const [phone, setPhone] = useState(userInfo.phone || '');
    // const [email, setEmail] = useState(userInfo.email || 'crownzcom@gmail.com');
    const [email, setEmail] = useState('crownzcom@gmail.com');
    const [message, setMessage] = useState('A page will load shortly after requesting you to enter a OTP. The OTP is 123456');
    const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone
    const [amount, setAmount] = useState(price ? price : '2000');
    const [submit, setSubmit] = useState(false);

    // Extract the root URL (protocol + hostname + port)
    var rootURL = rootUrl;

    const [formData, setFormData] = useState({
        phone_number: phone,
        network: 'AIRTEL',
        amount: amount,
        currency: 'UGX',
        email: email,
        redirect_url: `${rootURL}/payment/verification`,
        meta: {
            userId: `${userInfo.userId}`,
            description: `Payment for exam/quiz Points${isStudent ? '.' : ` for ${studentName}`}`,
            service: `${paymentFor}`,
            points: `${points}`,
            ...(isStudent ? {} : { studentName: studentName, studentId: studentId, educationLevel: educationLevel }), // Conditional spread operator for adding studentInfo
        }
    });
    const [paymentStatus, setPaymentStatus] = useState(null);

    // Phone number validation function
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber && !isValidPhoneNumber(phoneNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentStatus(null);

        setSubmit(true);

        setFormData({ ...formData, phone_number: phone });
        // setFormData({ ...formData, phone_number: '256121212121' });


        if (!formData.phone_number) {
            setMessage('Please enter phone number.');
            setSubmit(false);
            return;
        }

        // Validate phone numbers
        const isUserPhoneValid = !validatePhoneNumber(phone);

        if (!isUserPhoneValid) {
            setPhoneError(!isUserPhoneValid);
            setSubmit(false);
            return;

        }

        try {

            const response = await fetch(`${serverUrl}/flutterwave/mobile-money-pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Pay response Data:\n', data);
            if (data.response.status === 'success' && data.response.meta.authorization.mode === 'redirect') {
                window.location.href = data.response.meta.authorization.redirect;
                setPaymentStatus('A page will load shortly requesting you to enter OTP received on your phone')
                alert('A page will load shortly requesting you to enter OTP. OTP is 123456');
            } else {
                setPaymentStatus(data.response.message);
                setSubmit(false);
            }
        } catch (error) {
            console.error('Error making payment:', error);
            setPaymentStatus('Error making payment. Please try again.');
            setSubmit(false);
        }
    };

    return (
        <div className='mt-4' style={{ marginTop: "100px" }} >
            <h3>Mobile Money Payment</h3>
            <Form onSubmit={handleSubmit}>
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
                    !submit ? <Button variant='success' type='submit' disabled={!phone}>Pay with Mobile Money</Button> :
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

AirtelMoney.propTypes = {
    price: PropTypes.number
};

AirtelMoney.defaultProps = {
    price: 2000
};

export default AirtelMoney;
