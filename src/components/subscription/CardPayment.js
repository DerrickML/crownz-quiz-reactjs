/* global FlutterwaveCheckout */
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from "uuid"; // UUID generation for unique identifiers
import { useAuth } from '../../context/AuthContext';


function CardPayment({ price }) {
    const { userInfo } = useAuth();
    const serverUrl = "https://2wkvf7-3000.csb.app"

    const [phone, setPhone] = useState(userInfo.phone || '');
    // const [email, setEmail] = useState(userInfo.email || 'crownzcom@gmail.com');
    const [email, setEmail] = useState('crownzcom@gmail.com');
    const [name, setName] = useState((userInfo.firstName ? userInfo.firstName : '') + ' ' + (userInfo.lastName ? userInfo.lastName : '') + ' ' + (userInfo.otherName ? userInfo.otherName : ''));
    const [message, setMessage] = useState('');
    const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone
    const [amount, setAmount] = useState(price ? price : '2000');

    const [formData, setFormData] = useState({
        // phone_number: phone,
        email: email,
        name: (userInfo.firstName ? userInfo.firstName : '') + ' ' + (userInfo.lastName ? userInfo.lastName : '') + ' ' + (userInfo.otherName ? userInfo.otherName : '')
    });

    const [paymentStatus, setPaymentStatus] = useState(null);

    // Phone number validation function
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber && !isValidPhoneNumber(phoneNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentStatus(null);

        setFormData({
            ...formData,
            // phone_number: phone, 
            email: email,
            name: name
        });

        // if (!formData.phone_number) {
        //     setMessage('Please enter phone number.');
        //     return;
        // }

        // Validate phone numbers
        const isUserPhoneValid = !validatePhoneNumber(phone);

        if (!isUserPhoneValid) {
            setPhoneError(!isUserPhoneValid);
            return;
        }

        try {

            FlutterwaveCheckout({
                public_key: "FLWPUBK_TEST-5ec66010de33c362b7a1730ce87479f5-X",
                tx_ref: `${uuidv4()}-${Date.now()}`,
                amount: amount,
                currency: "UGX",
                payment_options: "card",
                redirect_url: `${serverUrl}`,
                customer: formData,
                customizations: { //TODO: Replace with customizations or dynamically manipulated values
                    title: "Crownzcom",
                    description: "Payment for exam/quiz Points",
                    logo: `${serverUrl}/images/logo.png`,
                },
            });

        } catch (error) {
            console.error('Error making payment:', error);
            setPaymentStatus('Error making payment. Please try again.');
        }
    };

    return (
        <div className="mt-4">
            <h3>Payment with Card</h3>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Phone Number*</Form.Label>
                    <PhoneInput
                        className={`form-control ${phoneError ? "is-invalid" : "custom-phone-input "
                            }`}
                        placeholder="Enter phone number"
                        international
                        defaultCountry="UG"
                        countryCallingCodeEditable={false}
                        value={phone}
                        onChange={setPhone}
                        required
                    />
                    {phoneError && (
                        <Form.Control.Feedback type="invalid">
                            Invalid phone number
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Button variant="success" type="submit">Proceed to Complete Payment</Button>

                {paymentStatus && <Alert className="mt-3" variant="info">{paymentStatus}</Alert>}
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
