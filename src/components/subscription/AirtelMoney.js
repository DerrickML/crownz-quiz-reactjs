import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
function AirtelMoney({ propPrice, propPaymentFor }) {
    const { userInfo } = useAuth();

    const location = useLocation();
    const { price, paymentFor, points } = location.state || { price: 2000, paymentFor: 'points', points: 0 }; // Set defaultPrice and defaultPaymentFor accordingly

    const serverUrl = 'https://2wkvf7-3000.csb.app'

    const [phone, setPhone] = useState(userInfo.phone || '');
    // const [email, setEmail] = useState(userInfo.email || 'crownzcom@gmail.com');
    const [email, setEmail] = useState('crownzcom@gmail.com');
    const [message, setMessage] = useState('');
    const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone
    const [amount, setAmount] = useState(price ? price : '2000');

    // Extract the root URL (protocol + hostname + port)
    var rootURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    const [formData, setFormData] = useState({
        phone_number: phone,
        network: 'AIRTEL',
        amount: amount,
        currency: 'UGX',
        email: email,
        redirect_url: `${rootURL}/payment/verification`,
        meta: {
            userId: `${userInfo.userId}`,
            description: 'Payment for exam/quiz Points', //TODO: Make it dynamic
            service: `${paymentFor}`,
            points: `${points}`,
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

        setFormData({ ...formData, phone_number: phone }); // Move this line before the check
        // setFormData({ ...formData, phone_number: '256121212121' });


        if (!formData.phone_number) {
            setMessage('Please enter phone number.');
            return;
        }

        // Validate phone numbers
        const isUserPhoneValid = !validatePhoneNumber(phone);

        if (!isUserPhoneValid) {
            setPhoneError(!isUserPhoneValid);
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
            } else {
                setPaymentStatus(data.response.message);
            }
        } catch (error) {
            console.error('Error making payment:', error);
            setPaymentStatus('Error making payment. Please try again.');
        }
    };

    return (
        <div className='mt-4'>
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

                <Button variant='success' type='submit' disabled={!phone}>Pay with Mobile Money</Button>

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
